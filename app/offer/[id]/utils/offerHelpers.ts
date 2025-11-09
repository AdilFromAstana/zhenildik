// app/offer/[id]/utils/offerHelpers.ts

import { Offer } from "app/offers/my/page";

export function getDiscountAmount(offer: Offer): number | null {
  if (offer.oldPrice == null || offer.newPrice == null) return null;
  return offer.oldPrice - offer.newPrice;
}

export function isExpired(offer: Offer): boolean {
  if (!offer.endDate) return false;
  return new Date(offer.endDate).getTime() < Date.now();
}

export function getOfferJsonLd(offer: Offer) {
  const url = `https://skidka-bar.kz/offer/${offer.id}`;
  const discountAmount = getDiscountAmount(offer);

  return {
    "@context": "https://schema.org",
    "@type": "Offer",
    url,
    name: offer.title,
    description: offer.description || "",
    image: offer.posters?.[0],
    priceCurrency: "KZT",
    price: offer.newPrice ?? undefined,
    validFrom: offer.startDate ?? undefined,
    priceValidUntil: offer.endDate ?? undefined,
    availability: isExpired(offer)
      ? "https://schema.org/Discontinued"
      : "https://schema.org/InStock",
    category: offer.category?.name ?? undefined,
    seller: offer.user
      ? {
          "@type": "Organization",
          name: offer.user.name,
          logo: offer.user.avatar ?? undefined,
        }
      : undefined,
    aggregateRating:
      offer.user?.rating && offer.user.reviewsCount
        ? {
            "@type": "AggregateRating",
            ratingValue: offer.user.rating,
            reviewCount: offer.user.reviewsCount,
          }
        : undefined,
  };
}

export function formatPrice(value?: string | number | null): string {
  if (!value) return "—";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return String(value);
  return num.toLocaleString("ru-RU", { maximumFractionDigits: 0 });
}
