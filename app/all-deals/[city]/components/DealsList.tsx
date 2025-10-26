"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Deal, FilterState } from "@/app/types";
import DealCard from "@/app/components/DealCard";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { applyFilters, DEALS_PER_PAGE } from "@/app/data/mocks";
import DrawMap from "@/app/components/DrawMap/DrawMap";

const MobileMapButton = dynamic(
  () => import("@/app/components/MobileMapButton"),
  { ssr: false }
);

interface DealsListProps {
  initialDeals: Deal[];
  defaultFilters: FilterState;
}

export default function DealsList({
  initialDeals,
  defaultFilters,
}: DealsListProps) {
  const [filters, setFilters] = useState(defaultFilters);
  const [displayedDeals, setDisplayedDeals] = useState<Deal[]>(
    initialDeals.slice(0, DEALS_PER_PAGE)
  );
  const [allFilteredDeals, setAllFilteredDeals] =
    useState<Deal[]>(initialDeals);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(initialDeals.length > DEALS_PER_PAGE);
  const [displayMode, setDisplayMode] = useState<"list" | "map">("list");

  useEffect(() => {
    const filtered = applyFilters(initialDeals, filters);
    setAllFilteredDeals(filtered);
    setDisplayedDeals(filtered.slice(0, DEALS_PER_PAGE));
    setHasMore(filtered.length > DEALS_PER_PAGE);
  }, [filters, initialDeals]);

  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      const nextPage = page + 1;
      const nextDeals = allFilteredDeals.slice(0, nextPage * DEALS_PER_PAGE);
      setDisplayedDeals(nextDeals);
      setPage(nextPage);
      setHasMore(nextDeals.length < allFilteredDeals.length);
      setIsLoadingMore(false);
    }, 400);
  }, [page, isLoadingMore, hasMore, allFilteredDeals]);

  return (
    <>
      {displayMode === "map" ? (
        <DrawMap estates={[]} />
      ) : (
        <section>
          <div className="text-xl font-bold mb-4 text-gray-800">
            Найдено {allFilteredDeals.length} акций
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedDeals.map((deal) => (
              <DealCard key={deal.id} deal={deal} onDetailClick={() => {}} />
            ))}
          </div>

          {isLoadingMore && (
            <div className="text-center py-6">
              <Loader2 className="w-8 h-8 mx-auto text-blue-600 animate-spin" />
              <p className="text-sm text-gray-500 mt-2">Загружаем больше...</p>
            </div>
          )}

          {hasMore && (
            <div className="text-center mt-8">
              <button
                onClick={loadMore}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Показать ещё
              </button>
            </div>
          )}
        </section>
      )}

      <MobileMapButton
        onClick={() => {
          setDisplayMode((v) => (v === "list" ? "map" : "list"));
        }}
      />
    </>
  );
}
