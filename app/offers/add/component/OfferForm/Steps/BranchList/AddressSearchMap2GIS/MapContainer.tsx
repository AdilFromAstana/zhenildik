"use client";
import React from "react";

const MapContainer: React.FC = () => {
    const { containerRef } = useMap();

    return (
        <div className="h-full rounded-lg overflow-hidden border border-gray-200"
            ref={containerRef}>
        </div >
    );
};

export default React.memo(MapContainer);
