// app/components/offer-form/DateRangeSection.tsx
import { CalendarDays } from "lucide-react";
import { Input, FieldError, RequiredMark } from "@/app/ui";
import { OfferFormChangeHandler } from ".";

type Props = {
    hasEndDate: boolean;
    startDate: string;
    endDate: string;
    errors: Record<string, string>;
    wasSubmitted: boolean;
    onChange: OfferFormChangeHandler;
};

export default function DateRangeSection({
    hasEndDate,
    startDate,
    endDate,
    errors,
    wasSubmitted,
    onChange,
}: Props) {
    return (
        <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <CalendarDays className="w-4 h-4 text-blue-500" />
                Акция ограничена по времени? <RequiredMark />
            </label>

            <div className="flex flex-wrap items-center gap-2">
                {["Да", "Нет"].map((label, i) => {
                    const val = i === 0;
                    const active = hasEndDate === val;
                    return (
                        <button
                            key={label}
                            type="button"
                            onClick={() => onChange("hasEndDate", val)}
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

            {hasEndDate && (
                <div className="grid gap-4 md:grid-cols-2 mt-3">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <CalendarDays className="w-4 h-4 text-blue-500" />
                            Дата начала <RequiredMark />
                        </label>
                        <Input
                            type="date"
                            error={!!(errors.startDate && wasSubmitted)}
                            value={startDate}
                            onChange={(e) => onChange("startDate", e.target.value)}
                        />
                        <FieldError message={wasSubmitted ? errors.startDate : undefined} />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <CalendarDays className="w-4 h-4 text-blue-500" />
                            Дата окончания <RequiredMark />
                        </label>
                        <Input
                            type="date"
                            error={!!(errors.endDate && wasSubmitted)}
                            value={endDate}
                            onChange={(e) => onChange("endDate", e.target.value)}
                        />
                        <FieldError message={wasSubmitted ? errors.endDate : undefined} />
                    </div>
                </div>
            )}
        </div>
    );
}