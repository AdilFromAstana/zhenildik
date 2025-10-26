"use client";
import { UseMapClustersProps } from "@/app/types";
import { useEffect } from "react";

export default function useMapClusters({
  map,
  estates,
  polygon,
  setFiltered,
}: UseMapClustersProps) {
  useEffect(() => {
    if (!map || !estates.length) return;

    let debounce: NodeJS.Timeout | null = null;

    const updateVisible = () => {
      if (polygon) return;
      const bounds = map.getBounds();
      if (!bounds) return;
      const [[minLat, minLng], [maxLat, maxLng]] = bounds;
      const visible = estates.filter(
        (e) =>
          e.latitude! >= minLat &&
          e.latitude! <= maxLat &&
          e.longitude! >= minLng &&
          e.longitude! <= maxLng
      );
      setFiltered(visible);
    };

    const clusterMap = () => {
      const zoom = map.getZoom();
      const bounds = map.getBounds();
      if (!bounds) return;
      // const [[minLat, minLng], [maxLat, maxLng]] = bounds;
      const cellSize = 0.01 / Math.pow(2, zoom - 10);

      const clusters: Record<string, any[]> = {};
      for (const e of estates) {
        const key =
          Math.floor(e.latitude! / cellSize) +
          "_" +
          Math.floor(e.longitude! / cellSize);
        if (!clusters[key]) clusters[key] = [];
        clusters[key].push(e);
      }
      console.log(`📦 Зум ${zoom}: кластеров ${Object.keys(clusters).length}`);
      updateVisible();
    };

    const onMoveEnd = () => {
      if (debounce) clearTimeout(debounce);
      debounce = setTimeout(clusterMap, 400);
    };

    map.events.add("boundschange", onMoveEnd);
    clusterMap();

    return () => {
      map.events.remove("boundschange", onMoveEnd);
      if (debounce) clearTimeout(debounce);
    };
  }, [map, estates, polygon]);
}
