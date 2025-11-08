"use client";

import { MapPin } from "lucide-react";
import { Offer } from "app/offers/my/page";

interface OfferCardProps {
  offer: Offer;
  onDetailClick: (offer: Offer) => void;
}

export default function OfferCard({ offer, onDetailClick }: OfferCardProps) {
  const imageSrc =
    offer.posters?.[0] ||
    "https://placehold.co/400x300/94A3B8/FFFFFF?text=Фото";
  const avatar =
    offer.user?.avatar || "https://placehold.co/100x100/ccc/fff?text=U";
  const userName = offer.user?.name || "Без имени";
  const category = offer.category?.name || "Без категории";
  const address = offer.locations?.[0]?.fullAddress || "Адрес не указан";
  const hasDiscount =
    Number(offer.discountPercent) > 0 && offer.oldPrice !== offer.newPrice;

  const oldPrice = offer.oldPrice
    ? Number(offer.oldPrice).toLocaleString("ru-RU")
    : null;
  const newPrice = offer.newPrice
    ? Number(offer.newPrice).toLocaleString("ru-RU")
    : null;

  const discountPercent = hasDiscount
    ? Math.round(Number(offer.discountPercent))
    : null;
  const discountAmount = hasDiscount
    ? `${Math.round(Number(offer.discountAmount || 0)).toLocaleString(
        "ru-RU"
      )} ₸`
    : null;

  return (
    <div
      onClick={() => onDetailClick(offer)}
      className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col h-full active:scale-[0.99]"
    >
      {/* Фото и бейдж скидки */}
      <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-100">
        <img
          src={imageSrc}
          alt={offer.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src =
              "https://placehold.co/400x300/94A3B8/FFFFFF?text=Нет+Фото";
          }}
        />
        {discountPercent && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
            -{discountPercent}%
          </div>
        )}
      </div>

      {/* Контент */}
      <div className="flex flex-col flex-1 p-3">
        {/* Название */}
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug mb-1">
          {offer.title}
        </h3>

        {/* Категория и пользователь */}
        <div className="flex items-center gap-2 mt-1 mb-3 border-b border-gray-100 pb-2">
          <img
            src={avatar}
            alt={userName}
            className="w-7 h-7 rounded-full border border-gray-200 object-cover"
          />
          <div className="flex flex-col leading-none">
            <span className="text-xs font-medium text-gray-800 truncate">
              {userName}
            </span>
            <span className="text-[11px] text-gray-500 truncate">
              {category}
            </span>
          </div>
        </div>

        {/* Цена */}
        <div className="mb-2">
          <div className="flex items-center gap-2">
            {newPrice && (
              <span className="text-lg font-bold text-green-600">
                {newPrice} ₸
              </span>
            )}
            {oldPrice && hasDiscount && (
              <span className="text-sm text-gray-400 line-through">
                {oldPrice} ₸
              </span>
            )}
          </div>
          {discountAmount && (
            <span className="text-xs text-green-600 font-semibold">
              Выгода {discountAmount}
            </span>
          )}
        </div>

        {/* Адрес */}
        <div className="flex items-start gap-1 text-xs text-gray-500 mt-auto">
          <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-[2px]" />
          <span className="truncate">{address}</span>
        </div>
      </div>
    </div>
  );
}
