// app/components/offer-form/Step1BasicInfo.tsx
import { useState } from "react";
// import AddressSearchMap from "./AddressSearchMap";
import BasicInfoSection from "./BasicInfoSection";

type Props = {
  values: any; // используем тип OfferFormValues, если нужно строгое определение
  errors: Record<string, string>;
  wasSubmitted: boolean;
  offerTypes: any[]; // используем тип OfferType
  categoryPath: any[];
  city: any;
  handleChange: any; // используем тип OfferFormChangeHandler
  onOpenCategoryModal: () => void;
  onOpenCityModal: () => void;
  onAddressSelect: (coords: [number, number], address: string) => void;
};

export default function Step1BasicInfo({
  values,
  errors,
  wasSubmitted,
  offerTypes,
  categoryPath,
  city,
  handleChange,
  onOpenCategoryModal,
  onOpenCityModal,
  onAddressSelect,
}: Props) {
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(
    null
  );

  const handleAddressSelectFromMap = (
    coords: [number, number],
    address: string
  ) => {
    setSelectedCoords(coords);
    setSelectedAddress(address);
    // Вызываем функцию, переданную из родительского компонента (например, OfferForm)
    onAddressSelect(coords, address);
  };
  return (
    <>
      <BasicInfoSection
        title={values.title}
        description={values.description}
        offerType={values.offerType}
        categoryPath={categoryPath}
        offerTypes={offerTypes}
        errors={errors}
        wasSubmitted={wasSubmitted}
        onChange={handleChange}
        onOpenCategoryModal={onOpenCategoryModal}
      />
      <div className="flex flex-col space-y-2 mt-6">
        <label className="text-sm font-medium text-gray-700">
          Город <span className="text-red-500">*</span>
        </label>
        <button
          type="button"
          onClick={onOpenCityModal}
          className="px-4 py-2 border rounded-lg text-left hover:bg-gray-50"
        >
          {city ? city.name : "Выбрать город"}
        </button>
        {wasSubmitted && !city?.slug && errors.cityCode && (
          <p className="text-red-500 text-xs">{errors.cityCode}</p>
        )}
      </div>
    </>
  );
}
