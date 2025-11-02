"use client";
import React, { useState, useCallback, useRef } from "react";
import { Search } from "lucide-react";
import SearchResultList from "./SearchResultList";
import { Branch } from "../..";

const DGIS_API_KEY = "4dd7b86c-ee1e-42ea-8efa-da3f2eadfb7d";

type SearchInputContainerProps = {
  onSelectAddress: (item: Branch) => void;
};

const SearchInputContainer: React.FC<SearchInputContainerProps> = ({
  onSelectAddress,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = useCallback(async (query: string) => {
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
  }, []);

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setSearchQuery(val);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => handleSearch(val), 400);
    },
    [handleSearch]
  );

  const fetchItemDetails = async (id: string) => {
    const url = `https://catalog.api.2gis.com/3.0/items/byid?id=${id}&fields=items.point,items.geometry.centroid,items.full_name,items.name,items.address,items.adm_div&key=${DGIS_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    return data?.result?.items?.[0] ?? null;
  };

  const handleSelect = useCallback(
    async (item: Branch) => {
      console.log("item: ", item);
      let coords: [number, number] | null = null;
      let label = item?.name || "";

      if (item?.point?.lon && item?.point?.lat) {
        coords = [item.point.lon, item.point.lat];
      } else if (item?.id) {
        const details = await fetchItemDetails(item.id);
        if (details?.point) {
          coords = [details.point.lon, details.point.lat];
        } else if (details?.geometry?.centroid) {
          coords = [
            details.geometry.centroid.lon,
            details.geometry.centroid.lat,
          ];
        }
        label = details?.name || label;
      }

      if (!coords) return;

      setSearchQuery(label);
      setResults([]);
      setOpen(false);
      onSelectAddress(item);
    },
    [onSelectAddress]
  );

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        <input
          value={searchQuery}
          onChange={handleInput}
          placeholder="Введите адрес..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/90 backdrop-blur-sm border border-gray-300 shadow-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-gray-800 placeholder:text-gray-400 text-sm md:text-base"
        />
      </div>

      {open && results.length > 0 && (
        <SearchResultList results={results} onSelect={handleSelect} />
      )}
    </div>
  );
};

export default React.memo(SearchInputContainer);
