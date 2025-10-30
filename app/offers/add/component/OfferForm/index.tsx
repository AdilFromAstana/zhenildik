"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import CategorySelectorModal from "../CategorySelectorModal";
import CitySelectorModal from "../CitySelectorModal";
import BasicInfoSection from "./BasicInfoSection";
import PriceSection from "./PriceSection";
import ConditionsSection from "./ConditionsSection";
import DateRangeSection from "./DateRangeSection";
import PosterUploadSection from "./PosterUploadSection";
import SubmitSection from "./SubmitSection";
import axiosInstance from "@/lib/axiosInstance";
import { useRouter } from "next/navigation";
import { ChevronLeft } from 'lucide-react';

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

  const totalSteps = 3; // 1. Основы + Категория/Город, 2. Цена/Условия/Даты, 3. Постеры/Отправка
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

  function validate(v: OfferFormValues) {
    const e: Record<string, string> = {};
    if (!v.title.trim()) e.title = "Введите название";
    if (!v.description.trim()) e.description = "Введите описание";
    if (!v.offerType) e.offerType = "Выберите тип предложения";
    if (v.hasMinPrice && (!v.minPrice.trim() || isNaN(Number(v.minPrice))))
      e.minPrice = "Укажите корректную цену";
    if (v.hasConditions && !v.conditions.trim())
      e.conditions = "Укажите условия";
    if (v.hasEndDate) {
      if (!v.startDate) e.startDate = "Укажите дату начала";
      if (!v.endDate) e.endDate = "Укажите дату окончания";
      if (v.startDate && v.endDate && v.startDate > v.endDate) {
        e.endDate = "Дата окончания не может быть раньше начала";
      }
    }
    if (!category?.id) e.categoryId = "Выберите категорию";
    if (!city?.slug) e.cityCode = "Выберите город";
    return e;
  }

  const errors = useMemo(() => validate(values), [values, category, city]);

  const handleChange: OfferFormChangeHandler = (field, val) => {
    setValues((prev) => ({ ...prev, [field]: val }));
  };

  const isValidStep = (step: number) => {
    const stepErrors: (keyof OfferFormValues | string)[] = [];
    if (step === 1) {
      if (!values.title.trim()) stepErrors.push('title');
      if (!values.description.trim()) stepErrors.push('description');
      if (!values.offerType) stepErrors.push('offerType');
      if (!category?.id) stepErrors.push('categoryId');
      if (!city?.slug) stepErrors.push('cityCode');
    }
    if (step === 2) {
      if (values.hasMinPrice && (!values.minPrice.trim() || isNaN(Number(values.minPrice)))) stepErrors.push('minPrice');
      if (values.hasConditions && !values.conditions.trim()) stepErrors.push('conditions');
      if (values.hasEndDate) {
        if (!values.startDate) stepErrors.push('startDate');
        if (!values.endDate) stepErrors.push('endDate');
        if (values.startDate && values.endDate && values.startDate > values.endDate) stepErrors.push('endDate');
      }
    }
    if (step === 3) {
      // Можно добавить валидацию постеров, если нужно
    }

    if (stepErrors.length > 0) {
      setWasSubmitted(true);
      // Вместо alert, можно использовать кастомную модалку
      alert('Пожалуйста, заполните все обязательные поля на этом шаге.');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (isValidStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidStep(totalSteps)) return;

    try {
      setSubmitting(true);
      setWasSubmitted(true);

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
  };

  // --- Рендер содержимого шага ---
  const renderStepContent = useMemo(() => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <BasicInfoSection
              title={values.title}
              description={values.description}
              offerType={values.offerType}
              categoryPath={categoryPath}
              offerTypes={offerTypes}
              errors={errors}
              wasSubmitted={wasSubmitted}
              onChange={handleChange}
              onOpenCategoryModal={() => setModalOpen(true)}
            />
            {/* --- Блок выбора города --- */}
            <div className="flex flex-col space-y-2 mt-6">
              <label className="text-sm font-medium text-gray-700">Город <span className="text-red-500">*</span></label>
              <button
                type="button"
                onClick={() => setModalCityOpen(true)}
                className="px-4 py-2 border rounded-lg text-left hover:bg-gray-50"
              >
                {city ? city.name : "Выбрать город"}
              </button>
              {wasSubmitted && !city?.slug && errors.cityCode && (
                <p className="text-red-500 text-xs">{errors.cityCode}</p>
              )}
            </div>
          </>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <PriceSection
                hasMinPrice={values.hasMinPrice}
                minPrice={values.minPrice}
                errors={errors}
                wasSubmitted={wasSubmitted}
                onChange={handleChange}
              />
              <ConditionsSection
                hasConditions={values.hasConditions}
                conditions={values.conditions}
                errors={errors}
                wasSubmitted={wasSubmitted}
                onChange={handleChange}
              />
              <DateRangeSection
                hasEndDate={values.hasEndDate}
                startDate={values.startDate}
                endDate={values.endDate}
                errors={errors}
                wasSubmitted={wasSubmitted}
                onChange={handleChange}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <>
            <PosterUploadSection posters={values.posters} onChange={handleChange} />
            <SubmitSection
              submitting={submitting}
              submitDisabled={submitting} // На последнем шаге кнопка отправки, не используем стандартную логику
              message={message}
              success={success}
            />
          </>
        );
      default:
        return <div>Неизвестный шаг.</div>;
    }
  }, [currentStep, values, offerTypes, errors, wasSubmitted, categoryPath, city, handleChange, submitting, message, success]);

  return (
    <div className="w-full space-y-8 md:p-8 md:bg-white md:border md:border-gray-200 md:shadow-sm md:rounded-xl">

      {/* Header and Step Indicators */}
      <div className="mb-6 border-b pb-4">
        <div className="text-xl font-extrabold text-gray-900 mt-3 mb-2">
          {titles[currentStep - 1]}
        </div>

        {/* Индикаторы кружочков */}
        <div className="flex justify-center mt-3">
          {Array.from({ length: totalSteps }).map((_, index) => {
            const step = index + 1;
            let indicatorClass = 'bg-gray-300';
            if (step === currentStep) {
              indicatorClass = 'bg-blue-600';
            } else if (step < currentStep) {
              indicatorClass = 'bg-blue-300';
            }
            return (
              <span
                key={step}
                className={`w-3 h-3 rounded-full mx-1 transition-all duration-300 ${indicatorClass}`}
              ></span>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div>
        {renderStepContent}

        {/* Navigation Buttons */}
        <div className="mt-8 flex gap-2">
          <button
            type="button"
            onClick={handlePrev}
            className={`w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors duration-300 shadow-lg shadow-blue-200 ${currentStep === 1 ? 'opacity-0 cursor-default' : ''}`}
            disabled={currentStep === 1}
          >
            Назад
          </button>
          {currentStep < totalSteps ? (
            <button
              onClick={handleNext}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors duration-300 shadow-lg shadow-blue-200"
            >
              Далее
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className={`w-full py-3 rounded-xl font-bold text-lg transition-colors duration-300 shadow-lg ${submitting ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700 shadow-green-200'
                } text-white`}
            >
              {submitting ? 'Сохранение...' : 'Сохранить предложение'}
            </button>
          )}
        </div>
      </div>

      {/* Модалки */}
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