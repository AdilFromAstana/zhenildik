import { Coins, Info, CalendarDays } from "lucide-react";
import OfferStatusTag from "./OfferStatusTag";
import { Offer } from "../page";

export default function OfferInfoPanel({
    offer,
    isActive,
}: {
    offer: Offer;
    isActive: boolean;
}) {
    return (
        <div className="mt-3 border-t border-gray-100 pt-3 flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-x-4 text-sm text-gray-700">
            <div className="flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-yellow-500" />
                {offer.hasMinPrice
                    ? `Минимальная цена: ${offer.minPrice} ₽`
                    : "Без минимальной цены"}
            </div>

            <div className="flex items-center gap-1.5">
                <Info className="w-4 h-4 text-blue-500" />
                {offer.hasConditions
                    ? offer.conditions || "Условия указаны"
                    : "Без условий"}
            </div>

            <div className="flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4 text-green-500" />
                {offer.hasEndDate && offer.startDate && offer.endDate ? (
                    <>
                        {offer.startDate.slice(0, 10)} – {offer.endDate.slice(0, 10)}
                    </>
                ) : (
                    "Без ограничений по дате"
                )}
            </div>
        </div>
    );
}
