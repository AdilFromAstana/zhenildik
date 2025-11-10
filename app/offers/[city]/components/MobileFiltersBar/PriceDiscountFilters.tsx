import type { OfferFilters } from "./types";

interface Props {
  filters: OfferFilters;
  onChange: (key: keyof OfferFilters, value: any) => void;
}

export const PriceDiscountFilters = ({ filters, onChange }: Props) => (
  <>
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1 text-gray-700">
        Цена
      </label>
      <div className="flex gap-2">
        <input
          type="number"
          placeholder="от"
          value={filters.priceMin ?? ""}
          onChange={(e) =>
            onChange("priceMin", e.target.value ? Number(e.target.value) : null)
          }
          className="w-1/2 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          placeholder="до"
          value={filters.priceMax ?? ""}
          onChange={(e) =>
            onChange("priceMax", e.target.value ? Number(e.target.value) : null)
          }
          className="w-1/2 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>

    <div className="mb-4">
      <label className="block text-sm font-medium mb-1 text-gray-700">
        Скидка %
      </label>
      <div className="flex gap-2">
        <input
          type="number"
          placeholder="от"
          value={filters.discountMin ?? ""}
          onChange={(e) =>
            onChange(
              "discountMin",
              e.target.value ? Number(e.target.value) : null
            )
          }
          className="w-1/2 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          placeholder="до"
          value={filters.discountMax ?? ""}
          onChange={(e) =>
            onChange(
              "discountMax",
              e.target.value ? Number(e.target.value) : null
            )
          }
          className="w-1/2 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  </>
);
