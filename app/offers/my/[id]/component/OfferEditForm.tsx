"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import {
  Archive,
  CheckCircle,
  Pencil,
  Save,
  Undo,
  ArrowLeft,
} from "lucide-react";
import { OfferStatus, OfferStatusBadge } from "./OfferStatusBadge";
import axiosInstance from "@/lib/axiosInstance";
import BasicInfoSection from "app/offers/add/component/OfferForm/Steps/Step1BasicInfo/BasicInfoSection";
import PriceSection from "app/offers/add/component/OfferForm/Steps/Step2Details/components/PriceSection";
import ConditionsSection from "app/offers/add/component/OfferForm/Steps/Step2Details/components/ConditionsSection";
import DateRangeSection from "app/offers/add/component/OfferForm/Steps/Step2Details/components/DateRangeSection";
import PosterUploadSection from "app/offers/add/component/OfferForm/Steps/Step3Media/PosterUploadSection";

export default function OfferEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [editMode, setEditMode] = useState(false);
  const [archived, setArchived] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // --- Загрузка данных ---
  const { data: offer, isLoading } = useQuery({
    queryKey: ["offer", id],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/offers/${id}`);
      setArchived(data.archived);
      return data;
    },
  });

  // --- Локальное состояние формы ---
  const [values, setValues] = useState({
    hasMinPrice: false,
    minPrice: "",
    hasConditions: false,
    conditions: "",
    hasEndDate: false,
    startDate: "",
    endDate: "",
    posters: [] as File[],
  });

  // --- Обновляем значения, когда загрузился offer ---
  useEffect(() => {
    if (offer) {
      setValues({
        hasMinPrice: offer.hasMinPrice ?? false,
        minPrice: offer.minPrice?.toString() || "",
        hasConditions: offer.hasConditions ?? false,
        conditions: offer.conditions || "",
        hasEndDate: offer.hasEndDate ?? false,
        startDate: offer.startDate?.slice(0, 10) || "",
        endDate: offer.endDate?.slice(0, 10) || "",
        posters: [],
      });
    }
  }, [offer]);

  const handleChange = (field: string, value: any) =>
    setValues((prev) => ({ ...prev, [field]: value }));

  // --- Сохранение изменений ---
  const updateMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await axiosInstance.put(`/offers/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: () => {
      setEditMode(false);
      setMessage("✅ Изменения сохранены");
      queryClient.invalidateQueries({ queryKey: ["offer", id] });
    },
    onError: () => setMessage("❌ Ошибка при сохранении"),
  });

  // --- Архивация / публикация ---
  const archiveMutation = useMutation({
    mutationFn: async () => {
      const newArchived = !archived;
      await axiosInstance.put(`/offers/${id}`, { archived: newArchived });
      setArchived(newArchived);
      return newArchived;
    },
    onSuccess: (newArchived) => {
      setMessage(newArchived ? "🗃️ В архиве" : "✅ Опубликовано");
      queryClient.invalidateQueries({ queryKey: ["offer", id] });
    },
  });

  const handleSave = () => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, val]) => {
      if (Array.isArray(val)) {
        val.forEach((v) => formData.append(key, v));
      } else {
        formData.append(key, String(val));
      }
    });
    updateMutation.mutate(formData);
  };

  // --- UI ---
  return (
    <div className="max-w-3xl mx-auto w-full px-4 py-6 space-y-6 pt-0">
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[60vh] text-gray-500">
          Загрузка...
        </div>
      ) : !offer ? (
        <div className="flex items-center justify-center min-h-[60vh] text-gray-400">
          Предложение не найдено 😔
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Редактирование</h1>
            <OfferStatusBadge status={offer.status as OfferStatus} />
          </div>

          <BasicInfoSection
            title={offer.title}
            description={offer.description}
            offerType={offer.offerType?.code}
            categoryPath={offer.categoryPath || []}
            offerTypes={[]}
            errors={{}}
            wasSubmitted={false}
            onChange={handleChange}
            onOpenCategoryModal={() => {}}
            readOnly={!editMode}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <PriceSection
              hasMinPrice={values.hasMinPrice}
              minPrice={values.minPrice}
              errors={{}}
              wasSubmitted={false}
              onChange={handleChange}
              readOnly={!editMode}
            />
            <ConditionsSection
              hasConditions={values.hasConditions}
              conditions={values.conditions}
              errors={{}}
              wasSubmitted={false}
              onChange={handleChange}
              readOnly={!editMode}
            />
            <DateRangeSection
              hasEndDate={values.hasEndDate}
              startDate={values.startDate}
              endDate={values.endDate}
              errors={{}}
              wasSubmitted={false}
              onChange={handleChange}
              readOnly={!editMode}
            />
          </div>

          <PosterUploadSection
            posters={values.posters}
            onChange={handleChange}
            readOnly={!editMode}
          />

          {/* --- Управление --- */}
          <div className="pt-6 border-t border-gray-200 space-y-3">
            {!editMode ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setEditMode(true)}
                  className="flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-3 text-base font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  <Pencil className="w-4 h-4" />
                  <span>Редактировать</span>
                </button>

                <button
                  onClick={() => archiveMutation.mutate()}
                  className={clsx(
                    "flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-3 text-base font-medium rounded-md border transition",
                    archived
                      ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                  )}
                >
                  {archived ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Опубликовать</span>
                    </>
                  ) : (
                    <>
                      <Archive className="w-4 h-4" />
                      <span>Скрыть (в архив)</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleSave}
                  disabled={updateMutation.isPending}
                  className="flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-3 text-base font-medium bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-70"
                >
                  <Save className="w-4 h-4" />
                  <span>Сохранить</span>
                </button>

                <button
                  onClick={() => setEditMode(false)}
                  className="flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-3 text-base font-medium bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                >
                  <Undo className="w-4 h-4" />
                  <span>Отменить</span>
                </button>
              </div>
            )}

            {message && (
              <div className="text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-md p-2">
                {message}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
