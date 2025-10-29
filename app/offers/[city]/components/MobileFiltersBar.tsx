"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface MobileFiltersBarProps {
  categories: { id: number; name: string }[];
  defaultFilters: {
    city: string;
    category: string;
    discountType: string;
    validity: string;
  };
  onApply: (filters: any) => void;
}

export default function MobileFiltersBar({
  categories,
  defaultFilters,
  onApply,
}: MobileFiltersBarProps) {
  const [filters, setFilters] = useState(() => ({ ...defaultFilters }));
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const localCategories = Array.isArray(categories)
    ? categories.map((c) => ({ ...c }))
    : [];

  // ✅ Добавляем слушатель на кастомное событие
  useEffect(() => {
    const open = () => setIsOpen(true);
    document.addEventListener("openFilters", open);
    return () => document.removeEventListener("openFilters", open);
  }, []);

  const handleChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onApply({ ...filters, search });
    setIsOpen(false);
  };

  const handleReset = () => {
    setFilters({ ...defaultFilters });
    setSearch("");
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-end md:hidden">
          <div className="bg-white w-full rounded-t-2xl p-5 max-h-[85vh] overflow-y-auto animate-slideUp">
            {/* Заголовок */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Фильтры</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Поиск */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Поиск
              </label>
              <input
                type="text"
                placeholder="Введите название или описание..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Категория */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Категория
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Все категории</option>
                {localCategories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Тип скидки */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Тип скидки
              </label>
              <select
                value={filters.discountType}
                onChange={(e) => handleChange("discountType", e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Все">Все</option>
                <option value="Процент">Процент</option>
                <option value="Фиксированная сумма">Фиксированная сумма</option>
              </select>
            </div>

            {/* Актуальность */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Актуальность
              </label>
              <select
                value={filters.validity}
                onChange={(e) => handleChange("validity", e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Все">Все</option>
                <option value="Активные">Активные</option>
                <option value="Истекшие">Истекшие</option>
              </select>
            </div>

            {/* Кнопки */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleReset}
                className="flex-1 border border-gray-300 py-2 rounded-lg text-gray-700"
              >
                Сбросить
              </button>
              <button
                onClick={handleApply}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium"
              >
                Применить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Анимация */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slideUp {
          animation: slideUp 0.25s ease-out;
        }
      `}</style>
    </>
  );
}
