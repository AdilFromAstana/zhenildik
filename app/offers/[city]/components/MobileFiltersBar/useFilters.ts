import { useState, useEffect } from "react";
import type { OfferFilters } from "./types";

export function useFilters(defaultFilters: OfferFilters, citySlug: string) {
  const [filters, setFilters] = useState<OfferFilters>(() => ({
    ...defaultFilters,
    sortBy: defaultFilters.sortBy ?? "createdAt",
    sortOrder: defaultFilters.sortOrder ?? "DESC",
  }));
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const open = () => setIsOpen(true);
    document.addEventListener("openFilters", open);
    return () => document.removeEventListener("openFilters", open);
  }, []);

  useEffect(() => {
    const match = document.cookie.match(/offersFilters=([^;]+)/);
    if (match) {
      try {
        const parsed = JSON.parse(decodeURIComponent(match[1]));
        setFilters((prev) => ({ ...prev, ...parsed }));
        setSearch(parsed.search || "");
      } catch {
        console.warn("Ошибка чтения offersFilters");
      }
    }
  }, []);

  // 🔥 теперь загружаем мета-данные в зависимости от города и категории
  useEffect(() => {
    if (isOpen) {
      const category = filters.categoryId
        ? `&categoryId=${filters.categoryId}`
        : "";
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/offers/meta-stats?cityCode=${citySlug}${category}`
      )
        .then((res) => res.json())
        .then(setStats)
        .catch(console.error);
    }
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, citySlug, filters.categoryId]);

  const handleChange = (key: keyof OfferFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return {
    filters,
    setFilters,
    search,
    setSearch,
    stats,
    isOpen,
    setIsOpen,
    handleChange,
  };
}
