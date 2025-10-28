"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tag } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import OfferCard from "./components/OfferCard";
import { useOfferStats } from "../hooks/useOfferStats";
import OfferStatusFilter from "./components/OfferStatusFilter";

export type Offer = {
  id: number;
  title: string;
  description: string;
  offerTypeCode: string;
  categoryId: number;
  hasMinPrice: boolean;
  minPrice?: number | null;
  hasConditions: boolean;
  conditions?: string | null;
  hasEndDate: boolean;
  startDate?: string | null;
  endDate?: string | null;
  createdAt: string;
  posters: string[];
  status: "DRAFT" | "ACTIVE" | "ARCHIVED" | "DELETED" | "PENDING";
  offerType: { code: string; name: string };
  category: { id: number; name: string; icon: string | null };
};

const fetchOffers = async (): Promise<Offer[]> => {
  const { data } = await axiosInstance.get("/offers/my");
  return data.data || [];
};

export default function OffersPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<string>("ALL");

  const { data: stats } = useOfferStats();

  const { data: offers = [], isLoading, isError } = useQuery({
    queryKey: ["offers", "my"],
    queryFn: fetchOffers,
  });

  const { mutate: toggleStatus, isPending: isToggling } = useMutation({
    mutationFn: async (offerId: number) => {
      await axiosInstance.patch(`/offers/${offerId}/toggle-status`);
      return offerId;
    },
    onSuccess: (offerId) => {
      queryClient.invalidateQueries({ queryKey: ["offers", "my"] });
      queryClient.invalidateQueries({ queryKey: ["offers", "stats"] });
    },
  });

  const handleEdit = (id: number) => router.push(`/my-offers/${id}`);

  const filteredOffers =
    filter === "ALL" ? offers : offers.filter((o) => o.status === filter);

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-500">
        Загрузка предложений...
      </div>
    );

  if (isError)
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-red-500">
        Ошибка при загрузке данных
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2">
        <Tag className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
        Мои предложения
      </h1>

      <OfferStatusFilter
        activeFilter={filter}
        onChange={setFilter}
        stats={stats}
      />

      {filteredOffers.length === 0 ? (
        <div className="flex items-center justify-center min-h-[40vh] text-gray-400">
          Нет предложений с таким статусом 😔
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {filteredOffers.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              onToggleStatus={() => toggleStatus(offer.id)}
              onEdit={handleEdit}
              updating={isToggling}
            />
          ))}
        </div>
      )}
    </div>
  );
}
