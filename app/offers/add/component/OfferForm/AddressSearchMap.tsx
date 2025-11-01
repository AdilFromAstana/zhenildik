"use client";
import React, { useEffect, useState, useRef } from "react";

type AddressSearchMapProps = {
  onAddressSelect: (coords: [number, number], address: string) => void;
};

// координаты в формате [долгота, широта]
const ASTANA_BOUNDS: [[number, number], [number, number]] = [
  [51.0, 71.25], // юго-запад
  [51.3, 71.7], // северо-восток
];

const ASTANA_CENTER: [number, number] = [51.1282, 71.4304];

const AddressSearchMap: React.FC<AddressSearchMapProps> = ({
  onAddressSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);

  const ymapsRef = useRef<any>(null);
  const mapRef = useRef<any>(null);
  const placemarkRef = useRef<any>(null);
  const timeoutRef = useRef<any>(null);
  const mapReady = useRef(false);

  // --- Загрузка карты ---
  useEffect(() => {
    const apiKey = "e67fd434-4d84-4f7e-ba9e-48097b9fefb9";
    const init = async () => {
      if ((window as any).ymaps) {
        await (window as any).ymaps.ready();
        ymapsRef.current = (window as any).ymaps;
        createMap();
        return;
      }
      const script = document.createElement("script");
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`;
      script.async = true;
      script.onload = async () => {
        await (window as any).ymaps.ready();
        ymapsRef.current = (window as any).ymaps;
        createMap();
      };
      document.head.appendChild(script);
    };

    const createMap = () => {
      if (!ymapsRef.current || mapReady.current) return;
      const map = new ymapsRef.current.Map("map", {
        center: ASTANA_CENTER,
        zoom: 12,
        controls: ["zoomControl"],
      });
      map.behaviors.enable("scrollZoom");
      mapRef.current = map;
      mapReady.current = true;
    };

    init();
  }, []);

  // --- Расстояние между двумя точками ---
  const getDistance = (p1: [number, number], p2: [number, number]): number => {
    if (!ymapsRef.current) return 0;
    return ymapsRef.current.coordSystem.geo.getDistance(p1, p2);
  };

  // --- Поиск только в пределах Астаны ---
  const handleSearch = async (q: string) => {
    if (!ymapsRef.current || !mapRef.current || !q.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }

    try {
      const res = await ymapsRef.current.suggest(q.trim(), {
        boundedBy: ASTANA_BOUNDS,
        strictBounds: true,
        results: 10,
      });

      console.log("res: ", res);

      const arr = res.geoObjects.toArray();

      const withDistances = arr.map((obj: any) => {
        const coords = obj.geometry.getCoordinates();
        const distance = userCoords ? getDistance(userCoords, coords) : null;
        const meta = obj.properties.get("metaDataProperty.GeocoderMetaData");
        const city =
          meta?.Address?.Components?.find((c: any) => c.kind === "locality")
            ?.name || "";
        return { obj, coords, distance, city };
      });

      setResults(withDistances);
      setOpen(withDistances.length > 0);
    } catch (e) {
      console.error(e);
      setResults([]);
      setOpen(false);
    }
  };

  // --- Обработка ввода ---
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => handleSearch(val), 500);
  };

  // --- Выбор адреса ---
  const handleSelect = (item: any) => {
    const coords = item.coords;
    const name = item.obj.properties.get("name");

    if (placemarkRef.current)
      mapRef.current.geoObjects.remove(placemarkRef.current);

    const mark = new ymapsRef.current.Placemark(coords, {
      iconCaption: name,
    });
    placemarkRef.current = mark;
    mapRef.current.geoObjects.add(mark);
    mapRef.current.setCenter(coords, 15, { duration: 300 });

    onAddressSelect(coords, name);
    setSearchQuery(name);
    setResults([]);
    setOpen(false);
  };

  const formatDistance = (meters: number | null) => {
    if (meters === null) return "";
    return meters < 1000
      ? `${Math.round(meters)} м`
      : `${(meters / 1000).toFixed(1)} км`;
  };

  return (
    <div className="w-full h-[75vh] relative">
      <div className="absolute z-50 top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-md">
        <div className="relative">
          <input
            value={searchQuery}
            onChange={handleInput}
            placeholder="Введите адрес в Астане..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          {open && results.length > 0 && (
            <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {results.map((r, i) => (
                <div
                  key={i}
                  onClick={() => handleSelect(r)}
                  className="p-3 border-b last:border-0 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                >
                  <span>{r.obj.properties.get("name")}</span>
                  {r.distance !== null && (
                    <span className="text-sm text-gray-500">
                      {formatDistance(r.distance)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div
        id="map"
        className="h-full rounded-lg overflow-hidden border border-gray-200"
      />
    </div>
  );
};

export default AddressSearchMap;
