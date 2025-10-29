"use client";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Offer } from "app/offers/my/page";
import DrawMap from "@/components/DrawMap/DrawMap";
import DealCard from "@/components/DealCard";

const MobileMapButton = dynamic(() => import("@/components/MobileMapButton"), {
  ssr: false,
});

// 🔹 Вспомогательная функция для вычисления расстояния (в км)
function haversineDistance([lat1, lon1]: number[], [lat2, lon2]: number[]) {
  const R = 6371; // радиус Земли в км
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

interface OffersListProps {
  offers: Offer[];
  total: number;
}

export default function OffersList({ offers = [], total }: OffersListProps) {
  const [displayMode, setDisplayMode] = useState<"list" | "map">("list");
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
  const [sortedOffers, setSortedOffers] = useState<Offer[]>(offers);

  // 1️⃣ Запрашиваем геолокацию пользователя
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => {
        console.warn("Не удалось получить геолокацию:", err.message);
      },
      { enableHighAccuracy: true }
    );
  }, []);

  // 2️⃣ На основе геолокации сортируем по ближайшей точке
  useEffect(() => {
    if (!userCoords || offers.length === 0) {
      setSortedOffers(offers);
      return;
    }

    const withNearest = offers.map((offer) => {
      if (!offer.locations?.length) return offer;

      const nearest = offer.locations.reduce((closest: any, loc: any) => {
        const dist = haversineDistance(userCoords, [
          loc.latitude,
          loc.longitude,
        ]);
        if (!closest || dist < closest.distanceKm) {
          return { ...loc, distanceKm: dist };
        }
        return closest;
      }, null);

      return { ...offer, nearestLocation: nearest };
    });

    const sorted = withNearest.sort(
      (a: any, b: any) =>
        (a.nearestLocation?.distanceKm ?? Infinity) -
        (b.nearestLocation?.distanceKm ?? Infinity)
    );

    setSortedOffers(sorted);
  }, [offers, userCoords]);

  // 3️⃣ Массив локаций для карты
  const locations = useMemo(() => {
    return offers.flatMap((offer) =>
      (offer.locations || []).map((loc) => ({
        id: `${offer.id}-${loc.id}`,
        offerId: offer.id,
        title: offer.title,
        latitude: loc.latitude,
        longitude: loc.longitude,
        address: `${loc.street}, ${loc.houseNumber}`,
        categoryId: offer.categoryId,
      }))
    );
  }, [offers]);

  return (
    <>
      {displayMode === "map" ? (
        // 📍 Передаём координаты пользователя в карту
        <DrawMap locations={locations} userCoords={userCoords} />
      ) : (
        <section>
          <div className="text-xl font-bold mb-4 text-gray-800">
            Найдено акций {total}
          </div>

          {!userCoords && (
            <p className="text-gray-500 mb-3">
              Разрешите доступ к геолокации, чтобы увидеть ближайшие акции 🔍
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedOffers.map((deal: any) => (
              <DealCard
                key={deal.id}
                deal={deal}
                onDetailClick={() => {}}
                // можно отобразить расстояние прямо на карточке:
                extraInfo={
                  deal.nearestLocation && userCoords
                    ? `${deal.nearestLocation.distanceKm.toFixed(1)} км`
                    : undefined
                }
              />
            ))}
          </div>
        </section>
      )}

      <MobileMapButton
        onClick={() => {
          setDisplayMode((v) => (v === "list" ? "map" : "list"));
        }}
      />
    </>
  );
}
