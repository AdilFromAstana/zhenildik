import { Layers, CalendarDays } from "lucide-react";
import OfferActions from "./OfferActions";
import OfferInfoPanel from "./OfferInfoPanel";
import OfferStatusTag from "./OfferStatusTag";
import { Offer } from "../page";

type Props = {
    offer: Offer;
    updating: boolean;
    onToggleStatus: (id: number) => void;
    onEdit: (id: number) => void;
};

export default function OfferCard({ offer, updating, onToggleStatus, onEdit }: Props) {
    const imageSrc =
        offer.posters && offer.posters.length > 0
            ? offer.posters[0]
            : "/images/placeholder.jpg";

    const isActive =
        !offer.hasEndDate ||
        !offer.endDate ||
        new Date(offer.endDate) >= new Date();

    return (
        <div className="relative flex flex-col sm:flex-row gap-4 p-4 border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-md transition">
            {/* Метка статуса */}
            <div className="relative w-full sm:w-36 h-48 sm:h-32 flex-shrink-0 overflow-hidden rounded-md bg-gray-50 border border-gray-200">
                <img
                    src={imageSrc}
                    alt={offer.title}
                    className="w-full h-full object-cover"
                />

                {/* Метка статуса поверх изображения */}
                <div className="absolute top-2 right-2">
                    <OfferStatusTag status={offer.status} />
                </div>
            </div>

            {/* Основная информация */}
            <div className="flex flex-col flex-1 justify-between">
                <div>
                    <div className="flex justify-between items-start sm:items-center gap-2 pr-16 sm:pr-20">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                            {offer.title}
                        </h2>
                        <span className="px-2 py-0.5 text-xs sm:text-sm font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap">
                            {offer.offerType?.name || offer.offerTypeCode}
                        </span>
                    </div>

                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">{offer.description}</p>

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

                <OfferInfoPanel offer={offer} isActive={isActive} />

                <OfferActions
                    offer={offer}
                    isActive={isActive}
                    updating={updating}
                    onEdit={onEdit}
                    onToggleStatus={onToggleStatus}
                />

                <div className="flex items-center gap-1 mt-3 text-xs text-gray-400">
                    <CalendarDays className="w-3.5 h-3.5" />
                    Создано: {new Date(offer.createdAt).toLocaleDateString("ru-RU")}
                </div>
            </div>
        </div>
    );
}
