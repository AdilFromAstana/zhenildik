// app/components/offer-form/SubmitSection.tsx
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button, RequiredMark } from "@/ui";

type Props = {
    submitting: boolean;
    submitDisabled: boolean;
    message: string | null;
    success: boolean | null;
};

export default function SubmitSection({
    submitting,
    submitDisabled,
    message,
    success,
}: Props) {
    return (
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 pt-2">
            <Button type="submit" disabled={submitDisabled} loading={submitting}>
                {submitting ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Сохраняем…
                    </>
                ) : (
                    "Сохранить предложение"
                )}
            </Button>

            <p className="text-sm text-gray-500">
                Поля, отмеченные <RequiredMark /> — обязательны к заполнению
            </p>

            {message && (
                <div
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${success
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                >
                    {success ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                    {message}
                </div>
            )}
        </div>
    );
}