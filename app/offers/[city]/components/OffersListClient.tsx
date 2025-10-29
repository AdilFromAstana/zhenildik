"use client";

import { useState } from "react";
import MobileFiltersBar from "./MobileFiltersBar";
import OffersList from "./OffersList";

interface OffersListClientProps {
  categories: { id: number; name: string }[];
  defaultFilters: any;
  initialDeals: any[];
  total: number;
  cityName: string;
}

export default function OffersListClient({
  categories,
  defaultFilters,
  initialDeals,
  total,
  cityName,
}: OffersListClientProps) {
  const [deals, setDeals] = useState(initialDeals);
  const [loading, setLoading] = useState(false);

  const handleApplyFilters = async (filters: any) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: "1",
        limit: "20",
      });

      if (filters.search) params.append("search", filters.search);
      if (filters.category && filters.category !== "")
        params.append("categoryId", filters.category);
      if (filters.discountType && filters.discountType !== "Все")
        params.append("offerTypeCode", filters.discountType);
      if (cityName) params.append("city", cityName);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/offers?${params.toString()}`,
        { cache: "no-store" }
      );

      const { data } = await res.json();
      setDeals(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Мобильные фильтры */}
      <MobileFiltersBar
        categories={categories}
        defaultFilters={defaultFilters}
        onApply={handleApplyFilters}
      />

      {loading ? (
        <div className="text-center text-gray-500 py-8">Загрузка...</div>
      ) : (
        <OffersList offers={deals} total={total} />
      )}
    </>
  );
}
