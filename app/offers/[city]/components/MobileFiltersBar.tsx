"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/ui";

export interface OfferFilters {
  search?: string;
  cityCode?: string;
  categoryId?: number | string;
  discountType?: string;
  validity?: string;
  priceMin?: number | null;
  priceMax?: number | null;
  discountMin?: number | null;
  discountMax?: number | null;
  sortBy?: "createdAt" | "discountPercent" | "newPrice" | "title";
  sortOrder?: "ASC" | "DESC";
  dishType?: string;
  cuisine?: string;
  deal?: string;
  protein?: string;
  technique?: string;
  mealType?: string;
}

interface MobileFiltersBarProps {
  categories: { id: number; name: string }[];
  defaultFilters: OfferFilters;
  onApply: (filters: OfferFilters) => void;
}

export default function MobileFiltersBar({
  categories,
  defaultFilters,
  onApply,
}: MobileFiltersBarProps) {
  const [filters, setFilters] = useState<OfferFilters>(() => ({
    ...defaultFilters,
    sortBy: defaultFilters.sortBy ?? "createdAt",
    sortOrder: defaultFilters.sortOrder ?? "DESC",
  }));
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState<any>(null);

  const localCategories = Array.isArray(categories)
    ? categories.map((c) => ({ ...c }))
    : [];

  // Открытие модалки фильтров
  useEffect(() => {
    const open = () => setIsOpen(true);
    document.addEventListener("openFilters", open);
    return () => document.removeEventListener("openFilters", open);
  }, []);

  // ✅ Чтение фильтров из cookie при загрузке
  useEffect(() => {
    const cookieMatch = document.cookie.match(/offersFilters=([^;]+)/);
    if (cookieMatch) {
      try {
        const parsed = JSON.parse(decodeURIComponent(cookieMatch[1]));
        setFilters((prev) => ({ ...prev, ...parsed }));
        setSearch(parsed.search || "");
      } catch {
        console.warn("Ошибка при чтении offersFilters cookie");
      }
    }
  }, []);

  // 🔹 Подгрузка статистики (meta-stats)
  useEffect(() => {
    if (isOpen) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/offers/meta-stats?cityCode=astana`)
        .then((res) => res.json())
        .then((data) => setStats(data))
        .catch((err) => console.error("Failed to load meta stats:", err));
    }
  }, [isOpen]);

  const handleChange = (key: keyof OfferFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSortChange = (value: string) => {
    let sortBy: OfferFilters["sortBy"] = "createdAt";
    let sortOrder: OfferFilters["sortOrder"] = "DESC";

    switch (value) {
      case "discountPercent":
        sortBy = "discountPercent";
        sortOrder = "DESC";
        break;
      case "newPriceAsc":
        sortBy = "newPrice";
        sortOrder = "ASC";
        break;
      case "newPriceDesc":
        sortBy = "newPrice";
        sortOrder = "DESC";
        break;
      case "title":
        sortBy = "title";
        sortOrder = "ASC";
        break;
      default:
        sortBy = "createdAt";
        sortOrder = "DESC";
    }

    setFilters((prev) => ({ ...prev, sortBy, sortOrder }));
  };

  // ✅ Применение фильтров (запись в cookie)
  const handleApply = () => {
    const fullFilters = { ...filters, search };
    document.cookie = `offersFilters=${encodeURIComponent(
      JSON.stringify(fullFilters)
    )}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 дней

    onApply(fullFilters);
    setIsOpen(false);
  };

  // ✅ Сброс фильтров (очистка cookie)
  const handleReset = () => {
    document.cookie =
      "offersFilters=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    setFilters({
      ...defaultFilters,
      sortBy: "createdAt",
      sortOrder: "DESC",
      dishType: "",
      cuisine: "",
      deal: "",
      protein: "",
      technique: "",
      mealType: "",
    });
    setSearch("");
  };

  // Компонент блока мета-фильтров
  const makeChipBlock = (
    title: string,
    key: keyof OfferFilters,
    options: string[]
  ) => (
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
              onClick={() =>
                !disabled && handleChange(key, selected ? "" : opt)
              }
              className={`px-3 py-1 text-sm rounded-full border transition ${disabled
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
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-end md:hidden">
          <div className="bg-white w-full h-[100svh] flex flex-col animate-slideUp">
            <div className="flex-1 overflow-y-auto p-5 pb-24">
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
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Категория */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Категория
                </label>
                <select
                  value={filters.categoryId || ""}
                  onChange={(e) => handleChange("categoryId", e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Все категории</option>
                  {localCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {makeChipBlock("Тип блюда", "dishType", [
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

              {makeChipBlock("Кухня", "cuisine", [
                "европейская",
                "итальянская",
                "японская",
                "азиатская",
                "узбекская",
                "казахская",
                "кофейня",
              ])}

              {makeChipBlock("Тип предложения", "deal", [
                "комбо",
                "акция",
                "новинка",
              ])}

              {makeChipBlock("Основной ингредиент", "protein", [
                "курица",
                "говядина",
                "баранина",
                "свинина",
                "рыба",
                "креветки",
                "сыр",
                "яйцо",
              ])}

              {makeChipBlock("Техника приготовления", "technique", [
                "гриль",
                "фритюр",
                "печь",
                "варка",
                "wok",
              ])}

              {makeChipBlock("Приём пищи", "mealType", [
                "завтрак",
                "обед",
                "ужин",
              ])}

              {/* Цена */}
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
                      handleChange(
                        "priceMin",
                        e.target.value ? Number(e.target.value) : null
                      )
                    }
                    className="w-1/2 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="до"
                    value={filters.priceMax ?? ""}
                    onChange={(e) =>
                      handleChange(
                        "priceMax",
                        e.target.value ? Number(e.target.value) : null
                      )
                    }
                    className="w-1/2 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Скидка */}
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
                      handleChange(
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
                      handleChange(
                        "discountMax",
                        e.target.value ? Number(e.target.value) : null
                      )
                    }
                    className="w-1/2 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Сортировка */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Сортировать по
                </label>
                <select
                  value={
                    filters.sortBy === "discountPercent"
                      ? "discountPercent"
                      : filters.sortBy === "newPrice" &&
                        filters.sortOrder === "ASC"
                        ? "newPriceAsc"
                        : filters.sortBy === "newPrice" &&
                          filters.sortOrder === "DESC"
                          ? "newPriceDesc"
                          : filters.sortBy === "title"
                            ? "title"
                            : "createdAt"
                  }
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="createdAt">Новизне (новые сверху)</option>
                  <option value="discountPercent">
                    Скидке (большая скидка сверху)
                  </option>
                  <option value="newPriceAsc">Цене (дешёвые сверху)</option>
                  <option value="newPriceDesc">Цене (дорогие сверху)</option>
                  <option value="title">Названию (A → Я)</option>
                </select>
              </div>
            </div>

            <div className="border-t bg-white p-4 flex gap-3 sticky bottom-0">
              <Button
                className="flex-1 border-gray-300 text-gray-700 bg-gray-100 hover:bg-gray-200"
                onClick={handleReset}
              >
                Сбросить
              </Button>
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white"
                onClick={handleApply}
                loading={false}
              >
                Применить
              </Button>
            </div>
          </div>
        </div>
      )}

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
