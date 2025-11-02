"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import CategorySelectorModal from "../CategorySelectorModal";
import CitySelectorModal from "../CitySelectorModal";
import Step1BasicInfo from "./Steps/Step1BasicInfo";
import Step2Details from "./Steps/Step2Details";
import Step3Media from "./Steps/Step3Media";
import axiosInstance from "@/lib/axiosInstance";
import { useRouter } from "next/navigation";
import { submitForm, validateStep } from "./lib/common";
import Step4Branches from "./Steps/Step4Branches";
import Modal from "@/ui/Modal";
import { Branch } from "./Steps/Step4Branches/BranchList";
import AddressSearchMap2GIS from "./Steps/Step4Branches/BranchList/AddressSearchMap2GIS";

export type OfferFormValues = {
  title: string;
  description: string;
  offerType: string;
  hasMinPrice: boolean;
  minPrice: string;
  hasConditions: boolean;
  conditions: string;
  hasEndDate: boolean;
  startDate: string;
  endDate: string;
  posters: File[];
};

export type OfferType = {
  code: string;
  name: string;
  description: string;
  is_active: boolean;
};

export type OfferFormChangeHandler = <K extends keyof OfferFormValues>(
  field: K,
  value: OfferFormValues[K]
) => void;

export default function OfferForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCityOpen, setModalCityOpen] = useState(false);

  const [category, setCategory] = useState<any>(null);
  const [categoryPath, setCategoryPath] = useState<any[]>([]);
  const [city, setCity] = useState<any>(null);

  const [offerTypes, setOfferTypes] = useState<OfferType[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [wasSubmitted, setWasSubmitted] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [branches, setBranches] = useState<
    { id: string; name: string; address: string; coords: [number, number] }[]
  >([]);
  const [isBranchModalOpen, setBranchModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  const [branchLocation, setBranchLocation] = useState<[number, number] | null>(null);
  const [branchAddress, setBranchAddress] = useState<string | null>(null);

  const handleAddressSelect = (coords: [number, number], address: string) => {
    setBranchLocation(coords);
    setBranchAddress(address);
    // Здесь можно обновить основное состояние формы, например:
    // handleChange("branchCoords", coords);
    // handleChange("branchAddress", address);
  };

  const handleAddBranch = (coords: [number, number], address: string) => {
    const newBranch: Branch = {
      id: Date.now().toString(),
      name: address.split(",")[0] || "Филиал",
      address,
      coords,
    };
    setBranches((prev) => [...prev, newBranch]);
    setBranchModalOpen(false);
  };

  const handleRemoveBranch = (id: string) => {
    setBranches((prev) => prev.filter((b) => b.id !== id));
  };

  const handleOpenBranchModal = (branch: Branch | null) => {
    setSelectedBranch(branch);
    setBranchModalOpen(true);
  };

  const [values, setValues] = useState<OfferFormValues>({
    hasEndDate: false,
    title: "",
    description: "",
    offerType: "",
    hasMinPrice: false,
    minPrice: "",
    hasConditions: false,
    conditions: "",
    startDate: "",
    endDate: "",
    posters: [],
  });

  const totalSteps = 4;
  const titles = [
    "Шаг 1 из 4: Основная информация",
    "Шаг 2 из 4: Детали и условия",
    "Шаг 3 из 4: Визуальное оформление",
    "Шаг 4 из 4: Филиалы компании",
  ];

  // --- Загрузка типов предложений ---
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const { data } = await axiosInstance.get<OfferType[]>("/offer-types");
        setOfferTypes(data.filter((t) => t.is_active));
      } catch (err) {
        console.error("Ошибка загрузки типов:", err);
      }
    };
    fetchTypes();
  }, []);

  // --- Валидация ---
  const errors = useMemo(() => validateStep(currentStep, values, category, city), [currentStep, values, category, city]);

  const handleChange: OfferFormChangeHandler = useCallback((field, val) => {
    setValues((prev) => ({ ...prev, [field]: val }));
  }, []);

  const isValidStep = useCallback(() => {
    const stepErrors = validateStep(currentStep, values, category, city);
    const isValid = Object.keys(stepErrors).length === 0;
    if (!isValid) {
      setWasSubmitted(true);
      alert('Пожалуйста, заполните все обязательные поля на этом шаге.');
    }
    return isValid;
  }, [currentStep, values, category, city]);

  const handleNext = useCallback(() => {
    if (isValidStep()) {
      setCurrentStep(prev => prev + 1);
    }
  }, [isValidStep]);

  const handlePrev = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidStep()) return;

    try {
      setSubmitting(true);
      setWasSubmitted(true);

      const data = await submitForm(values, category, city, router);

      console.log("✅ Успешно создано:", data);
      setSuccess(true);
      setMessage("Предложение сохранено!");
      router.push('/offers/my');
    } catch (err: any) {
      console.error(err);
      setSuccess(false);
      setMessage(err?.response?.data?.message || "Ошибка при сохранении");
      alert(err?.response?.data?.message || "Ошибка при сохранении");
    } finally {
      setSubmitting(false);
    }
  }, [values, category, city, router, isValidStep]);

  const renderStepContent = useMemo(() => {
    switch (currentStep) {
      case 1:
        return (
          <Step1BasicInfo
            onAddressSelect={handleAddressSelect}
            values={values}
            errors={errors}
            wasSubmitted={wasSubmitted}
            offerTypes={offerTypes}
            categoryPath={categoryPath}
            city={city}
            handleChange={handleChange}
            onOpenCategoryModal={() => setModalOpen(true)}
            onOpenCityModal={() => setModalCityOpen(true)}
          />
        );
      case 2:
        return (
          <Step2Details
            values={values}
            errors={errors}
            wasSubmitted={wasSubmitted}
            handleChange={handleChange}
          />
        );
      case 3:
        return (
          <Step3Media
            values={values}
            handleChange={handleChange}
            submitting={submitting}
            message={message}
            success={success}
            handleSubmit={handleSubmit}
          />
        );
      case 4:
        return (
          <Step4Branches
            branches={branches}
            onAddBranch={() => handleOpenBranchModal(null)}
            onEditBranch={(branch) => handleOpenBranchModal(branch)}
            onRemoveBranch={(id) =>
              setBranches((prev) => prev.filter((b) => b.id !== id))
            }
          />
        );
      default:
        return null;
    }
  }, [currentStep, values, errors, wasSubmitted, offerTypes, categoryPath, city, handleChange, submitting, message, success, handleSubmit]);

  return (
    <div className="w-full space-y-8 md:p-8 md:bg-white md:border md:border-gray-200 md:shadow-sm md:rounded-xl">
      <div className="mb-6 border-b pb-4">
        <div className="text-xl font-extrabold text-gray-900 mt-3 mb-2">
          {titles[currentStep - 1]}
        </div>
        <div className="flex justify-center mt-3">
          {Array.from({ length: totalSteps }).map((_, index) => {
            const step = index + 1;
            let indicatorClass = 'bg-gray-300';
            if (step === currentStep) indicatorClass = 'bg-blue-600';
            else if (step < currentStep) indicatorClass = 'bg-blue-300';
            return (
              <span key={step} className={`w-3 h-3 rounded-full mx-1 transition-all duration-300 ${indicatorClass}`}></span>
            );
          })}
        </div>
      </div>

      <div>
        {renderStepContent}

        <div className="mt-8 flex gap-2">
          <button
            type="button"
            onClick={handlePrev}
            className={`w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors duration-300 shadow-lg shadow-blue-200 ${currentStep === 1 ? 'opacity-0 cursor-default' : ''}`}
            disabled={currentStep === 1}
          >
            Назад
          </button>
          {currentStep < totalSteps && (
            <button
              onClick={handleNext}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors duration-300 shadow-lg shadow-blue-200"
            >
              Далее
            </button>
          )}
        </div>
      </div>

      <CategorySelectorModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={(cat, fullPath) => {
          setCategory(cat);
          setCategoryPath(fullPath);
        }}
        initialCategoryPath={categoryPath}
        selectedCategoryId={category?.id || null}
      />
      <CitySelectorModal
        open={modalCityOpen}
        onClose={() => setModalCityOpen(false)}
        onSelect={(selectedCity) => setCity(selectedCity)}
        selectedCityCode={city?.slug || null}
      />

      <Modal
        isOpen={isBranchModalOpen}
        onClose={() => setBranchModalOpen(false)}
        title={
          selectedBranch
            ? `Филиал: ${selectedBranch.name}`
            : "Выберите филиал на карте"
        }
        className="h-[85vh] !p-2 sm:rounded-xl"
      >
        <AddressSearchMap2GIS
          onAddressSelect={handleAddBranch}
          initialCoords={selectedBranch?.coords}
          initialName={selectedBranch?.name}
        />
      </Modal>
    </div>
  );
}