"use client";

import React from "react";
import { useRouter } from "next/navigation";
import BestDealsCarousel from "./BestDealsCarousel";
import CuratedCollections from "./CuratedCollections";
import { Search, ChevronRight } from "lucide-react";
import {
  BEST_DEALS_MOCK,
  CURATED_COLLECTIONS_MOCK,
  mockDeals,
} from "@/data/mocks";

const HomePage: React.FC = () => {
  const router = useRouter();

  const handleCollectionItemClick = (itemId: number) => {
    const mockDeal =
      mockDeals.find((d) => d.id === itemId % 100) || mockDeals[0];
    router.push(`/deal/${mockDeal.id}`); // переход на страницу акции
  };

  const handleDealDetailClick = (deal: any) => {
    router.push(`/deal/${deal.id}`); // переход на детальную страницу акции
  };

  const handleGoToCatalog = () => {
    router.push("/all-offers"); // переход в каталог
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <BestDealsCarousel
        deals={BEST_DEALS_MOCK}
        onDetailClick={handleDealDetailClick}
      />

      <CuratedCollections
        collections={CURATED_COLLECTIONS_MOCK}
        onDetailClick={handleCollectionItemClick}
      />

      <section className="mb-10">
        <div className="flex items-center flex-col justify-between gap-4 md:gap-0 md:flex-row p-6 bg-white rounded-xl shadow-lg border border-blue-100">
          <div className="flex items-center">
            <Search className="w-8 h-8 text-blue-600 mr-4" />
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                Ищете что-то конкретное?
              </h3>
              <p className="text-gray-500 text-sm">
                Просмотрите полный список всех акций в нашем каталоге.
              </p>
            </div>
          </div>
          <button
            onClick={handleGoToCatalog}
            className="bg-orange-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-orange-600 transition shadow-md flex items-center"
          >
            В Каталог
            <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
