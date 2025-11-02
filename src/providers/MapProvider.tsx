"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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

export const MapProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<any | null>(null);
  const [api, setApi] = useState<any | null>(null);
  const [isReady, setIsReady] = useState(false);

  const value = useMemo(
    () => ({ map, api, isReady, containerRef }),
    [map, api, isReady]
  );

  useEffect(() => {
    let destroyed = false;
    let mapInstance: any;

    load().then((loadedApi) => {
      if (destroyed || !containerRef.current) return;

      mapInstance = new loadedApi.Map(containerRef.current, {
        center: [71.4304, 51.1282],
        zoom: 13,
        key: DGIS_API_KEY,
        zoomControl: "centerRight",
      });

      setApi(loadedApi);
      setMap(mapInstance);
      mapInstance.once("idle", () => {
        mapInstance.removeIcon('custom');
        mapInstance.addIcon("custom", {
          url: "https://media.istockphoto.com/id/1272693590/vector/red-pinpoint-symbol.jpg?s=612x612&w=0&k=20&c=xE3xh5Xd4vmMj5v4t_LMs6K4l7bDZhmjhMYoniR8sKM=",
        });
        !destroyed && setIsReady(true);
      });
    });

    return () => {
      destroyed = true;
      try {
        mapInstance?.destroy();
      } catch {}
    };
  }, []);

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
};
