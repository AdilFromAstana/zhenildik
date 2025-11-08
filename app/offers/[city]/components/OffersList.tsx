"use client";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Offer } from "app/offers/my/page";
import DrawMap from "@/components/DrawMap/DrawMap";
import OfferCard from "@/components/OfferCard";
import OfferCardList from "./OfferCardList";

const MobileMapButton = dynamic(() => import("@/components/MobileMapButton"), {
  ssr: false,
});

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

  const locations = useMemo(() => {
    return offers.flatMap((offer) =>
      (offer.locations || []).map((loc) => {
        return loc;
      })
    );
  }, [offers]);

  return (
    <>
      {displayMode === "map" ? (
        // 📍 Передаём координаты пользователя в карту
        <DrawMap locations={locations} userCoords={userCoords} />
      ) : (
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {offers.map((offer) => {
              if (!userCoords || !offer.locations?.length) {
                return (
                  <OfferCardList
                    key={offer.id}
                    offer={offer}
                    onDetailClick={() => {}}
                    nearestDistance={null}
                  />
                );
              }

              const distances = offer.locations.map((loc) => {
                if (loc.latitude && loc.longitude) {
                  return haversineDistance(userCoords, [
                    loc.latitude,
                    loc.longitude,
                  ]);
                }
                return Infinity;
              });

              const nearestDistance = Math.min(...distances);

              return (
                <OfferCardList
                  key={offer.id}
                  offer={offer}
                  onDetailClick={() => {}}
                  nearestDistance={
                    isFinite(nearestDistance) ? nearestDistance : null
                  }
                />
              );
            })}
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
