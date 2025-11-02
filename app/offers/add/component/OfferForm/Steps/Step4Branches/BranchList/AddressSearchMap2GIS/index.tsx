"use client";
import React, { useState, useCallback, useRef, useMemo, useEffect } from "react";
import MapView from "./MapView";
import SearchInputContainer from "./SearchInputContainer";
import SelectedItemCard from "./SelectedItemCard";
import { Branch } from "..";
import { load } from "@2gis/mapgl";

const DGIS_API_KEY = "4dd7b86c-ee1e-42ea-8efa-da3f2eadfb7d";

type AddressSearchMapProps = {
  onAddressSelect: (item: Branch) => void;
  initialCoords?: [number, number];
  initialName?: string;
  allBranches: Branch[]; // <--- НОВЫЙ ПРОПС
};

const AddressSearchMap2GIS: React.FC<AddressSearchMapProps> = ({
  onAddressSelect,
  initialCoords,
  initialName,
  allBranches
}) => {
  const [selected, setSelected] = useState<any>(null);

  const handleAddressPicked = useCallback((item: any) => {
    setSelected(item);
  }, []);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<any | null>(null);
  const [api, setApi] = useState<any | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let destroyed = false;
    let mapInstance: any;

    load().then((loadedApi) => {
      if (destroyed || !containerRef.current) return;

      mapInstance = new loadedApi.Map(containerRef.current, {
        center: [71.4304, 51.1282],
        zoom: 16,
        key: DGIS_API_KEY,
        zoomControl: "centerRight",
      });

      setApi(loadedApi);
      setMap(mapInstance);
      mapInstance.once("idle", () => !destroyed && setIsReady(true));
    });

    return () => {
      destroyed = true;
      try {
        mapInstance?.destroy();
      } catch { }
    };
  }, []);

  return (
    <div className="w-full h-full relative">
      <SearchInputContainer onSelectAddress={handleAddressPicked} />
      <MapView
        initialCoords={initialCoords}
        initialName={initialName}
        selectedCoords={selected?.coords}
        selectedLabel={selected?.label}
        isReady={isReady}
        api={api}
        map={map}
        containerRef={containerRef}
        allBranches={allBranches}
      />
      <SelectedItemCard
        selectedItem={selected}
        onClose={() => setSelected(null)}
        onConfirm={() => onAddressSelect(selected)}
      />
    </div>
  );
};

export default React.memo(AddressSearchMap2GIS);
