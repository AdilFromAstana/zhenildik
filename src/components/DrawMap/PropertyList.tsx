"use client";
import { PropertyListProps } from "@/src/types";
import React from "react";

const PropertyList: React.FC<PropertyListProps> = ({ filtered, polygon }) => {
  return (
    <div className="w-1/3 h-full border rounded-md p-3 overflow-y-auto">
      <h2 className="font-semibold mb-2">
        {polygon
          ? `Дома в области: ${filtered.length}`
          : `Видимые на карте: ${filtered.length}`}
      </h2>

      {filtered.length === 0 ? (
        <p className="text-gray-500">Нет домов в текущей области</p>
      ) : (
        filtered.map((e) => (
          <div key={e.id} className="py-2 border-b">
            <strong>{e.title}</strong>
            <p className="text-sm text-gray-500">
              {e.latitude}, {e.longitude}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default PropertyList;
