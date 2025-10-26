"use client";
import { useEffect } from "react";
import type { DrawingToolProps } from "@/app/types";

const DrawingTool: React.FC<DrawingToolProps> = ({
  map,
  ymaps,
  isDrawing,
  estates,
  polygon,
  setPolygon,
  setFiltered,
}) => {
  useEffect(() => {
    if (!map || !ymaps) return;

    let coords: number[][] = [];
    let isDown = false;
    let line: ymaps.Polyline | null = null;

    const onMouseDown = () => {
      if (!isDrawing) return;
      isDown = true;
      coords = [];
      if (polygon) map.geoObjects.remove(polygon);
      if (line) {
        map.geoObjects.remove(line);
        line = null;
      }
      line = new ymaps.Polyline(
        [],
        {},
        { strokeColor: "#00AA00", strokeWidth: 3 }
      );
      map.geoObjects.add(line);
    };

    const onMouseMove = (e: any) => {
      if (!isDrawing || !isDown || !line) return;
      const point = e.get("coords");
      coords.push(point);
      line.geometry.setCoordinates(coords);
    };

    const onMouseUp = () => {
      if (!isDrawing || !isDown) return;
      isDown = false;

      if (coords.length < 3) return;
      if (line) map.geoObjects.remove(line);

      const poly = new ymaps.Polygon(
        [coords],
        {},
        {
          fillColor: "#00FF0033",
          strokeColor: "#00AA00",
          strokeWidth: 2,
        }
      );
      map.geoObjects.add(poly);
      setPolygon(poly);

      const inside = estates.filter((e) => {
        try {
          return poly.geometry.contains([e.latitude!, e.longitude!]);
        } catch {
          return false;
        }
      });
      setFiltered(inside);
    };

    map.events.add("mousedown", onMouseDown);
    map.events.add("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      map.events.remove("mousedown", onMouseDown);
      map.events.remove("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [map, ymaps, isDrawing, estates, polygon]);

  return null;
};

export default DrawingTool;
