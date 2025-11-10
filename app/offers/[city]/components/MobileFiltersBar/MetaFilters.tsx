import type { OfferFilters } from "./types";

interface Props {
  stats: any;
  filters: OfferFilters;
  onChange: (key: keyof OfferFilters, value: any) => void;
}

export const MetaFilters = ({ stats, filters, onChange }: Props) => {
  const block = (title: string, key: keyof OfferFilters, options: string[]) => (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1 text-gray-700">
        {title}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const count = stats?.[key]?.[opt] ?? 0;
          const disabled = count === 0;
          const selected = filters[key] === opt;
          return (
            <button
              key={opt}
              disabled={disabled}
              onClick={() => !disabled && onChange(key, selected ? "" : opt)}
              className={`px-3 py-1 text-sm rounded-full border transition ${
                disabled
                  ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                  : selected
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
              }`}
            >
              {opt}
              {!disabled && (
                <span className="ml-1 text-xs text-gray-500">({count})</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {block("Тип блюда", "dishType", [
        "бургер",
        "донер",
        "пицца",
        "суши",
        "лапша",
        "салат",
        "десерт",
        "суп",
        "комбо",
      ])}
      {block("Кухня", "cuisine", [
        "европейская",
        "итальянская",
        "японская",
        "азиатская",
        "узбекская",
        "казахская",
        "кофейня",
      ])}
      {block("Тип предложения", "deal", ["комбо", "акция", "новинка"])}
    </>
  );
};
