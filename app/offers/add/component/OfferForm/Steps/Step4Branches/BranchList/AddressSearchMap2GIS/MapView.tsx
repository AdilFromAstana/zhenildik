"use client";
import React, { useEffect, useRef, useCallback } from "react";
import { useMap } from "@/providers/MapProvider";
import { LocateFixed } from "lucide-react";

type MapViewProps = {
  initialCoords?: [number, number];
  initialName?: string;
  selectedCoords?: [number, number] | null;
  selectedLabel?: string;
};

const MapView: React.FC<MapViewProps> = ({
  initialCoords,
  initialName,
  selectedCoords,
  selectedLabel,
}) => {
  const { map, api, isReady, containerRef } = useMap();
  const markerRef = useRef<any | null>(null);
  const locationMarkerRef = useRef<any | null>(null);

  const focusOn = useCallback(
    (coords: [number, number], labelText = "") => {
      if (!map || !api) return;
      if (markerRef.current) markerRef.current.destroy();

      markerRef.current = new api.Marker(map, {
        coordinates: coords,
        icon: "/branch-icon.svg",
        size: [20, 30],
      });

      map.setCenter(coords);
      map.setZoom(16);
    },
    [map, api]
  );

  useEffect(() => {
    if (isReady && initialCoords) focusOn(initialCoords, initialName);
  }, [isReady, initialCoords, initialName, focusOn]);

  useEffect(() => {
    if (selectedCoords) focusOn(selectedCoords, selectedLabel);
  }, [selectedCoords, selectedLabel, focusOn]);

  const handleLocate = () => {
    if (!map || !api) return;

    if (!navigator.geolocation) {
      alert("Геолокация не поддерживается вашим браузером.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [
          pos.coords.longitude,
          pos.coords.latitude,
        ];

        if (locationMarkerRef.current) {
          locationMarkerRef.current.setCoordinates(coords);
        } else {
          locationMarkerRef.current = new api.Marker(map, {
            coordinates: coords,
            icon: "/user-point.svg",
            size: [24, 24],
          });
        }

        map.setCenter(coords);
        map.setZoom(15);
      },
      () => alert("Не удалось определить местоположение.")
    );
  };

  return (
    <div className="relative h-full rounded-lg overflow-hidden border border-gray-200">
      <div ref={containerRef} className="absolute inset-0" />

      {/* Кнопка поверх карты */}
      <button
        onClick={handleLocate}
        className="absolute bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 active:scale-95 transition flex items-center justify-center"
        title="Моё местоположение"
        aria-label="Моё местоположение"
      >
        <LocateFixed className="w-6 h-6" />
      </button>
    </div>
  );
};

export default React.memo(MapView);
