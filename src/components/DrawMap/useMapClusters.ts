"use client";
import { UseMapClustersProps } from "@/types";
import { useEffect, useRef } from "react";

export default function useMapClusters({
  map,
  locations,
  polygon,
  setFiltered,
}: UseMapClustersProps) {
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!map || !locations?.length) return;

    const updateVisible = () => {
      if (!map) return;
      const bounds = map.getBounds();
      if (!bounds) return;

      const [[minLat, minLng], [maxLat, maxLng]] = bounds;

      const visible = locations.filter(
        (e) =>
          e.latitude >= minLat &&
          e.latitude <= maxLat &&
          e.longitude >= minLng &&
          e.longitude <= maxLng
      );

      setFiltered(visible);
    };

    const clusterMap = () => {
      if (!map) return;

      const zoom = map.getZoom?.() ?? 12;
      const bounds = map.getBounds?.();
      if (!bounds) return;

      const cellSize = 0.01 / Math.pow(2, zoom - 10);

      const clusters: Record<string, any[]> = {};
      for (const e of locations) {
        const key =
          Math.floor(e.latitude / cellSize) +
          "_" +
          Math.floor(e.longitude / cellSize);
        if (!clusters[key]) clusters[key] = [];
        clusters[key].push(e);
      }

      console.log(`📦 Зум ${zoom}: кластеров ${Object.keys(clusters).length}`);
      updateVisible();
    };

    const onBoundsChange = () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(clusterMap, 300);
    };

    // добавляем слушатель
    map.events.add("boundschange", onBoundsChange);

    // инициализация при первом монтировании
    clusterMap();

    return () => {
      map.events.remove("boundschange", onBoundsChange);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [map, locations, polygon]);
}
