"use client";
import { MapControlsProps } from "@/app/types";
import React from "react";

const MapControls: React.FC<MapControlsProps> = ({
  map,
  polygon,
  setPolygon,
  polyline,
  setPolyline,
  estates,
  setFiltered,
  isDrawing,
  setIsDrawing,
}) => {
  const handleReset = () => {
    if (polygon) map?.geoObjects.remove(polygon);
    if (polyline) map?.geoObjects.remove(polyline);
    setPolygon(null);
    setPolyline(null);

    const bounds = map?.getBounds();
    if (bounds) {
      const [[minLat, minLng], [maxLat, maxLng]] = bounds;
      const visible = estates.filter((e) => {
        const lat = Number(e.latitude);
        const lng = Number(e.longitude);
        return (
          !isNaN(lat) &&
          !isNaN(lng) &&
          lat >= minLat &&
          lat <= maxLat &&
          lng >= minLng &&
          lng <= maxLng
        );
      });
      setFiltered(visible);
    }
  };

  return (
    <div className="absolute top-4 left-4 z-10 flex gap-2">
      <button
        onClick={() => setIsDrawing(!isDrawing)}
        className={`px-3 py-1 rounded-md text-sm font-medium shadow-md transition ${isDrawing
            ? "bg-red-500 text-white"
            : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-100"
          }`}
      >
        {isDrawing ? "⛔ Завершить" : "✏️ Обвести область"}
      </button>

      <button
        onClick={handleReset}
        className="px-3 py-1 rounded-md text-sm font-medium shadow-md bg-white text-gray-800 border border-gray-300 hover:bg-gray-100"
      >
        ♻️ Сбросить
      </button>
    </div>
  );
};

export default MapControls;
