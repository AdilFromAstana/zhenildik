"use client";
import React, { useEffect, useState } from "react";
import MapControls from "./MapControls";
import DrawingTool from "./DrawingTool";
import useMapClusters from "./useMapClusters";
import type { MapInstance, PolygonInstance, PolylineInstance } from "@/types";

export interface MapContainerProps {
  locations: any[];
  setFiltered: (list: any[]) => void;
  polygon: PolygonInstance | null;
  setPolygon: (poly: PolygonInstance | null) => void;
  userCoords: [number, number] | null;
}

const MapContainer: React.FC<MapContainerProps> = ({
  locations,
  setFiltered,
  polygon,
  setPolygon,
  userCoords,
}) => {
  const [ymaps, setYmaps] = useState<Window["ymaps"] | null>(null);
  const [map, setMap] = useState<MapInstance | null>(null);
  const [polyline, setPolyline] = useState<PolylineInstance | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => {
    const apiKey = "e67fd434-4d84-4f7e-ba9e-48097b9fefb9";

    const load = async () => {
      if ((window as any).ymaps) {
        await (window as any).ymaps.ready();
        setYmaps((window as any).ymaps);
        return;
      }

      const script = document.createElement("script");
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`;
      script.async = true;
      script.onload = async () => {
        await (window as any).ymaps.ready();
        setYmaps((window as any).ymaps);
      };
      document.head.appendChild(script);
    };

    load();
  }, []);

  useEffect(() => {
    if (!ymaps) return;

    const m = new ymaps.Map(
      "map",
      {
        center: [51.1694, 71.4491],
        zoom: 12,
        controls: ["zoomControl"],
        suppressMapOpenBlock: true,
        yandexMapDisablePoiInteractivity: true,
      },
      { yandexMapDisablePoiInteractivity: true }
    );

    const removeBusinessLayers = () => {
      const layers: any = m.layers || [];
      const kill = (layer: any) => {
        try {
          const type = layer?.getMapType?.();
          const name = type ? String(type).toLowerCase() : "";
          if (
            name.includes("business") ||
            name.includes("biz") ||
            name.includes("poi") ||
            name.includes("search")
          ) {
            m.layers.remove(layer);
          }
        } catch {}
      };
      if (typeof layers.each === "function") {
        layers.each(kill);
      } else if (Array.isArray(layers)) {
        layers.forEach(kill);
      }
    };

    removeBusinessLayers();
    const t1 = setTimeout(removeBusinessLayers, 500);
    const t2 = setTimeout(removeBusinessLayers, 1500);
    const t3 = setTimeout(removeBusinessLayers, 3000);
    try {
      m.layers.events.add("add", removeBusinessLayers);
      m.layers.events.add("remove", removeBusinessLayers);
    } catch {}

    m.behaviors.enable("drag");
    m.behaviors.enable("scrollZoom");

    m.options.set("balloonAutoPan", false);
    m.events.add("balloonopen", (e: any) => e.preventDefault());
    m.events.add("hintopen", (e: any) => e.preventDefault());

    try {
      if (m.balloon) m.balloon.open = () => false;
      if (m.hint) m.hint.open = () => false;
    } catch {}

    m.events.add("click", (e: any) => {
      e.preventDefault?.();
      e.stopPropagation?.();
      try {
        const target = e.get("target");
        const isOurObject = (() => {
          if (!target) return false;
          const props =
            target.properties && typeof target.properties.get === "function"
              ? target.properties
              : null;
          if (props?.get?.("id")) return true;
          if (
            target.options &&
            typeof target.options.get === "function" &&
            target.options.get("clusterize")
          )
            return true;
          return false;
        })();
        if (!isOurObject) {
          if (m.balloon?.isOpen && m.balloon.isOpen()) {
            m.balloon.close();
          }
          setSelected(null);
        }
      } catch {
        if (m.balloon?.isOpen && m.balloon.isOpen()) {
          m.balloon.close();
        }
        setSelected(null);
      }
    });

    const manager = new ymaps.ObjectManager({
      clusterize: true,
      gridSize: 64,
    });

    manager.objects.options.set({
      hasBalloon: false,
      hasHint: false,
      iconLayout: "default#image",
      iconImageHref: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
      iconImageSize: [20, 20],
      iconImageOffset: [-10, -10],
    });

    manager.clusters.options.set({
      preset: "islands#blueClusterIcons",
      hasBalloon: false,
      hasHint: false,
    });

    const features = locations
      .filter((e) => e.latitude && e.longitude)
      .map((e) => ({
        type: "Feature",
        id: e.id,
        geometry: { type: "Point", coordinates: [e.latitude, e.longitude] },
        properties: { id: e.id, balloonContent: e.title ?? "Объект" },
      }));

    manager.add({ type: "FeatureCollection", features });

    manager.objects.events.add("click", (e: any) => {
      const objectId = e.get("objectId");
      const obj = manager.objects.getById(objectId);
      if (obj) {
        const feature = locations.find((loc) => loc.id === obj.id);
        if (feature) setSelected(feature);
      }
    });

    m.geoObjects.add(manager);
    setMap(m);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      try {
        m.destroy();
      } catch {}
    };
  }, [ymaps, locations]);

  // 🟦 Отображаем метку пользователя
  useEffect(() => {
    if (!map || !ymaps || !userCoords) return;

    const userPlacemark = new ymaps.Placemark(
      userCoords,
      { hintContent: "Вы здесь" },
      {
        preset: "islands#blueCircleDotIcon",
        iconColor: "#007BFF",
      }
    );

    map.geoObjects.add(userPlacemark);

    // При обновлении координат — перерисовываем
    return () => {
      map.geoObjects.remove(userPlacemark);
    };
  }, [map, ymaps, userCoords]);

  useMapClusters({ map, locations, polygon, setFiltered });

  return (
    <div className="w-full relative">
      <div
        id="map"
        className="h-full rounded-lg overflow-hidden border border-gray-200"
      />

      {selected && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white rounded-xl shadow-lg border border-gray-200 p-4 animate-fadeIn z-50">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-800">
              {selected.title}
            </h3>
            <button
              onClick={() => setSelected(null)}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              ✕
            </button>
          </div>

          <p className="text-sm text-gray-600 mb-2">{selected.address}</p>

          <div className="flex justify-between text-sm text-gray-500">
            <span>ID оффера: {selected.offerId}</span>
            <span>Категория: {selected.categoryId}</span>
          </div>
        </div>
      )}

      <MapControls
        map={map}
        polygon={polygon}
        setPolygon={setPolygon}
        polyline={polyline}
        setPolyline={setPolyline}
        locations={locations}
        setFiltered={setFiltered}
        isDrawing={isDrawing}
        setIsDrawing={setIsDrawing}
      />

      <DrawingTool
        map={map}
        ymaps={ymaps}
        isDrawing={isDrawing}
        locations={locations}
        polygon={polygon}
        setPolygon={setPolygon}
        setFiltered={setFiltered}
      />
    </div>
  );
};

export default MapContainer;
