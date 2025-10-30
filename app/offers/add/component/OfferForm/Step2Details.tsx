// app/components/offer-form/Step2Details.tsx
import PriceSection from "./PriceSection";
import ConditionsSection from "./ConditionsSection";
import DateRangeSection from "./DateRangeSection";

type Props = {
    values: any; // используем тип OfferFormValues
    errors: Record<string, string>;
    wasSubmitted: boolean;
    handleChange: any; // используем тип OfferFormChangeHandler
};

export default function Step2Details({ values, errors, wasSubmitted, handleChange }: Props) {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
                <PriceSection
                    hasMinPrice={values.hasMinPrice}
                    minPrice={values.minPrice}
                    errors={errors}
                    wasSubmitted={wasSubmitted}
                    onChange={handleChange}
                />
                <ConditionsSection
                    hasConditions={values.hasConditions}
                    conditions={values.conditions}
                    errors={errors}
                    wasSubmitted={wasSubmitted}
                    onChange={handleChange}
                />
                <DateRangeSection
                    hasEndDate={values.hasEndDate}
                    startDate={values.startDate}
                    endDate={values.endDate}
                    errors={errors}
                    wasSubmitted={wasSubmitted}
                    onChange={handleChange}
                />
            </div>
        </div>
    );
}