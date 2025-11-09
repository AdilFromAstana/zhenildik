"use client";

import { MapPin } from "lucide-react";
import { Offer } from "app/offers/my/page";
import { useRouter } from "next/navigation";

interface OfferCardProps {
  offer: Offer;
  nearestDistance?: number | null;
  offers: Offer[];
  page: number;
  hasMore: boolean;
  citySlug: string;
}

export default function OfferCard({ offer, nearestDistance, offers, citySlug, hasMore, page }: OfferCardProps) {

  const router = useRouter();
  const imageSrc =
    offer.posters?.[0] ||
    "https://placehold.co/600x400/D1D5DB/4B5563?text=Нет+Фото";
  const userAvatar =
    offer.user?.avatar || "https://placehold.co/32x32/10B981/FFFFFF?text=U";
  const userName = offer.user?.name || "Без имени";
  const categoryName = offer.category?.name || "Категория";
  const locationText = offer.locations?.[0]?.fullAddress || "Адрес не указан";

  const oldPriceNum = offer.oldPrice ? Number(offer.oldPrice) : null;
  const newPriceNum = offer.newPrice ? Number(offer.newPrice) : null;
  const discountPercent =
    offer.discountPercent && Number(offer.discountPercent) > 0
      ? Math.round(Number(offer.discountPercent))
      : null;
  const discountAmount =
    offer.discountAmount && Number(offer.discountAmount) > 0
      ? `${Math.round(Number(offer.discountAmount)).toLocaleString("ru-RU")} ₸`
      : null;

  const hasDiscount =
    discountPercent && oldPriceNum && newPriceNum && oldPriceNum > newPriceNum;


  const handleOfferClick = () => {
    const state = {
      offers,
      page,
      hasMore,
      citySlug,
      scrollY: window.scrollY,
    };
    sessionStorage.setItem("offersPageState", JSON.stringify(state));
    router.push(`/offer/${offer.id}`);
  };

  return (
    <div
      onClick={handleOfferClick}
      className="bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col"
    >
      <div className="relative w-full h-48 bg-gray-100">
        <img
          src={imageSrc}
          alt={offer.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src =
              "https://placehold.co/600x400/94A3B8/FFFFFF?text=Нет+Фото";
          }}
        />
        {hasDiscount && (
          <div className="absolute bottom-0 left-0 bg-orange-500 text-white text-lg font-extrabold px-3 py-1 rounded-tr-2xl shadow-lg">
            -{discountPercent}%
          </div>
        )}
      </div>

      {/* Контент */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Название */}
        <h3 className="text-lg font-extrabold text-gray-900 leading-tight line-clamp-2">
          {offer.title}
        </h3>

        {/* Автор / категория */}
        <div className="flex items-center gap-2">
          <img
            src={userAvatar}
            alt={userName}
            className="w-8 h-8 rounded-full border-2 border-green-500 shadow-sm object-cover"
          />
          <div className="flex flex-col leading-none">
            <span className="text-sm font-semibold text-gray-800">
              {userName}
            </span>
            <span className="text-xs text-gray-500">{categoryName}</span>
          </div>
        </div>

        {/* Цены */}
        <div className="flex justify-between items-center">
          <div className="flex items-baseline gap-2">
            {newPriceNum !== null && (
              <span className="text-2xl font-black text-orange-600">
                {newPriceNum.toLocaleString("ru-RU")} ₸
              </span>
            )}
            {oldPriceNum !== null && hasDiscount && (
              <span className="text-gray-400 line-through text-sm font-medium">
                {oldPriceNum.toLocaleString("ru-RU")} ₸
              </span>
            )}
          </div>

          {discountAmount && (
            <span className="text-white bg-blue-600 px-2 py-1 text-xs font-bold rounded-full shadow-md">
              ВЫГОДА {discountAmount}
            </span>
          )}
        </div>

        {/* Адрес */}
        <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-3">
          <div className="flex gap-1">
            <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <span className="truncate">{locationText}</span>
          </div>
          {nearestDistance && (
            <div className="font-bold text-blue-600">
              {nearestDistance.toFixed(1)} км от вас
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
