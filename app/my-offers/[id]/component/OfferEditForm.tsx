"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BasicInfoSection from "@/app/add-offer/component/OfferForm/BasicInfoSection";
import PriceSection from "@/app/add-offer/component/OfferForm/PriceSection";
import ConditionsSection from "@/app/add-offer/component/OfferForm/ConditionsSection";
import DateRangeSection from "@/app/add-offer/component/OfferForm/DateRangeSection";
import PosterUploadSection from "@/app/add-offer/component/OfferForm/PosterUploadSection";
import clsx from "clsx";
import { Archive, CheckCircle, Pencil, Save, Undo } from "lucide-react";

export default function OfferEditPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const [editMode, setEditMode] = useState(false);
  const [archived, setArchived] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const { data: offer, isLoading } = useQuery({
    queryKey: ["offer", id],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/offers/${id}`);
      setArchived(data.archived);
      return data;
    },
  });

  const [values, setValues] = useState({
    hasMinPrice: offer?.hasMinPrice ?? false,
    minPrice: offer?.minPrice?.toString() || "",
    hasConditions: offer?.hasConditions ?? false,
    conditions: offer?.conditions || "",
    hasEndDate: offer?.hasEndDate ?? false,
    startDate: offer?.startDate?.slice(0, 10) || "",
    endDate: offer?.endDate?.slice(0, 10) || "",
    posters: [],
  });

  const handleChange = (field: string, value: any) =>
    setValues((prev) => ({ ...prev, [field]: value }));

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

  const archiveMutation = useMutation({
    mutationFn: async () => {
      const newArchived = !archived;
      await axiosInstance.put(`/offers/${id}`, { archived: newArchived });
      setArchived(newArchived);
      return newArchived;
    },
    onSuccess: (newArchived) => {
      setMessage(newArchived ? "🗃️ В архиве" : "✅ Активно");
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

  return (
    <div className="w-full space-y-8 md:p-8 md:bg-white md:border md:border-gray-200 md:shadow-sm md:rounded-xl">
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
            readOnly
          />

          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
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
          </div>

          <PosterUploadSection
            posters={values.posters}
            onChange={handleChange}
            readOnly={!editMode}
          />

          {/* --- Управление --- */}
          <div className="pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-3">
              {!editMode ? (
                <>
                  {/* Редактировать */}
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-3 sm:py-2 text-base sm:text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    <Pencil className="w-4 h-4" />
                    <span>Редактировать</span>
                  </button>

                  {/* Архив / Опубликовать */}
                  <button
                    onClick={() => archiveMutation.mutate()}
                    className={clsx(
                      "flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-3 sm:py-2 text-base sm:text-sm font-medium rounded-md border transition",
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
                </>
              ) : (
                <>
                  {/* Сохранить */}
                  <button
                    onClick={handleSave}
                    disabled={updateMutation.isPending}
                    className="flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-3 sm:py-2 text-base sm:text-sm font-medium bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-70"
                  >
                    <Save className="w-4 h-4" />
                    <span>Сохранить</span>
                  </button>

                  {/* Отменить */}
                  <button
                    onClick={() => setEditMode(false)}
                    className="flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-3 sm:py-2 text-base sm:text-sm font-medium bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                  >
                    <Undo className="w-4 h-4" />
                    <span>Отменить</span>
                  </button>
                </>
              )}
            </div>

            {message && (
              <div className="mt-4 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-md p-2">
                {message}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
