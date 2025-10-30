"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import CategorySelectorModal from "../CategorySelectorModal";
import CitySelectorModal from "../CitySelectorModal";
import Step1BasicInfo from "./Step1BasicInfo";
import Step2Details from "./Step2Details";
import Step3Media from "./Step3Media";
import axiosInstance from "@/lib/axiosInstance";
import { useRouter } from "next/navigation";

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

const validateStep = (step: number, values: OfferFormValues, category: any, city: any) => {
  const errors: Record<string, string> = {};

  if (step === 1) {
    if (!values.title.trim()) errors.title = "Введите название";
    if (!values.description.trim()) errors.description = "Введите описание";
    if (!values.offerType) errors.offerType = "Выберите тип предложения";
    if (!category?.id) errors.categoryId = "Выберите категорию";
    if (!city?.slug) errors.cityCode = "Выберите город";
  } else if (step === 2) {
    if (values.hasMinPrice && (!values.minPrice.trim() || isNaN(Number(values.minPrice)))) {
      errors.minPrice = "Укажите корректную цену";
    }
    if (values.hasConditions && !values.conditions.trim()) {
      errors.conditions = "Укажите условия";
    }
    if (values.hasEndDate) {
      if (!values.startDate) errors.startDate = "Укажите дату начала";
      if (!values.endDate) errors.endDate = "Укажите дату окончания";
      if (values.startDate && values.endDate && values.startDate > values.endDate) {
        errors.endDate = "Дата окончания не может быть раньше начала";
      }
    }
  }
  // На шаге 3 можно добавить валидацию постеров, если нужно

  return errors;
};

const submitForm = async (values: OfferFormValues, category: any, city: any, router: any) => {
  const payload: any = {
    title: values.title,
    description: values.description,
    offerTypeCode: values.offerType,
    hasMinPrice: values.hasMinPrice,
    hasConditions: values.hasConditions,
    hasEndDate: values.hasEndDate,
    categoryId: category.id,
    cityCode: city.slug,
  };

  if (values.hasMinPrice) payload.minPrice = values.minPrice;
  if (values.hasConditions) payload.conditions = values.conditions;
  if (values.hasEndDate) {
    payload.startDate = values.startDate;
    payload.endDate = values.endDate;
  }

  const formData = new FormData();
  Object.entries(payload).forEach(([key, val]) => {
    formData.append(key, String(val));
  });
  values.posters.forEach((file) => formData.append("posters", file));

  const { data } = await axiosInstance.post("/offers", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data;
};

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

  const totalSteps = 3;
  const titles = [
    'Шаг 1 из 3: Основная информация',
    'Шаг 2 из 3: Детали и условия',
    'Шаг 3 из 3: Визуальное оформление',
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
      default:
        return <div>Неизвестный шаг.</div>;
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
    </div>
  );
}