"use client";
import React, { useEffect, useState, useRef } from "react";
import { load } from "@2gis/mapgl";

type AddressSearchMapProps = {
  onAddressSelect: (coords: [number, number], address: string) => void;
  initialCoords?: [number, number];
  initialName?: string;
};

const ASTANA_CENTER: [number, number] = [71.4304, 51.1282]; // [lon, lat]
const DGIS_API_KEY = "4dd7b86c-ee1e-42ea-8efa-da3f2eadfb7d";

const AddressSearchMap2GIS: React.FC<AddressSearchMapProps> = ({
  onAddressSelect,
  initialCoords,
  initialName,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);

  const apiRef = useRef<any>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const timeoutRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // ✅ Функция для фокуса на точке
  const focusOn = (coords: [number, number], labelText = "") => {
    if (!mapRef.current || !apiRef.current) return;

    // удалить старый маркер
    if (markerRef.current) {
      markerRef.current.destroy();
      markerRef.current = null;
    }

    // добавить новый маркер
    markerRef.current = new apiRef.current.Marker(mapRef.current, {
      coordinates: coords, // [lon, lat]
      icon: {
        url: "https://raw.githubusercontent.com/2gis/mock-api-mapgl/master/marker-icon.svg",
        size: [32, 48],
        anchor: [16, 48],
      },
      label: labelText ? { text: labelText } : undefined,
    });

    // центрировать карту
    mapRef.current.setCenter(coords);
    mapRef.current.setZoom(16);
  };

  // ✅ Инициализация карты
  useEffect(() => {
    let mapInstance: any;
    load().then((mapglAPI) => {
      apiRef.current = mapglAPI;
      mapInstance = new mapglAPI.Map(mapContainerRef.current!, {
        center: initialCoords || ASTANA_CENTER,
        zoom: initialCoords ? 16 : 12,
        key: DGIS_API_KEY,
      });
      mapRef.current = mapInstance;

      // после полной загрузки
      mapInstance.once("idle", () => {
        if (initialCoords) {
          focusOn(initialCoords, initialName || "Филиал");
        }
        setTimeout(() => mapInstance.invalidateSize(), 200);
      });
    });

    return () => {
      if (markerRef.current) markerRef.current.destroy();
      if (mapInstance) mapInstance.destroy();
    };
  }, [initialCoords, initialName]);

  // --- Поиск по 2GIS ---
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }
    const url = `https://catalog.api.2gis.com/3.0/suggests?q=${encodeURIComponent(
      query
    )}&location=71.4304,51.1282&suggest_type=object&key=${DGIS_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    const items = data?.result?.items ?? [];
    setResults(items);
    setOpen(items.length > 0);
  };

  // --- Дебаунс ввода ---
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => handleSearch(val), 400);
  };

  // --- Детали объекта ---
  const fetchItemDetails = async (id: string) => {
    const url = `https://catalog.api.2gis.com/3.0/items/byid?id=${id}&fields=items.point,items.geometry.centroid,items.external_content,items.description,items.full_name,items.name&key=${DGIS_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    if (!data?.result?.items?.length) return null;
    return data.result.items[0];
  };

  // --- Клик по подсказке ---
  const handleSelect = async (item: any) => {
    let coords: [number, number] | null = null;
    let label = item?.full_address_name || item?.name || "";

    if (item?.point?.lon && item?.point?.lat) {
      coords = [item.point.lon, item.point.lat];
    } else if (item?.id) {
      const details = await fetchItemDetails(item.id);
      if (details?.point) {
        coords = [details.point.lon, details.point.lat];
      } else if (details?.geometry?.centroid) {
        coords = [details.geometry.centroid.lon, details.geometry.centroid.lat];
      }
      label = details?.full_name || details?.name || label;
      setSelectedItem({ ...details, coords });
    }

    if (!coords) return;

    focusOn(coords, label);
    setSearchQuery(label);
    setResults([]);
    setOpen(false);
  };

  // --- Подтверждение выбора ---
  const handleConfirm = () => {
    if (selectedItem?.coords) {
      onAddressSelect(
        selectedItem.coords,
        selectedItem.full_name || selectedItem.name || ""
      );
      setSelectedItem(null);
    }
  };

  return (
    <div className="w-full h-full relative">
      {/* Поле поиска */}
      <div className="absolute z-50 top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-md">
        <div className="relative">
          <input
            value={searchQuery}
            onChange={handleInput}
            placeholder="Введите адрес или название..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          {open && results.length > 0 && (
            <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {results.map((r: any, i: number) => (
                <div
                  key={`${r.id || r.name}-${i}`}
                  onClick={() => handleSelect(r)}
                  className="p-3 border-b last:border-0 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="font-medium">
                    {r.full_address_name || r.name}
                  </div>
                  {r.address_name && (
                    <div className="text-sm text-gray-500">
                      {r.address_name}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Карта */}
      <div
        ref={mapContainerRef}
        className="h-full rounded-lg overflow-hidden border border-gray-200"
      />

      {/* Карточка выбранного объекта */}
      {selectedItem && (
        <div className="absolute bottom-0 left-0 w-full bg-white border-t shadow-lg rounded-t-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">
              {selectedItem.full_name || selectedItem.name}
            </h3>
            <button
              onClick={() => setSelectedItem(null)}
              className="text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
          </div>

          {photoUrls.length > 0 && (
            <div className="flex space-x-2 overflow-x-auto mb-3">
              {photoUrls.slice(0, 5).map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt="Фото"
                  className="h-24 w-32 object-cover rounded-lg border"
                />
              ))}
            </div>
          )}

          <button
            onClick={handleConfirm}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Подтвердить адрес
          </button>
        </div>
      )}
    </div>
  );
};

export default React.memo(AddressSearchMap2GIS);
