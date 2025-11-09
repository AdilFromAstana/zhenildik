"use client";

import { useState, useEffect, useRef } from "react";
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
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    const cookieMatch = document.cookie.match(/offersFilters=([^;]+)/);
    if (!cookieMatch) return;

    try {
      const parsed = JSON.parse(decodeURIComponent(cookieMatch[1]));
      setActiveFilters(parsed);

      const same =
        JSON.stringify(parsed) === JSON.stringify(defaultFilters);

      if (!same) {
        handleApplyFilters(parsed, true);
      }
    } catch {
      console.warn("Ошибка при чтении offersFilters cookie");
    }
  }, []);

  const [restoring, setRestoring] = useState(true);

  useEffect(() => {
    const savedState = sessionStorage.getItem("offersPageState");
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        if (parsed.citySlug === citySlug) {
          setOffers(parsed.offers);
          setPage(parsed.page);
          setHasMore(parsed.hasMore);

          // ждём пока DOM готов, затем скроллим
          setTimeout(() => {
            window.scrollTo(0, parsed.scrollY || 0);

            // через короткий таймаут убираем крутилку
            setTimeout(() => setRestoring(false), 500);
          }, 100);
        } else {
          setRestoring(false);
        }

        sessionStorage.removeItem("offersPageState");
      } catch {
        console.warn("Ошибка восстановления состояния offersPageState");
        setRestoring(false);
      }
    } else {
      setRestoring(false);
    }
  }, [citySlug]);

  const fetchOffers = async (params: URLSearchParams) => {
    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/offers`);
    params.forEach((v, k) => url.searchParams.set(k, v));

    const res = await fetch(url.toString(), { cache: "no-store" });
    const { data, total } = await res.json();
    const limit = Number(url.searchParams.get("limit") ?? "20");
    const totalPages = Math.ceil(total / limit);
    return { data, total, totalPages };
  };

  const appendMetaFilters = (filters: any, params: URLSearchParams) => {
    if (filters.dishType) params.append("dishType", filters.dishType);
    if (filters.cuisine) params.append("cuisine", filters.cuisine);
    if (filters.deal) params.append("deal", filters.deal);
    if (filters.protein) params.append("protein", filters.protein);
    if (filters.technique) params.append("technique", filters.technique);
    if (filters.mealType) params.append("mealType", filters.mealType);
  };

  const handleApplyFilters = async (filters: any, isInit = false) => {
    // 💾 Сохраняем фильтры в cookie
    document.cookie = `offersFilters=${encodeURIComponent(
      JSON.stringify(filters)
    )}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 дней

    setLoading(true);
    setActiveFilters(filters);

    const params = new URLSearchParams();
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
    appendMetaFilters(filters, params);

    params.append("page", "1");
    params.append("limit", "20");

    try {
      const { data, totalPages } = await fetchOffers(params);
      setOffers(data);
      setPage(1);
      setHasMore(totalPages > 1);
      if (!isInit) console.log("✅ фильтры применены");
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
    appendMetaFilters(filters, params);

    try {
      const { data, totalPages } = await fetchOffers(params);
      if (data?.length > 0) {
        setOffers((prev) => [...prev, ...data]);
        setPage(nextPage);
        setHasMore(nextPage < totalPages);
      } else setHasMore(false);
    } catch (err) {
      console.error(err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {restoring && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      <MobileFiltersBar
        categories={categories}
        defaultFilters={defaultFilters}
        onApply={handleApplyFilters}
      />

      <OffersList
        citySlug={citySlug}
        page={page}
        offers={offers}
        hasMore={hasMore}
        loading={loading}
        onLoadMore={handleLoadMore}
      />
    </>
  );
}
