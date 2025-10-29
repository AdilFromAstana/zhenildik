import clsx from "clsx";
import { offerStatusMap } from "./offerStatusMap";

export default function OfferStatusTag({ status }: { status: string }) {
    const config = offerStatusMap[status] || offerStatusMap["DRAFT"];
    const Icon = config.icon;

    return (
        <div
            className={clsx(
                "flex items-center gap-1.5 px-2 py-0.5 rounded-md font-medium text-xs sm:text-sm border",
                config.color
            )}
        >
            <Icon className="w-4 h-4" />
            {config.label}
        </div>
    );
}
