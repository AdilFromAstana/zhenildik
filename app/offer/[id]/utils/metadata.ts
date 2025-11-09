// app/offer/[id]/utils/metadata.ts
import { Metadata } from "next";
import { fetchOffer } from "./fetchOffer";
import { getDiscountAmount, isExpired } from "./offerHelpers";

export async function generateOfferMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const { id } = await params;
  const offer = await fetchOffer(id);

  if (!offer) {
    return {
      title: "Акция не найдена | Skidka-Bar.kz",
      description: "Акция не найдена или больше не доступна.",
      robots: { index: false, follow: true },
    };
  }

  const discountText =
    offer.discountPercent != null
      ? `–${offer.discountPercent}%`
      : offer.oldPrice && offer.newPrice
      ? `выгода ${getDiscountAmount(offer)} ₸`
      : "";

  const cityLabel = offer.cityName || offer.cityCode || "";
  const baseTitle = discountText
    ? `${offer.title} ${discountText}`
    : offer.title;

  const title = `${baseTitle} | Skidka-Bar.kz`;
  const description =
    offer.description?.slice(0, 180) ||
    `Выгодное предложение в ${cityLabel}. Узнай подробности на Skidka-Bar.kz.`;

  const canonical = `https://skidka-bar.kz/offer/${offer.id}`;
  const expired = isExpired(offer) || offer.status === "DELETED";

  return {
    title,
    description,
    alternates: { canonical },
    robots: expired
      ? { index: false, follow: true }
      : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      images: offer.posters?.[0]
        ? [
            {
              url: offer.posters[0],
              width: 1200,
              height: 630,
              alt: offer.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: offer.posters?.[0] ? [offer.posters[0]] : undefined,
    },
  };
}
