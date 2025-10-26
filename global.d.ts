export {};

declare global {
  interface Window {
    ymaps?: any;
  }

  // 🔹 Описание базового namespace для TS
  namespace ymaps {
    class Map {
      constructor(elementId: string, options?: any);
      setCenter(center: number[]): void;
      getBounds(): [number[], number[]];
      getZoom(): number;
      geoObjects: {
        add: (obj: any) => void;
        remove: (obj: any) => void;
      };
      behaviors: {
        enable: (name: string) => void;
        disable: (name: string) => void;
      };
      container: { getElement: () => HTMLElement };
      events: {
        add: (name: string, cb: (...args: any[]) => void) => void;
        remove: (name: string, cb: (...args: any[]) => void) => void;
      };
      destroy(): void;
    }

    class Polygon {
      constructor(coords: number[][][], data?: any, options?: any);
      geometry: {
        contains: (coords: number[]) => boolean;
      };
    }

    class Polyline {
      constructor(coords: number[][], data?: any, options?: any);
      geometry: {
        setCoordinates: (coords: number[][]) => void;
      };
    }

    class ObjectManager {
      constructor(options?: any);
      add: (data: any) => void;
      remove: (id: any) => void;
      objects: any;
      clusters: any;
    }
  }

  var ymaps: typeof ymaps;
}
