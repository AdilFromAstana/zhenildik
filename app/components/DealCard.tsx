// src/app/components/DealCard.tsx
import React from "react";
import { Deal } from "../types";
import { MapPin, Clock, Tag } from "lucide-react";

interface DealCardProps {
  deal: Deal;
  onDetailClick: (deal: Deal) => void;
}

const DealCard: React.FC<DealCardProps> = ({ deal, onDetailClick }) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src =
      "https://placehold.co/600x400/3B82F6/ffffff?text=Фото+акции";
  };

  return (
    <div
      className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer flex flex-col"
      onClick={() => onDetailClick(deal)}
    >
      {/* Фото акции */}
      <div className="relative h-40 bg-gray-100">
        <img
          src={deal.imageUrl || ""}
          alt={deal.title}
          onError={handleImageError}
          className="w-full h-full object-cover object-center"
        />

        {/* Метка акции (ТОП / Новая / и т.п.) */}
        {deal.tag && (
          <span
            className={`absolute top-2 left-2 px-3 py-1 text-xs font-bold rounded-full shadow-sm ${
              deal.tag === "ТОП"
                ? "bg-red-600 text-white"
                : "bg-green-500 text-white"
            }`}
          >
            {deal.tag}
          </span>
        )}
      </div>

      {/* Контент карточки */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="mb-2">
          {/* Категория / Заведение */}
          <p className="text-sm text-gray-500 flex items-center gap-1">
            {deal.category && (
              <>
                <Tag className="w-3 h-3 text-gray-400" /> {deal.category}
              </>
            )}
            {deal.establishment && (
              <span className="text-gray-500"> · {deal.establishment}</span>
            )}
          </p>

          {/* Название акции */}
          <h3 className="font-semibold text-gray-800 text-lg mt-1 line-clamp-2">
            {deal.title}
          </h3>

          {/* Срок действия */}
          {deal.validUntil && (
            <p className="text-xs text-gray-500 flex items-center mt-1">
              <Clock className="w-3 h-3 mr-1 text-gray-400" />
              до {deal.validUntil}
            </p>
          )}
        </div>

        {/* Низ карточки */}
        <div className="flex items-end justify-between mt-auto">
          <p className="text-2xl font-bold text-orange-600 flex items-baseline">
            {deal.discountValue}
          </p>

          <div className="flex items-center text-sm text-gray-500 ml-2">
            <MapPin className="w-4 h-4 mr-1 text-blue-500" />
            {deal.distance}
          </div>
        </div>

        {/* Кнопка “Подробнее” */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDetailClick(deal);
          }}
          className="mt-3 w-full py-2 text-center text-sm font-medium bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
        >
          Подробнее
        </button>
      </div>
    </div>
  );
};

export default DealCard;
