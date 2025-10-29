import { Pencil, Archive, RefreshCw } from "lucide-react";
import clsx from "clsx";
import { Offer } from "../page";

type Props = {
    offer: Offer;
    isActive: boolean;
    updating: boolean;
    onEdit: (id: number) => void;
    onToggleStatus: (id: number) => void;
};

export default function OfferActions({
    offer,
    isActive,
    updating,
    onEdit,
    onToggleStatus,
}: Props) {
    return (
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <button
                onClick={() => onEdit(offer.id)}
                className="flex items-center justify-center gap-2 w-full sm:w-auto text-base sm:text-sm font-semibold sm:font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 sm:px-3 sm:py-1.5 rounded-lg transition"
            >
                <Pencil className="w-5 h-5" />
                Редактировать
            </button>

            <button
                onClick={() => onToggleStatus(offer.id)}
                disabled={updating}
                className={clsx(
                    "flex items-center justify-center gap-2 w-full sm:w-auto text-base sm:text-sm font-semibold sm:font-medium px-4 py-2 sm:px-3 sm:py-1.5 rounded-lg border transition",
                    isActive
                        ? "text-gray-700 border-gray-300 hover:bg-gray-100"
                        : "text-green-700 border-green-400 hover:bg-green-50"
                )}
            >
                {updating ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                ) : isActive ? (
                    <Archive className="w-5 h-5" />
                ) : (
                    <RefreshCw className="w-5 h-5" />
                )}
                {isActive ? "Архивировать" : "Активировать"}
            </button>
        </div>
    );
}
