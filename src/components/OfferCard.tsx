// src/app/components/OfferCard.tsx
import React from "react";
import { MapPin, Tag } from "lucide-react";
import { Offer } from "app/offers/my/page";

interface OfferCardProps {
  offer: Offer;
  onDetailClick: (offer: Offer) => void;
  extraInfo?: any;
}

const OfferCard: React.FC<OfferCardProps> = ({
  offer,
  onDetailClick,
  extraInfo,
}) => {
  console.log("extraInfo: ", extraInfo);
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src =
      "https://placehold.co/600x400/3B82F6/ffffff?text=Фото+акции";
  };

  const imageSrc =
    offer.posters && offer.posters.length > 0
      ? offer.posters[0]
      : "/images/placeholder.jpg";

  return (
    <div
      className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer flex flex-col"
      onClick={() => onDetailClick(offer)}
    >
      {/* Фото акции */}
      <div className="relative h-40 bg-gray-100">
        <img
          src={imageSrc}
          alt={offer.title}
          onError={handleImageError}
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="mb-2">
          <p className="text-sm text-gray-500 flex items-center gap-1">
            {offer.category && (
              <>
                <Tag className="w-3 h-3 text-gray-400" /> {offer.category.name}
              </>
            )}
          </p>

          <h3 className="font-semibold text-gray-800 text-lg mt-1 line-clamp-2">
            {offer.title}
          </h3>
        </div>

        <div className="flex items-end justify-between mt-auto">
          <div className="flex items-center text-sm text-gray-500 ml-2">
            <MapPin className="w-4 h-4 mr-1 text-blue-500" />
            {extraInfo}
          </div>
        </div>

        {/* Кнопка “Подробнее” */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDetailClick(offer);
          }}
          className="mt-3 w-full py-2 text-center text-sm font-medium bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
        >
          Подробнее
        </button>
      </div>
    </div>
  );
};

export default OfferCard;
