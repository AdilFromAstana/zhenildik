"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import OffersList from "./OffersList";
import MobileFiltersBar from "./MobileFiltersBar";
import { Offer } from "app/offers/my/page";

export default function ClientOffersPage({
  total,
  totalPages,
  currentPage,
  categories,
  defaultFilters,
  initialOffers,
  citySlug,
}: any) {
  const [offers, setOffers] = useState<Offer[]>(initialOffers);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleApplyFilters = async (filters: any) => {
    const params = new URLSearchParams();

    if (filters.search) params.append("search", filters.search);
    if (filters.category) params.append("categoryId", filters.category);
    if (filters.discountType && filters.discountType !== "Все")
      params.append("offerTypeCode", filters.discountType);
    if (citySlug) params.append("cityCode", citySlug);

    params.append("page", "1");

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleLoadMore = async () => {
    const nextPage = currentPage + 1;
    setLoading(true);
    try {
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/offers`);
      url.searchParams.set("cityCode", citySlug);
      url.searchParams.set("page", String(nextPage));
      url.searchParams.set("limit", "20");

      const res = await fetch(url.toString(), { cache: "no-store" });
      const { data } = await res.json();
      setOffers((prev) => [...prev, ...data]);

      router.push(`?page=${nextPage}`, { scroll: false });
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

      {loading && offers.length === 0 ? (
        <div className="text-center text-gray-500 py-10">Загрузка...</div>
      ) : (
        <>
          <OffersList offers={offers} total={total} />
          {currentPage < totalPages && (
            <div className="flex justify-center mt-8">
              <button
                disabled={loading}
                onClick={handleLoadMore}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? "Загрузка..." : "Показать ещё"}
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
