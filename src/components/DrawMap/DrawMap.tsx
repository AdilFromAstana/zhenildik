"use client";
import React, { useState } from "react";
import MapContainer from "./MapContainer";
import { PolygonInstance } from "@/types";

export interface Location {
  id: string;
  offerId: number;
  title: string;
  latitude: number;
  longitude: number;
  address: string;
  categoryId: number;
}

interface DrawMapProps {
  locations: Location[];
  userCoords: [number, number] | null;
}

const DrawMap: React.FC<DrawMapProps> = ({ locations, userCoords }) => {
  const [filtered, setFiltered] = useState<any[]>([]);
  const [polygon, setPolygon] = useState<PolygonInstance | null>(null);

  return (
    <div className="flex gap-4 flex-1 h-[75vh]">
      <MapContainer
        userCoords={userCoords}
        locations={locations}
        setFiltered={setFiltered}
        polygon={polygon}
        setPolygon={setPolygon}
      />
    </div>
  );
};

export default DrawMap;
