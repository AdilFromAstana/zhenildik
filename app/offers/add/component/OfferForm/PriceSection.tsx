// app/components/offer-form/PriceSection.tsx
import { Wallet } from "lucide-react";
import { Input, FieldError, RequiredMark } from "@/ui";
import { OfferFormChangeHandler } from ".";

type Props = {
    hasMinPrice: boolean;
    minPrice: string;
    errors: Record<string, string>;
    wasSubmitted: boolean;
    onChange: OfferFormChangeHandler;
};

export default function PriceSection({
    hasMinPrice,
    minPrice,
    errors,
    wasSubmitted,
    onChange,
}: Props) {
    return (
        <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Wallet className="w-4 h-4 text-blue-500" />
                Есть минимальная цена? <RequiredMark />
            </label>

            <div className="flex flex-wrap items-center gap-2">
                {["Да", "Нет"].map((label, i) => {
                    const val = i === 0;
                    const active = hasMinPrice === val;
                    return (
                        <button
                            key={label}
                            type="button"
                            onClick={() => onChange("hasMinPrice", val)}
                            className={`inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md border transition ${active
                                ? "bg-blue-600 text-white border-blue-600"
                                : "border-gray-300 text-gray-700 hover:bg-gray-50"
                                }`}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>

            {hasMinPrice && (
                <>
                    <Input
                        type="number"
                        error={!!(errors.minPrice && wasSubmitted)}
                        placeholder="Введите минимальную цену"
                        value={minPrice}
                        onChange={(e) => onChange("minPrice", e.target.value)}
                        className="mt-3"
                    />
                    <FieldError message={wasSubmitted ? errors.minPrice : undefined} />
                </>
            )}
        </div>
    );
}