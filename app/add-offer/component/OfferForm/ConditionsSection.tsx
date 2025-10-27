// app/components/offer-form/ConditionsSection.tsx
import { ListChecks } from "lucide-react";
import { Textarea, FieldError, RequiredMark } from "@/app/ui";
import { OfferFormChangeHandler } from ".";

type Props = {
    hasConditions: boolean;
    conditions: string;
    errors: Record<string, string>;
    wasSubmitted: boolean;
    onChange: OfferFormChangeHandler;
};

export default function ConditionsSection({
    hasConditions,
    conditions,
    errors,
    wasSubmitted,
    onChange,
}: Props) {
    return (
        <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <ListChecks className="w-4 h-4 text-blue-500" />
                Есть обязательные условия? <RequiredMark />
            </label>

            <div className="flex flex-wrap items-center gap-2">
                {["Да", "Нет"].map((label, i) => {
                    const val = i === 0;
                    const active = hasConditions === val;
                    return (
                        <button
                            key={label}
                            type="button"
                            onClick={() => onChange("hasConditions", val)}
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

            {hasConditions && (
                <>
                    <Textarea
                        error={!!(errors.conditions && wasSubmitted)}
                        placeholder="Опишите условия"
                        value={conditions}
                        onChange={(e) => onChange("conditions", e.target.value)}
                        className="mt-3 min-h-[60px]"
                    />
                    <FieldError message={wasSubmitted ? errors.conditions : undefined} />
                </>
            )}
        </div>
    );
}