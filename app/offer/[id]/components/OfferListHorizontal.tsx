import { Offer } from "app/offers/my/page";
import Image from "next/image";
import Link from "next/link";

export default function OfferListHorizontal({
  title,
  offers,
}: {
  title: string;
  offers: Offer[];
}) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-3 text-gray-900">{title}</h2>
      <div
        className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide"
      >
        {offers.map((o) => (
          <Link
            key={o.id}
            href={`/offer/${o.id}`}
            className="flex-shrink-0 w-64 sm:w-72 bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-shadow overflow-hidden"
          >
            <div className="relative w-full aspect-[4/3] bg-gray-100">
              {o.posters?.[0] && (
                <Image
                  src={o.posters[0]}
                  alt={o.title}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <div className="p-3">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="text-base font-semibold text-gray-900 line-clamp-2">
                  {o.title}
                </h3>
                {o.discountPercent != null && (
                  <span className="text-xs font-bold text-red-600 bg-red-50 rounded-full px-2 py-0.5 whitespace-nowrap">
                    −{o.discountPercent}%
                  </span>
                )}
              </div>
              {(o.newPrice != null || o.oldPrice != null) && (
                <div className="mt-1">
                  {o.newPrice != null && (
                    <div className="text-base font-extrabold text-[#FF4500]">
                      {Number(o.newPrice).toLocaleString("ru-RU")} ₸
                    </div>
                  )}
                  {o.oldPrice != null && (
                    <div className="text-xs text-gray-400 line-through">
                      {Number(o.oldPrice).toLocaleString("ru-RU")} ₸
                    </div>
                  )}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
