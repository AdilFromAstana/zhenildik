import { Offer } from "app/offers/my/page";

// app/offer/[id]/utils/fetchOffer.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type OfferLocation = {
  id: number;
  fullAddress: string;
  lat?: number | null;
  lng?: number | null;
  workHours?: string | null;
};

export type OfferUser = {
  id: number;
  name: string;
  avatar?: string | null;
  rating?: number | null;
  reviewsCount?: number | null;
};

export type OfferCategory = {
  id: number;
  name: string;
  slug?: string | null;
};

export type OfferStatus =
  | "DRAFT"
  | "ACTIVE"
  | "ARCHIVE"
  | "DELETED"
  | "PENDING";

export type OfferListResponse = {
  data: Offer[];
  total: number;
};

/* ========================
   Основные запросы
   ======================== */

export async function fetchOffer(id: string): Promise<Offer | null> {
  if (!API_URL) throw new Error("NEXT_PUBLIC_API_URL is not defined");

  const res = await fetch(`${API_URL}/offers/${id}`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`Failed to fetch offer ${id}`);
  }

  return (await res.json()) as Offer;
}

export async function fetchSimilarOffers(offer: Offer): Promise<Offer[]> {
  if (!API_URL) throw new Error("NEXT_PUBLIC_API_URL is not defined");

  const params = new URLSearchParams({
    cityCode: offer.cityCode!,
    limit: "8",
  });
  if (offer.category?.id) params.set("categoryId", String(offer.category.id));

  const res = await fetch(`${API_URL}/offers?${params.toString()}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) return [];

  const json = (await res.json()) as OfferListResponse;
  return json.data.filter((o) => o.id !== offer.id);
}

export async function fetchMerchantOffers(offer: Offer): Promise<Offer[]> {
  if (!API_URL) throw new Error("NEXT_PUBLIC_API_URL is not defined");
  if (!offer.user?.id) return [];

  const params = new URLSearchParams({
    userId: String(offer.user.id),
    limit: "8",
  });

  const res = await fetch(`${API_URL}/offers?${params.toString()}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) return [];

  const json = (await res.json()) as OfferListResponse;
  return json.data.filter((o) => o.id !== offer.id);
}
