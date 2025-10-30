// app/components/offer-form/Step3Media.tsx
import PosterUploadSection from "./PosterUploadSection";
import SubmitSection from "./SubmitSection";

type Props = {
    values: any; // используем тип OfferFormValues
    handleChange: any; // используем тип OfferFormChangeHandler
    submitting: boolean;
    message: string | null;
    success: boolean | null;
    handleSubmit: (e: React.FormEvent) => void;
};

export default function Step3Media({ values, handleChange, submitting, message, success, handleSubmit }: Props) {
    return (
        <>
            <PosterUploadSection posters={values.posters} onChange={handleChange} />
            <SubmitSection
                submitting={submitting}
                submitDisabled={submitting}
                message={message}
                success={success}
            />
            <div className="mt-8">
                <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className={`w-full py-3 rounded-xl font-bold text-lg transition-colors duration-300 shadow-lg ${submitting ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700 shadow-green-200'} text-white`}
                >
                    {submitting ? 'Сохранение...' : 'Сохранить предложение'}
                </button>
            </div>
        </>
    );
}