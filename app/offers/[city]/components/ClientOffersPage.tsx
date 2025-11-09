"use client";

import { useState, useEffect, useRef } from "react";
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
  const [page, setPage] = useState(currentPage);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const initialized = useRef(false);
  const [activeFilters, setActiveFilters] = useState<any | null>(null);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      setHasMore(currentPage < totalPages);
      console.log("🟩 INIT FIX:", { currentPage, totalPages });
    }
  }, [currentPage, totalPages]);

  console.log("🔥 [RENDER]", { page, totalPages, hasMore });

  const fetchOffers = async (params: URLSearchParams) => {
    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/offers`);
    params.forEach((value, key) => url.searchParams.set(key, value));

    const res = await fetch(url.toString(), { cache: "no-store" });
    const { data, total } = await res.json();

    const limit = Number(url.searchParams.get("limit") ?? "20");
    const totalPages = Math.ceil(total / limit);

    return { data, total, totalPages };
  };

  const handleApplyFilters = async (filters: any) => {
    setLoading(true);
    const params = new URLSearchParams();
    setActiveFilters(filters);

    if (filters.search) params.append("search", filters.search);
    if (filters.categoryId) params.append("categoryId", filters.categoryId);
    if (filters.discountType && filters.discountType !== "Все")
      params.append("benefitKind", filters.discountType);
    if (citySlug) params.append("cityCode", citySlug);
    if (filters.priceMin) params.append("priceMin", String(filters.priceMin));
    if (filters.priceMax) params.append("priceMax", String(filters.priceMax));
    if (filters.discountMin)
      params.append("discountMin", String(filters.discountMin));
    if (filters.discountMax)
      params.append("discountMax", String(filters.discountMax));
    if (filters.validity && filters.validity !== "Все") {
      if (filters.validity === "Активные") params.append("isActiveNow", "true");
      if (filters.validity === "Истекшие")
        params.append("isActiveNow", "false");
    }

    if (filters.sortBy) params.append("sortBy", filters.sortBy);
    if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

    params.append("page", "1");
    params.append("limit", "20");

    try {
      const { data, totalPages } = await fetchOffers(params);
      setOffers(data);
      setPage(1);
      setHasMore(totalPages > 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    const nextPage = page + 1;
    const params = new URLSearchParams({
      cityCode: citySlug,
      page: String(nextPage),
      limit: "20",
    });

    const filters = activeFilters ?? {};

    if (filters.search) params.append("search", filters.search);
    if (filters.categoryId) params.append("categoryId", filters.categoryId);
    if (filters.discountType && filters.discountType !== "Все")
      params.append("benefitKind", filters.discountType);
    if (filters.priceMin) params.append("priceMin", String(filters.priceMin));
    if (filters.priceMax) params.append("priceMax", String(filters.priceMax));
    if (filters.discountMin)
      params.append("discountMin", String(filters.discountMin));
    if (filters.discountMax)
      params.append("discountMax", String(filters.discountMax));
    if (filters.validity && filters.validity !== "Все") {
      if (filters.validity === "Активные") params.append("isActiveNow", "true");
      if (filters.validity === "Истекшие")
        params.append("isActiveNow", "false");
    }
    if (filters.sortBy) params.append("sortBy", filters.sortBy);
    if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

    try {
      const { data, totalPages } = await fetchOffers(params);

      if (data?.length > 0) {
        setOffers((prev) => [...prev, ...data]);
        setPage(nextPage);
        setHasMore(nextPage < totalPages);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error(err);
      setHasMore(false);
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

      <OffersList
        offers={offers}
        hasMore={hasMore}
        loading={loading}
        onLoadMore={handleLoadMore}
      />
    </>
  );
}
