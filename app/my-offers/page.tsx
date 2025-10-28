"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import {
  CalendarDays,
  Tag,
  Coins,
  Layers,
  ImageOff,
  Clock,
  Info,
} from "lucide-react";
import clsx from "clsx";

type Offer = {
  id: number;
  title: string;
  description: string;
  offerTypeCode: string;
  categoryId: number;
  hasMinPrice: boolean;
  minPrice?: number | null;
  hasConditions: boolean;
  conditions?: string | null;
  hasEndDate: boolean;
  startDate?: string | null;
  endDate?: string | null;
  createdAt: string;
  posters: string[];
  offerType: {
    code: string;
    name: string;
  };
  category: {
    id: number;
    name: string;
    icon: string | null;
  };
};

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const { data } = await axiosInstance.get("/offers/my");
        setOffers(data.data || []);
      } catch (err) {
        console.error("Ошибка при загрузке предложений:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-500">
        Загрузка предложений...
      </div>
    );
  }

  if (!offers.length) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-400">
        Пока нет предложений 😔
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <h1 className="text-xl sm:text-2xl font-bold mb-5 flex items-center gap-2">
        <Tag className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
        Мои предложения
      </h1>

      <div className="flex flex-col gap-5">
        {offers.map((offer) => {
          const imageSrc =
            offer.posters && offer.posters.length > 0
              ? offer.posters[0]
              : "/images/placeholder.jpg";

          const isActive =
            !offer.hasEndDate ||
            !offer.endDate ||
            new Date(offer.endDate) >= new Date();

          return (
            <div
              key={offer.id}
              className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-md transition"
            >
              {/* Картинка */}
              <div className="w-full sm:w-36 h-48 sm:h-32 flex-shrink-0 overflow-hidden rounded-md bg-gray-50 border border-gray-200">
                <img
                  src={imageSrc}
                  alt={offer.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Контент */}
              <div className="flex flex-col flex-1 justify-between">
                {/* Верхняя часть — название, тип, категория */}
                <div>
                  <div className="flex justify-between items-start sm:items-center gap-2">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                      {offer.title}
                    </h2>
                    <span className="px-2 py-0.5 text-xs sm:text-sm font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap">
                      {offer.offerType?.name || offer.offerTypeCode}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                    {offer.description}
                  </p>

                  <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 mt-1">
                    {offer.category?.icon ? (
                      <img
                        src={offer.category.icon}
                        alt={offer.category.name}
                        className="w-4 h-4 object-contain"
                      />
                    ) : (
                      <Layers className="w-4 h-4 text-gray-400" />
                    )}
                    {offer.category?.name || `Категория #${offer.categoryId}`}
                  </div>
                </div>

                {/* Инфопанель */}
                <div className="mt-3 border-t border-gray-100 pt-3 flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-x-4 text-sm text-gray-700">
                  {/* Цена */}
                  <div className="flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-yellow-500" />
                    {offer.hasMinPrice
                      ? `Минимальная цена: ${offer.minPrice} ₽`
                      : "Без минимальной цены"}
                  </div>

                  {/* Условия */}
                  <div className="flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-blue-500" />
                    {offer.hasConditions
                      ? offer.conditions || "Условия указаны"
                      : "Без дополнительных условий"}
                  </div>

                  {/* Даты */}
                  <div className="flex items-center gap-1.5">
                    <CalendarDays className="w-4 h-4 text-green-500" />
                    {offer.hasEndDate && offer.startDate && offer.endDate ? (
                      <>
                        {offer.startDate.slice(0, 10)} –{" "}
                        {offer.endDate.slice(0, 10)}
                      </>
                    ) : (
                      "Без ограничений по дате"
                    )}
                  </div>

                  {/* Статус */}
                  <div
                    className={clsx(
                      "flex items-center gap-1.5 px-2 py-0.5 rounded-md font-medium text-xs sm:text-sm",
                      isActive
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-gray-100 text-gray-500 border border-gray-200"
                    )}
                  >
                    <Clock className="w-4 h-4" />
                    {isActive ? "Активна" : "Архив"}
                  </div>
                </div>

                {/* Дата создания */}
                <div className="flex items-center gap-1 mt-3 text-xs text-gray-400">
                  <CalendarDays className="w-3.5 h-3.5" />
                  Создано:{" "}
                  {new Date(offer.createdAt).toLocaleDateString("ru-RU")}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
