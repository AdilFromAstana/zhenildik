import { notFound } from "next/navigation";
import {
  fetchOffer,
  fetchSimilarOffers,
  fetchMerchantOffers,
} from "./utils/fetchOffer";
import { generateOfferMetadata } from "./utils/metadata";
import { getDiscountAmount } from "./utils/offerHelpers";
import OfferJsonLd from "./components/OfferJsonLd";
import {
  MapPin,
  Phone,
  Map,
  Star,
  ArrowRight,
  Info,
  ArrowLeft,
} from "lucide-react";
import OfferListHorizontal from "./components/OfferListHorizontal";
import Link from "next/link";
import { headers } from "next/headers";
import BackButton from "./components/BackButton";

export const generateMetadata = generateOfferMetadata;

export default async function OfferPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const offer = await fetchOffer(id);
  if (!offer) notFound();

  const [similarOffers, merchantOffers] = await Promise.all([
    fetchSimilarOffers(offer),
    fetchMerchantOffers(offer),
  ]);

  const headersList = await headers();
  const referer = headersList.get("referer");
  const backUrl =
    referer && !referer.includes(`/offer/${offer.id}`) ? referer : "/offers";

  const discountAmount = getDiscountAmount(offer);

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <OfferJsonLd offer={offer} />

      <section className="relative w-full h-80 sm:h-[400px] overflow-hidden">
        <BackButton />

        <img
          src={offer.posters?.[0] || "https://placehold.co/800x400"}
          alt={offer.title}
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
        <div className="absolute top-4 right-4 bg-red-600 text-white text-lg font-black py-2 px-4 rounded-xl shadow-lg">
          −{offer.discountPercent}% СКИДКА
        </div>
        <div className="absolute bottom-0 p-6 sm:p-10 text-white">
          <h1 className="text-3xl sm:text-4xl font-black mb-2">
            {offer.title}
          </h1>
          <p className="text-white/90 text-lg">
            Скидка {offer.discountPercent}% от {offer.user?.name}
          </p>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 sm:px-8 mt-8 space-y-10">
        {/* ЦЕНА + CTA */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
          <div>
            <div className="text-base text-gray-600 mb-1">Цена сейчас</div>
            <div className="text-5xl font-black text-orange-500">
              {Number(offer.newPrice).toLocaleString("ru-RU")} ₸
            </div>
            {offer.oldPrice && (
              <div className="text-lg text-gray-400 line-through mt-1">
                {Number(offer.oldPrice).toLocaleString("ru-RU")} ₸
              </div>
            )}
            <div className="text-green-600 font-semibold mt-2">
              Экономия {discountAmount} ₸
            </div>
          </div>
          <a
            href={offer.eligibility?.source_link || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-lg font-bold py-3 px-8 rounded-xl shadow-lg hover:opacity-90 transition"
          >
            Перейти в Wolt <ArrowRight className="w-5 h-5" />
          </a>
        </div>

        {/* ОПИСАНИЕ */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-orange-500" /> Что входит в
            предложение
          </h2>
          <p className="text-gray-800 leading-relaxed mb-4">
            {offer.description}
          </p>
          <ul className="grid sm:grid-cols-2 gap-y-2">
            {offer.description?.split(",").map((item: string) => (
              <li key={item.trim()} className="flex items-center text-gray-700">
                <MapPin className="w-4 h-4 text-orange-500 mr-2" />{" "}
                {item.trim()}
              </li>
            ))}
          </ul>
        </div>

        {/* ПАРТНЁР */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-orange-500" /> Партнёр акции
          </h2>
          <div className="flex items-center gap-4 border-b border-gray-100 pb-4 mb-4">
            <img
              src={
                offer.user?.avatar ||
                "https://img.freepik.com/premium-vector/store-icon_791764-4106.jpg"
              }
              alt={offer.user?.name}
              className="w-16 h-16 rounded-full border-4 border-orange-500/20"
            />
            <div>
              <p className="text-xl font-bold text-gray-900">
                {offer.user?.name}
              </p>
              <p className="text-sm text-gray-500">
                {offer.cityCode.toUpperCase()}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            {offer.eligibility?.discount_text_raw}
          </p>
        </div>

        {/* ЛОКАЦИИ */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Map className="w-5 h-5 text-orange-500" /> Где действует акция
          </h2>
          {offer.locations?.length ? (
            <ul className="space-y-4">
              {offer.locations.map((loc) => (
                <li
                  key={loc.id}
                  className="border border-gray-100 rounded-xl p-4"
                >
                  <p className="font-semibold text-gray-900">{loc.name}</p>
                  <p className="text-sm text-gray-600 flex items-center mt-1">
                    <MapPin className="w-4 h-4 text-orange-500 mr-2" />{" "}
                    {loc.fullAddress}
                  </p>
                  {loc.phone && (
                    <p className="text-sm text-gray-600 flex items-center mt-1">
                      <Phone className="w-4 h-4 text-orange-500 mr-2" />{" "}
                      <a href={`tel:${loc.phone}`} className="hover:underline">
                        {loc.phone}
                      </a>
                    </p>
                  )}
                  <div className="mt-2 flex gap-3 text-xs text-blue-600 font-medium">
                    <a
                      href={`https://yandex.kz/maps/?ll=${loc.longitude}%2C${loc.latitude}&z=16`}
                      target="_blank"
                      className="flex items-center hover:underline"
                    >
                      <Map className="w-3.5 h-3.5 mr-1 text-orange-500" />{" "}
                      Яндекс Карты
                    </a>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${loc.latitude},${loc.longitude}`}
                      target="_blank"
                      className="flex items-center hover:underline"
                    >
                      <Map className="w-3.5 h-3.5 mr-1 text-orange-500" />{" "}
                      Google Maps
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">Адреса не указаны</p>
          )}
        </div>

        {similarOffers.length > 0 && (
          <OfferListHorizontal
            title="Похожие предложения"
            offers={similarOffers}
          />
        )}
        {merchantOffers.length > 0 && (
          <OfferListHorizontal
            title={`Другие акции ${offer.user.name}`}
            offers={merchantOffers}
          />
        )}
      </main>
    </div>
  );
}
