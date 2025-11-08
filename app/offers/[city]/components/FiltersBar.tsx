"use client";

import { FilterState } from "@/types";
import React from "react";

interface Category {
  id: number;
  name: string;
  slug: string;
  icon?: string | null;
}

interface FiltersBarProps {
  defaultFilters: FilterState;
  categories: Category[];
}

export default function FiltersBar({
  defaultFilters,
  categories,
}: FiltersBarProps) {
  const [filters, setFilters] = React.useState(defaultFilters);
  const [list, setList] = React.useState<Category[]>(categories);
  const [parentId, setParentId] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleChange = (key: keyof FilterState, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleCategoryClick = async (category: Category | null) => {
    if (!category) {
      // вернуться к главным
      setParentId(null);
      setList(categories);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories?parentId=${category.id}`
      );
      const data = await res.json();
      console.log("Подкатегории:", data);
      if (data.length > 0) {
        setParentId(category.id);
        setList(data);
      }
    } catch (e) {
      console.error("Ошибка загрузки подкатегорий:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mb-6">
      <div className="flex space-x-3 overflow-x-scroll pb-2 scrollbar-hide">
        {loading ? (
          <p className="text-gray-500 text-sm">Загрузка...</p>
        ) : (
          list.map((cat) => {
            const isActive = filters.category === cat.name;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat)}
                className={`flex items-center justify-center flex-shrink-0 px-4 py-2 text-sm rounded-full border transition duration-150 ${
                  isActive
                    ? "bg-blue-600 text-white border-blue-600 shadow-md"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-blue-50 hover:border-blue-400"
                }`}
              >
                {cat.name}
              </button>
            );
          })
        )}
      </div>
    </section>
  );
}
