"use client";
import React, { useState, useCallback } from "react";
import MapView from "./MapView";
import SearchInputContainer from "./SearchInputContainer";
import SelectedItemCard from "./SelectedItemCard";
import { Branch } from "..";

type AddressSearchMapProps = {
  onAddressSelect: (item: Branch) => void;
  initialCoords?: [number, number];
  initialName?: string;
};

const AddressSearchMap2GIS: React.FC<AddressSearchMapProps> = ({
  onAddressSelect,
  initialCoords,
  initialName,
}) => {
  const [selected, setSelected] = useState<any>(null);

  const handleAddressPicked = useCallback((item: any) => {
    setSelected(item);
  }, []);

  return (
    <div className="w-full h-full relative">
      <SearchInputContainer onSelectAddress={handleAddressPicked} />
      <MapView
        initialCoords={initialCoords}
        initialName={initialName}
        selectedCoords={selected?.coords}
        selectedLabel={selected?.label}
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
