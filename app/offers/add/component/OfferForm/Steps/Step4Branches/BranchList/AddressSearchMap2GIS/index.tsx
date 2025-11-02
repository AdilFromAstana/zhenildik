"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import SearchInput from "./SearchInput";
import SelectedItemCard from "./SelectedItemCard";
import { useMap } from "@/providers/MapProvider";

const DGIS_API_KEY = "4dd7b86c-ee1e-42ea-8efa-da3f2eadfb7d";

type AddressSearchMapProps = {
  onAddressSelect: (coords: [number, number], address: string) => void;
  initialCoords?: [number, number];
  initialName?: string;
};

const AddressSearchMap2GIS: React.FC<AddressSearchMapProps> = ({
  onAddressSelect,
  initialCoords,
  initialName,
}) => {
  const { map, api, isReady, containerRef } = useMap();
  console.log("api: ", api)
  console.log("map: ", map)
  console.log("isReady: ", isReady)
  console.log("containerRef: ", containerRef)

  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const markerRef = useRef<any | null>(null);
  const prevCoordsRef = useRef<[number, number] | undefined>(undefined);
  const hasInitialFocusRef = useRef(false);

  const focusOn = useCallback(
    (coords: [number, number], labelText = "") => {
      if (!map || !api) return;

      if (markerRef.current) {
        markerRef.current.destroy();
        markerRef.current = null;
      }

      markerRef.current = new api.Marker(map, {
        coordinates: coords,
        icon: {
          url: "https://docs.2gis.com/img/marker.png",
          size: [32, 48],
          anchor: [16, 48],
        },
        label: labelText ? { text: labelText } : undefined,
      });

      map.setCenter(coords);
      map.setZoom(16);
    },
    [map, api]
  );

  /** --- Инициализация позиции --- **/
  useEffect(() => {
    if (!isReady || !api || !map) return;

    const prevCoords = prevCoordsRef.current;
    if (!initialCoords) return;

    const coordsChanged =
      !prevCoords ||
      prevCoords[0] !== initialCoords[0] ||
      prevCoords[1] !== initialCoords[1];

    if (coordsChanged) {
      focusOn(initialCoords, initialName || "Филиал");
      prevCoordsRef.current = initialCoords;
      hasInitialFocusRef.current = true;
    }
  }, [isReady, api, map, initialCoords, initialName, focusOn]);

  /** --- Поиск --- **/
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

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => handleSearch(val), 400);
  };

  /** --- Детали объекта --- **/
  const fetchItemDetails = async (id: string) => {
    const url = `https://catalog.api.2gis.com/3.0/items/byid?id=${id}&fields=items.point,items.geometry.centroid,items.full_name,items.name&key=${DGIS_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    return data?.result?.items?.[0] ?? null;
  };

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
      <SearchInput
        searchQuery={searchQuery}
        onInput={handleInput}
        results={results}
        open={open}
        onSelect={handleSelect}
      />
      <div className="h-full rounded-lg overflow-hidden border border-gray-200"
        ref={containerRef}>
      </div>
      <SelectedItemCard
        selectedItem={selectedItem}
        onClose={() => setSelectedItem(null)}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export default React.memo(AddressSearchMap2GIS);
