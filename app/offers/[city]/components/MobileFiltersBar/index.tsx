"use client";

import { Button } from "@/ui";
import { X } from "lucide-react";
import { useFilters } from "./useFilters";
import { MetaFilters } from "./MetaFilters";
import { PriceDiscountFilters } from "./PriceDiscountFilters";
import { SortSelector } from "./SortSelector";
import type { MobileFiltersBarProps } from "./types";

export default function MobileFiltersBar({
  citySlug,
  categories,
  defaultFilters,
  onApply,
}: MobileFiltersBarProps) {
  const { filters, setFilters, search, setSearch, stats, isOpen, setIsOpen, handleChange } =
    useFilters(defaultFilters, citySlug);

  const handleSortChange = (value: string) => {
    const mapping: Record<string, [any, any]> = {
      discountPercent: ["discountPercent", "DESC"],
      newPriceAsc: ["newPrice", "ASC"],
      newPriceDesc: ["newPrice", "DESC"],
      title: ["title", "ASC"],
      createdAt: ["createdAt", "DESC"],
    };
    const [sortBy, sortOrder] = mapping[value] || ["createdAt", "DESC"];
    setFilters((p) => ({ ...p, sortBy, sortOrder }));
  };

  const handleApply = () => {
    const full = { ...filters, search };
    document.cookie = `offersFilters=${encodeURIComponent(JSON.stringify(full))}; path=/; max-age=${7 * 86400}`;
    onApply(full);
    setIsOpen(false);
  };

  const handleReset = () => {
    document.cookie = "offersFilters=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setFilters({ ...defaultFilters, sortBy: "createdAt", sortOrder: "DESC" });
    setSearch("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-end md:hidden">
      <div className="bg-white w-full h-[100svh] flex flex-col animate-slideUp">
        <div className="flex-1 overflow-y-auto p-5 pb-24">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Фильтры</h2>
            <button onClick={() => setIsOpen(false)} className="p-2 rounded-md hover:bg-gray-100">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Поиск */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">Поиск</label>
            <input
              type="text"
              placeholder="Введите название..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Категории */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">Категория</label>
            <select
              value={filters.categoryId || ""}
              onChange={(e) => handleChange("categoryId", e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Все категории</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <MetaFilters stats={stats} filters={filters} onChange={handleChange} />
          <PriceDiscountFilters filters={filters} onChange={handleChange} />
          <SortSelector filters={filters} onChange={handleSortChange} />
        </div>

        <div className="border-t bg-white p-4 flex gap-3 sticky bottom-0">
          <Button className="flex-1 border-gray-300 text-gray-700 bg-gray-100 hover:bg-gray-200" onClick={handleReset}>
            Сбросить
          </Button>
          <Button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white" onClick={handleApply}>
            Применить
          </Button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideUp { animation: slideUp 0.25s ease-out; }
      `}</style>
    </div>
  );
}
