"use client";

import { useEffect, useState, useMemo } from "react";
import CategorySelectorModal from "../CategorySelectorModal";
import CitySelectorModal from "../CitySelectorModal"; // ← новый импорт
import BasicInfoSection from "./BasicInfoSection";
import PriceSection from "./PriceSection";
import ConditionsSection from "./ConditionsSection";
import DateRangeSection from "./DateRangeSection";
import PosterUploadSection from "./PosterUploadSection";
import SubmitSection from "./SubmitSection";
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

export default function OfferForm() {
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCityOpen, setModalCityOpen] = useState(false); // ← модалка города

  const [category, setCategory] = useState<any>(null);
  const [categoryPath, setCategoryPath] = useState<any[]>([]);

  const [city, setCity] = useState<any>(null); // ← выбранный город

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
    return e;
  }

  const errors = useMemo(() => validate(values), [values]);
  const isValid = (v: OfferFormValues) => Object.keys(validate(v)).length === 0;

  const handleChange: OfferFormChangeHandler = (field, val) => {
    setValues((prev) => ({ ...prev, [field]: val }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setSuccess(null);
    setWasSubmitted(true);

    if (!isValid(values)) return;

    try {
      setSubmitting(true);

      const payload: any = {
        title: values.title,
        description: values.description,
        offerTypeCode: values.offerType,
        hasMinPrice: values.hasMinPrice,
        hasConditions: values.hasConditions,
        hasEndDate: values.hasEndDate,
      };

      if (values.hasMinPrice) payload.minPrice = values.minPrice;
      if (values.hasConditions) payload.conditions = values.conditions;
      if (values.hasEndDate) {
        payload.startDate = values.startDate;
        payload.endDate = values.endDate;
      }
      if (category?.id) payload.categoryId = category.id;
      if (city?.slug) payload.cityCode = city.slug; // ← город

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

      setValues({
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
      setCategory(null);
      setCategoryPath([]);
      setCity(null);
      router.push('/offers/my')
    } catch (err: any) {
      console.error(err);
      setSuccess(false);
      setMessage(err?.response?.data?.message || "Ошибка при сохранении");
    } finally {
      setSubmitting(false);
    }
  }

  const submitDisabled = submitting || !isValid(values);

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full space-y-8 md:p-8 md:bg-white md:border md:border-gray-200 md:shadow-sm md:rounded-xl"
    >
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
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium text-gray-700">Город</label>
        <button
          type="button"
          onClick={() => setModalCityOpen(true)}
          className="px-4 py-2 border rounded-lg text-left hover:bg-gray-50"
        >
          {city ? city.name : "Выбрать город"}
        </button>
      </div>

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

      <PosterUploadSection posters={values.posters} onChange={handleChange} />

      <SubmitSection
        submitting={submitting}
        submitDisabled={submitDisabled}
        message={message}
        success={success}
      />

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
    </form>
  );
}
