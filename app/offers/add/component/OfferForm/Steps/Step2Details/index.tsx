// app/components/offer-form/Step2Details.tsx
import ConditionsSection from "./components/ConditionsSection";
import DateRangeSection from "./components/DateRangeSection";
import PriceSection from "./components/PriceSection";

type Props = {
  values: any; // используем тип OfferFormValues
  errors: Record<string, string>;
  wasSubmitted: boolean;
  handleChange: any; // используем тип OfferFormChangeHandler
};

const Step2Details: React.FC<Props> = ({
  values,
  errors,
  wasSubmitted,
  handleChange,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <PriceSection
          readOnly={false}
          hasMinPrice={values.hasMinPrice}
          minPrice={values.minPrice}
          errors={errors}
          wasSubmitted={wasSubmitted}
          onChange={handleChange}
          />
        <ConditionsSection
          readOnly={false}
          hasConditions={values.hasConditions}
          conditions={values.conditions}
          errors={errors}
          wasSubmitted={wasSubmitted}
          onChange={handleChange}
          />
        <DateRangeSection
          readOnly={false}
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
};

export default Step2Details;
