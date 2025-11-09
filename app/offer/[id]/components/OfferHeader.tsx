"use client";
import Image from "next/image";
import { Flame } from "lucide-react";
import { Offer } from "app/offers/my/page";

export default function OfferHeader({ offer }: { offer: Offer }) {
  const discount = offer.discountPercent || null;
  const partner = offer.user?.name || "Партнёр";

  return (
    <div className="relative overflow-hidden shadow-lg">
      <Image
        src={
          offer.posters?.[0] ||
          "https://placehold.co/800x400/ECEFF1/607D8B?text=Нет+изображения"
        }
        alt={offer.title}
        width={1200}
        height={600}
        className="w-full h-72 object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {discount && (
        <div className="absolute top-4 right-4 bg-red-600 text-white font-black text-lg py-2 px-4 rounded-xl shadow-xl transform rotate-2">
          <Flame className="inline w-5 h-5 mr-1" /> −{discount}% СКИДКА!
        </div>
      )}

      <div className="absolute bottom-0 left-0 p-6 sm:p-8 text-white">
        <h1 className="text-3xl sm:text-4xl font-black">{offer.title}</h1>
        <p className="text-white/90 text-lg font-medium mt-1">
          Скидка {discount ?? "—"}% от {partner}.
        </p>
      </div>
    </div>
  );
}
