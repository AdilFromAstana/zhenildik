"use client";
import React, { useEffect, useState } from "react";
import MapControls from "./MapControls";
import DrawingTool from "./DrawingTool";
import useMapClusters from "./useMapClusters";
import type {
  MapContainerProps,
  MapInstance,
  PolylineInstance,
} from "@/app/types";

const MapContainer: React.FC<MapContainerProps> = ({
  estates,
  setFiltered,
  polygon,
  setPolygon,
}) => {
  const [ymaps, setYmaps] = useState<Window["ymaps"] | null>(null);
  const [map, setMap] = useState<MapInstance | null>(null);
  const [polyline, setPolyline] = useState<PolylineInstance | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // 🚀 Загружаем API Яндекс.Карт
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

    const m = new ymaps.Map("map", {
      center: [51.1694, 71.4491],
      zoom: 12,
      controls: ["zoomControl"],
      suppressMapOpenBlock: true,
      yandexMapDisablePoiInteractivity: true,
    });

    // базовые настройки карты
    m.options.set("suppressMapOpenBlock", true);
    m.options.set("yandexMapDisablePoiInteractivity", true);

    // убираем лишние контролы
    [
      "searchControl",
      "trafficControl",
      "typeSelector",
      "fullscreenControl",
      "rulerControl",
    ].forEach((ctrl) => {
      if (m.controls.get(ctrl)) m.controls.remove(ctrl);
    });

    m.behaviors.enable("drag");
    m.behaviors.enable("scrollZoom");

    // функция вырезания бизнес-слоёв (POI с карточками организаций)
    const removeBusinessLayers = () => {
      const layers: any = m.layers || [];

      if (typeof layers.each === "function") {
        layers.each((layer: any) => {
          try {
            const type = layer?.getMapType?.();
            if (type && String(type).toLowerCase().includes("business")) {
              m.layers.remove(layer);
              console.log("🧹 убран бизнес-слой:", type);
            }
          } catch {
            /* ignore */
          }
        });
      } else if (Array.isArray(layers)) {
        layers.forEach((layer: any) => {
          try {
            const type = layer?.getMapType?.();
            if (type && String(type).toLowerCase().includes("business")) {
              m.layers.remove(layer);
              console.log("🧹 убран бизнес-слой (arr):", type);
            }
          } catch {
            /* ignore */
          }
        });
      }
    };

    // вызываем сразу и через задержку, т.к. слои могут прилетать асинхронно
    removeBusinessLayers();
    const t1 = setTimeout(removeBusinessLayers, 500);
    const t2 = setTimeout(removeBusinessLayers, 1500);
    const t3 = setTimeout(removeBusinessLayers, 3000);

    // пробуем слушать добавление слоёв, чтобы сразу выпиливать бизнес-слой
    try {
      m.layers.events.add("add", removeBusinessLayers);
      m.layers.events.add("remove", removeBusinessLayers);
    } catch {
      /* ignore */
    }

    // жёстко блокируем попытки открыть системные баллуны (подсказки яндекса)
    m.events.add("balloonopen", (e: any) => {
      try {
        e.preventDefault?.();
        e.stopPropagation?.();
      } catch {}
      try {
        if (m.balloon && m.balloon.isOpen && m.balloon.isOpen()) {
          m.balloon.close();
        }
      } catch {}
    });

    m.events.add("hintopen", (e: any) => {
      try {
        e.preventDefault?.();
        e.stopPropagation?.();
      } catch {}
      try {
        if (m.hint && m.hint.isOpen && m.hint.isOpen()) {
          m.hint.close();
        }
      } catch {}
    });

    // переопределяем open у balloon / hint, чтобы они вообще не показывались
    try {
      if (m.balloon) {
        m.balloon.open = (..._args: any[]) => {
          console.log("❌ попытка открыть системный балун заблокирована");
          return false;
        };
      }
      if (m.hint) {
        m.hint.open = (..._args: any[]) => false;
      }
    } catch {
      /* ignore */
    }

    // основной клик по карте:
    // если кликнули не по нашему объекту — режем всплытие и закрываем балун
    m.events.add("click", (e: any) => {
      try {
        const target = e.get("target");

        // определяем наш объект (из ObjectManager) по наличию props/id
        const isOurObject = (() => {
          if (!target) return false;
          const props =
            target.properties && typeof target.properties.get === "function"
              ? target.properties
              : null;
          const maybeId = props?.get?.("id");
          if (maybeId) return true;
          // fallback: если это кластеры / объекты менеджера
          if (
            target.options &&
            typeof target.options.get === "function" &&
            target.options.get("clusterize")
          ) {
            return true;
          }
          return false;
        })();

        if (!isOurObject) {
          e.preventDefault?.();
          e.stopPropagation?.();
          if (m.balloon && m.balloon.isOpen && m.balloon.isOpen()) {
            m.balloon.close();
          }
        }
      } catch {
        /* ignore */
      }
    });

    // создаём ObjectManager под наши точки
    const manager = new ymaps.ObjectManager({
      clusterize: true,
      gridSize: 64,
    });

    manager.clusters.options.set({
      preset: "islands#blueClusterIcons",
    });

    manager.objects.options.set({
      iconLayout: "default#image",
      iconImageHref: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
      iconImageSize: [18, 18],
      iconImageOffset: [-9, -9],
    });

    const features = estates
      .filter((e) => e.latitude && e.longitude)
      .map((e) => ({
        type: "Feature",
        id: e.id,
        geometry: {
          type: "Point",
          coordinates: [e.latitude, e.longitude],
        },
        properties: {
          id: e.id,
          balloonContent: e.title ?? "Объект",
        },
      }));

    manager.add({
      type: "FeatureCollection",
      features,
    });

    m.geoObjects.add(manager);

    setMap(m);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);

      try {
        m.destroy();
      } catch {
        /* ignore */
      }
    };
  }, [ymaps, estates]);

  // 📦 кластеризация
  useMapClusters({ map, estates, polygon, setFiltered });

  return (
    <div className="w-full relative">
      <div
        id="map"
        className="h-full rounded-lg overflow-hidden border border-gray-200"
      />
      <MapControls
        map={map}
        polygon={polygon}
        setPolygon={setPolygon}
        polyline={polyline}
        setPolyline={setPolyline}
        estates={estates}
        setFiltered={setFiltered}
        isDrawing={isDrawing}
        setIsDrawing={setIsDrawing}
      />
      <DrawingTool
        map={map}
        ymaps={ymaps}
        isDrawing={isDrawing}
        estates={estates}
        polygon={polygon}
        setPolygon={setPolygon}
        setFiltered={setFiltered}
      />
    </div>
  );
};

export default MapContainer;
