"use client";

import { useEffect, useState, useMemo, useCallback, memo } from "react";
import CategorySelectorModal from "../CategorySelectorModal";
import CitySelectorModal from "../CitySelectorModal";
import Step1BasicInfo from "./Steps/Step1BasicInfo";
import Step2Details from "./Steps/Step2Details";
import Step3Media from "./Steps/Step3Media";
import Step4Branches from "./Steps/Step4Branches";
import axiosInstance from "@/lib/axiosInstance";
import { useRouter } from "next/navigation";
import { submitForm, validateStep } from "./lib/common";
import Modal from "@/ui/Modal";
import { Branch } from "./Steps/Step4Branches/BranchList";
import AddressSearchMap2GIS from "./Steps/Step4Branches/BranchList/AddressSearchMap2GIS";
import StepLayout from "./StepLayout";
import toast from "react-hot-toast";

const MemoStep1 = memo(Step1BasicInfo);
const MemoStep2 = memo(Step2Details);
const MemoStep3 = memo(Step3Media);
const MemoStep4 = memo(Step4Branches);

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

export default function OfferForm() {
  const router = useRouter();
  const totalSteps = 4;

  const [currentStep, setCurrentStep] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCityOpen, setModalCityOpen] = useState(false);
  const [isBranchModalOpen, setBranchModalOpen] = useState(false);

  const [category, setCategory] = useState<any>(null);
  const [categoryPath, setCategoryPath] = useState<any[]>([]);
  const [city, setCity] = useState<any>(null);

  const [offerTypes, setOfferTypes] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [wasSubmitted, setWasSubmitted] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

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

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const { data } = await axiosInstance.get("/offer-types");
        setOfferTypes(data.filter((t: any) => t.is_active));
      } catch (err) {
        console.error("Ошибка загрузки типов:", err);
      }
    };
    fetchTypes();
  }, []);

  const errors = useMemo(
    () => validateStep(currentStep, values, category, city),
    [currentStep, values, category, city]
  );

  const handleChange = useCallback(
    <K extends keyof OfferFormValues>(field: K, value: OfferFormValues[K]) => {
      setValues((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const isValidStep = useCallback(() => {
    const stepErrors = validateStep(currentStep, values, category, city);
    const isValid = Object.keys(stepErrors).length === 0;
    if (!isValid) {
      setWasSubmitted(true);
      alert("Пожалуйста, заполните обязательные поля на этом шаге.");
    }
    return isValid;
  }, [currentStep, values, category, city]);

  const handleNext = useCallback(() => {
    if (isValidStep()) setCurrentStep((prev) => prev + 1);
  }, [isValidStep]);

  const handlePrev = useCallback(() => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  }, [currentStep]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!isValidStep()) return;

      try {
        setSubmitting(true);
        setWasSubmitted(true);
        const data = await submitForm(values, category, city, router);
        setSuccess(true);
        setMessage("Предложение сохранено!");
        router.push("/offers/my");
      } catch (err: any) {
        console.error(err);
        setSuccess(false);
        setMessage(err?.response?.data?.message || "Ошибка при сохранении");
        alert(err?.response?.data?.message || "Ошибка при сохранении");
      } finally {
        setSubmitting(false);
      }
    },
    [values, category, city, router, isValidStep]
  );

  const handleAddBranch = useCallback(
    (item: Branch) => {
      const exists = branches.some(
        (b) =>
          b.name.trim().toLowerCase() ===
          item.name.trim().toLowerCase() ||
          (b.coords[0] === item.coords[0] && b.coords[1] === item.coords[1])
      );
      if (exists) {
        toast.error("Этот филиал уже добавлен!");
        return;
      }
      const newBranch: Branch = {
        id: Date.now().toString(),
        name: item.name.split(",")[0] || "Филиал",
        address_name: item.address_name,
        coords: item.coords,
        point: item.point
      };

      setBranches([...branches, newBranch]);
      toast.success("Филиал успешно добавлен!");
      setBranchModalOpen(false);
    },
    [branches]
  );

  const handleOpenBranchModal = useCallback((branch: Branch | null) => {
    setSelectedBranch(branch);
    setBranchModalOpen(true);
  }, []);

  const handleRemoveBranch = useCallback((id: string) => {
    setBranches((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const renderStepContent = useMemo(() => {
    switch (currentStep) {
      case 1:
        return (
          <MemoStep1
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
          <MemoStep2
            values={values}
            errors={errors}
            wasSubmitted={wasSubmitted}
            handleChange={handleChange}
          />
        );
      case 3:
        return (
          <MemoStep3 posters={values.posters} handleChange={handleChange} />
        );
      case 4:
        return (
          <MemoStep4
            branches={branches}
            onAddBranch={() => handleOpenBranchModal(null)}
            onEditBranch={handleOpenBranchModal}
            onRemoveBranch={handleRemoveBranch}
          />
        );
      default:
        return null;
    }
  }, [
    currentStep,
    values,
    errors,
    wasSubmitted,
    offerTypes,
    categoryPath,
    city,
    handleChange,
    submitting,
    message,
    success,
    handleSubmit,
    handleOpenBranchModal,
    handleRemoveBranch,
    branches,
  ]);

  return (
    <>
      <StepLayout
        currentStep={currentStep}
        totalSteps={totalSteps}
        onNext={handleNext}
        onPrev={handlePrev}
      >
        {renderStepContent}
      </StepLayout>

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
        className="!h-[100svh] !w-[100svw] !p-4 !rounded-none"
        overlayClassName="!p-0"
      >
        <AddressSearchMap2GIS
          onAddressSelect={handleAddBranch}
          initialCoords={selectedBranch?.coords}
          initialName={selectedBranch?.name}
          allBranches={branches}
        />
      </Modal>
    </>
  );
}
