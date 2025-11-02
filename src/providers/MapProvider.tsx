"use client";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { load } from "@2gis/mapgl";

const DGIS_API_KEY = "4dd7b86c-ee1e-42ea-8efa-da3f2eadfb7d";

type MapContextType = {
    map: any | null;
    api: any | null;
    isReady: boolean;
    containerRef: React.RefObject<HTMLDivElement | null>;
};

const MapContext = createContext<MapContextType | null>(null);

export const useMap = () => {
    const ctx = useContext(MapContext);
    if (!ctx) throw new Error("useMap must be used within MapProvider");
    return ctx;
};

export const MapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [map, setMap] = useState<any | null>(null);
    const [api, setApi] = useState<any | null>(null);
    const [isReady, setIsReady] = useState(false);

    // Загрузка SDK заранее
    useEffect(() => {
        let isMounted = true;
        load().then((loadedApi) => {
            if (isMounted) setApi(loadedApi);
        });
        return () => {
            isMounted = false;
        };
    }, []);

    // Инициализация карты — только когда появился контейнер и API
    useEffect(() => {
        if (!api || !containerRef.current) return;
        const mapInstance = new api.Map(containerRef.current, {
            center: [71.4304, 51.1282],
            zoom: 12,
            key: DGIS_API_KEY,
        });
        setMap(mapInstance);
        mapInstance.once("idle", () => setIsReady(true));

        return () => mapInstance.destroy();
    }, [api, containerRef.current]);

    return (
        <MapContext.Provider value={{ map, api, isReady, containerRef }}>
            {children}
        </MapContext.Provider>
    );
};
