import type { OfferFilters } from "./types";

interface Props {
  filters: OfferFilters;
  onChange: (value: string) => void;
}

export const SortSelector = ({ filters, onChange }: Props) => (
  <div className="mb-4">
    <label className="block text-sm font-medium mb-1 text-gray-700">
      Сортировать по
    </label>
    <select
      value={
        filters.sortBy === "discountPercent"
          ? "discountPercent"
          : filters.sortBy === "newPrice" && filters.sortOrder === "ASC"
          ? "newPriceAsc"
          : filters.sortBy === "newPrice" && filters.sortOrder === "DESC"
          ? "newPriceDesc"
          : filters.sortBy === "title"
          ? "title"
          : "createdAt"
      }
      onChange={(e) => onChange(e.target.value)}
      className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
    >
      <option value="createdAt">Новизне (новые сверху)</option>
      <option value="discountPercent">Скидке (большая сверху)</option>
      <option value="newPriceAsc">Цене (дешёвые сверху)</option>
      <option value="newPriceDesc">Цене (дорогие сверху)</option>
      <option value="title">Названию (A → Я)</option>
    </select>
  </div>
);
