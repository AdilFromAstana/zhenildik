"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tag } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import OfferCard from "./components/OfferCard";
import { useOfferStats } from "../../../src/hooks/useOfferStats";
import OfferStatusFilter from "./components/OfferStatusFilter";
import axiosInstance from "@/lib/axiosInstance";

export interface Location {
  id: number;
  city: string;
  district: string;
  name: string;
  geom: string | null;
  fullAddress: string;
  street: string;
  houseNumber: string;
  residentialComplex: string | null;
  phone: string | null;
  latitude: number;
  longitude: number;
  workingHours: Record<
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday",
    {
      open: string;
      close: string;
    }
  > | null;
  createdByUserId: number;
}

export interface Offer {
  id: number;
  title: string;
  description: string | null;
  categoryId: number | null;
  category: {
    id: number;
    slug: string;
    name: string;
    icon: string | null;
  } | null;
  cityCode: string;
  benefitKind: "NEW_PRICE" | "PERCENT_OFF" | "BUY_X_GET_Y" | string;
  scope: "ITEM" | "ORDER" | "GLOBAL" | string;
  oldPrice: string | null;
  newPrice: string | null;
  discountAmount: string | null;
  discountPercent: string | null;
  buyQty: number | null;
  getQty: number | null;
  tradeInRequired: boolean | null;
  eligibility: {
    source_link: string | null;
    channel_codes: string[];
    discount_text_raw: string | null;
  } | null;
  campaignId: string | null;
  campaignName: string | null;
  startDate: string | null;
  endDate: string | null;
  posters: string[];
  locations: Location[];
  user: {
    id: number;
    name: string;
    avatar: string | null;
  };
  createdByUserId: number;
  status: "DRAFT" | "ACTIVE" | "ARCHIVE" | "DELETED" | "PENDING";
  channels: string[];
  primaryChannel: string | null;
  ctaUrl: string | null;
  sourceSystem: "MANUAL" | "WOLT" | "KASPI" | "IMPORT" | string;
  sourceUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

const fetchOffers = async (): Promise<Offer[]> => {
  const { data } = await axiosInstance.get("/offers/my");
  return data.data || [];
};

export default function OffersPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<string>("ALL");

  const { data: stats } = useOfferStats();

  const {
    data: offers = [],
    isLoading,
    isError,
  } = useQuery({
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

  const handleEdit = (id: number) => router.push(`/offers/my/${id}`);

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
