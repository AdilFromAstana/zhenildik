"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Shapes,
  ImageIcon,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Type,
  FileText,
  ListChecks,
  Wallet,
  CalendarDays,
} from "lucide-react";
import { SelectField } from "../../ui/SelectField";
import { Button, FieldError, Input, RequiredMark, Textarea } from "@/app/ui";
import CategorySelectorModal, { Category } from "./CategorySelectorModal";

type OfferFormValues = {
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

type OfferType = {
  code: string;
  name: string;
  description: string;
  is_active: boolean;
};

export default function OfferForm() {
  const [modalOpen, setModalOpen] = useState(false);
  const [category, setCategory] = useState<any>(null);
  const [offerTypes, setOfferTypes] = useState<OfferType[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [wasSubmitted, setWasSubmitted] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [categoryPath, setCategoryPath] = useState<Category[]>([]); // ← новый стейт

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

  // загрузка типов
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await fetch("http://localhost:5000/offer-types");
        const data = await res.json();
        setOfferTypes(data.filter((t: OfferType) => t.is_active));
      } catch (e) {
        console.error(e);
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

  function isValid(v: OfferFormValues) {
    return Object.keys(validate(v)).length === 0;
  }

  function handleChange<T extends keyof OfferFormValues>(
    field: T,
    val: OfferFormValues[T]
  ) {
    setValues((prev) => ({ ...prev, [field]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setSuccess(null);
    setWasSubmitted(true);
    if (!isValid(values)) return;

    try {
      setSubmitting(true);
      await new Promise((r) => setTimeout(r, 800));
      setSuccess(true);
      setMessage("✅ Предложение сохранено!");
    } catch {
      setSuccess(false);
      setMessage("❌ Ошибка при сохранении");
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
      {/* ===== Основные поля ===== */}
      <div className="space-y-6">
        {/* Название */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Type className="w-4 h-4 text-blue-500" />
            Название <RequiredMark />
          </label>
          <Input
            error={!!(errors.title && wasSubmitted)}
            placeholder="Введите название"
            value={values.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />
          <FieldError message={wasSubmitted ? errors.title : undefined} />
        </div>

        {/* Описание */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <FileText className="w-4 h-4 text-blue-500" />
            Описание <RequiredMark />
          </label>
          <Textarea
            error={!!(errors.description && wasSubmitted)}
            placeholder="Краткое описание предложения"
            value={values.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="min-h-[80px]"
          />
          <FieldError message={wasSubmitted ? errors.description : undefined} />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Shapes className="w-4 h-4 text-blue-500" />
            Категория товара/услуги <RequiredMark />
          </label>
          <Button onClick={() => setModalOpen(true)}>
            {categoryPath.length > 0
              ? categoryPath.map(c => c.name).join(" / ")
              : "Выбрать категорию"}
          </Button>
        </div>

        <div>
          <SelectField
            label={<>Тип предложения <RequiredMark /></>}
            icon={<Shapes className="w-4 h-4 text-blue-500" />}
            placeholder="Выберите тип"
            value={values.offerType}
            onChange={(val) => handleChange("offerType", val)}
            options={offerTypes.map((t) => ({
              value: t.code,
              label: <>
                <div>{t.name}</div>
                <div className="text-sm text-gray-500 mt-1">Пример: {t.description}</div>
              </>
            }))}
          />
          <FieldError message={wasSubmitted ? errors.offerType : undefined} />
        </div>
      </div>

      {/* ===== Цена и условия ===== */}
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          {/* минимальная цена */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Wallet className="w-4 h-4 text-blue-500" />
              Есть минимальная цена? <RequiredMark />
            </label>

            <div className="flex flex-wrap items-center gap-2">
              {["Да", "Нет"].map((label, i) => {
                const val = i === 0;
                const active = values.hasMinPrice === val;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => handleChange("hasMinPrice", val)}
                    className={`inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md border transition ${active
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {values.hasMinPrice && (
              <>
                <Input
                  type="number"
                  error={!!(errors.minPrice && wasSubmitted)}
                  placeholder="Введите минимальную цену"
                  value={values.minPrice}
                  onChange={(e) => handleChange("minPrice", e.target.value)}
                  className="mt-3"
                />
                <FieldError
                  message={wasSubmitted ? errors.minPrice : undefined}
                />
              </>
            )}
          </div>

          {/* обязательные условия */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <ListChecks className="w-4 h-4 text-blue-500" />
              Есть обязательные условия? <RequiredMark />
            </label>

            <div className="flex flex-wrap items-center gap-2">
              {["Да", "Нет"].map((label, i) => {
                const val = i === 0;
                const active = values.hasConditions === val;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => handleChange("hasConditions", val)}
                    className={`inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md border transition ${active
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {values.hasConditions && (
              <>
                <Textarea
                  error={!!(errors.conditions && wasSubmitted)}
                  placeholder="Опишите условия"
                  value={values.conditions}
                  onChange={(e) => handleChange("conditions", e.target.value)}
                  className="mt-3 min-h-[60px]"
                />
                <FieldError
                  message={wasSubmitted ? errors.conditions : undefined}
                />
              </>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <CalendarDays className="w-4 h-4 text-blue-500" />
              Акция ограничена по времени? <RequiredMark />
            </label>

            <div className="flex flex-wrap items-center gap-2">
              {["Да", "Нет"].map((label, i) => {
                const val = i === 0; // Да -> true, Нет -> false
                const active = values.hasEndDate === val;

                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => handleChange("hasEndDate", val)}
                    className={`inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md border transition
            ${active
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {values.hasEndDate && (
              <div className="grid gap-4 md:grid-cols-2 mt-3">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <CalendarDays className="w-4 h-4 text-blue-500" />
                    Дата начала <RequiredMark />
                  </label>
                  <Input
                    type="date"
                    error={!!(errors.startDate && wasSubmitted)}
                    value={values.startDate}
                    onChange={(e) => handleChange("startDate", e.target.value)}
                  />
                  <FieldError
                    message={wasSubmitted ? errors.startDate : undefined}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <CalendarDays className="w-4 h-4 text-blue-500" />
                    Дата окончания <RequiredMark />
                  </label>
                  <Input
                    type="date"
                    error={!!(errors.endDate && wasSubmitted)}
                    value={values.endDate}
                    onChange={(e) => handleChange("endDate", e.target.value)}
                  />
                  <FieldError
                    message={wasSubmitted ? errors.endDate : undefined}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== Постеры ===== */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <ImageIcon className="w-4 h-4 text-blue-500" />
          Загрузка постеров
        </label>

        <label
          htmlFor="posterUpload"
          className="flex flex-col items-center justify-center w-full border-2 border-dashed border-blue-300 rounded-md p-4 text-center hover:bg-blue-50 transition"
        >
          <ImageIcon className="w-8 h-8 text-blue-500 mb-2" />
          <span className="text-sm text-blue-600">
            Перетащите изображения сюда или выберите файлы
          </span>
          <input
            id="posterUpload"
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) =>
              handleChange("posters", Array.from(e.target.files || []))
            }
          />
        </label>
      </div>

      {/* ===== Submit ===== */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 pt-2">
        <Button type="submit" disabled={submitDisabled} loading={submitting}>
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Сохраняем…
            </>
          ) : (
            "Сохранить предложение"
          )}
        </Button>

        <p className="text-sm text-gray-500">
          Поля, отмеченные <RequiredMark /> — обязательны к заполнению
        </p>

        {message && (
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${success
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
              }`}
          >
            {success ? (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-500" />
            )}
            {message}
          </div>
        )}
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
    </form>
  );
}
