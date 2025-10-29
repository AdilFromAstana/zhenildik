"use client";

import { useState } from "react";
import OffersList from "./OffersList";
import MobileFiltersBar from "./MobileFiltersBar";
import { Offer } from "app/offers/my/page";

export default function ClientOffersPage({
  total,
  categories,
  cityName,
  defaultFilters,
  initialOffers,
}: any) {
  const [offers, setOffers] = useState<Offer[]>(initialOffers);
  const [loading, setLoading] = useState(false);

  const handleApplyFilters = async (filters: any) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: "1",
        limit: "20",
      });

      if (filters.search) params.append("search", filters.search);
      if (filters.category) params.append("categoryId", filters.category);
      if (filters.discountType && filters.discountType !== "Все")
        params.append("offerTypeCode", filters.discountType);
      if (cityName) params.append("cityCode", cityName);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/offers?${params.toString()}`,
        { cache: "no-store" }
      );
      const { data } = await res.json();
      setOffers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MobileFiltersBar
        categories={categories}
        defaultFilters={defaultFilters}
        onApply={handleApplyFilters}
      />
      {loading ? (
        <div className="text-center text-gray-500 py-10">Загрузка...</div>
      ) : (
        <OffersList offers={offers} total={total} />
      )}
    </>
  );
}
