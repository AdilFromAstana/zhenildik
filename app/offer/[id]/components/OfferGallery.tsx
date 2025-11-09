import Image from "next/image";
import { OfferDetails } from "../utils/fetchOffer";

export default function OfferGallery({ offer }: { offer: OfferDetails }) {
  if (!offer.posters?.length) return null;
  return (
    <div className="grid gap-3 md:grid-cols-[2fr,1fr]">
      <div className="relative w-full aspect-[16/9] overflow-hidden rounded-2xl bg-gray-200">
        <Image
          src={offer.posters[0]}
          alt={offer.title}
          fill
          className="object-cover"
        />
      </div>
      {offer.posters.length > 1 && (
        <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
          {offer.posters.slice(1, 4).map((src, idx) => (
            <div
              key={idx}
              className="relative w-full aspect-[4/3] overflow-hidden rounded-xl bg-gray-200"
            >
              <Image
                src={src}
                alt={`${offer.title} фото ${idx + 2}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
