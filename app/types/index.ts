// src/app/types/index.ts
export interface Deal {
  id: number;
  title: string;
  description: string;
  category:
    | "Еда"
    | "Красота"
    | "Медицина"
    | "Одежда"
    | "Спорт"
    | "Техника"
    | "Развлечения";
  discountType: "Процент" | "ФиксированнаяСумма" | "Подарок";
  discountValue: string;
  establishment: string;
  tag: "ТОП" | "Новая" | null;
  distance: string;
  city: "Алматы" | "Астана" | "Шымкент" | "Атырау" | "Караганда";
  area: string;
  imageUrl: string;
  validUntil: string;
  conditions: string;
  contact: {
    phone: string;
    website: string;
    address: string;
    hours: string;
    rating: number;
    reviews: number;
  };
  lat: number;
  lon: number;
}

export interface FilterState {
  category: string;
  city: string;
  discountType: string;
  validity: string;
}

export interface CollectionItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

export interface CuratedCollection {
  id: number;
  title: string;
  items: CollectionItem[];
}

export type Page = "HOME" | "CATALOG" | "DEAL_DETAIL" | "BUSINESS_FORM";

export interface MapInstance extends ymaps.Map {}
export interface PolygonInstance extends ymaps.Polygon {}
export interface PolylineInstance extends ymaps.Polyline {}

export interface DrawMapProps {
  estates: any[];
}

export interface MapContainerProps {
  estates: any[];
  setFiltered: (list: any[]) => void;
  polygon: PolygonInstance | null;
  setPolygon: (poly: PolygonInstance | null) => void;
}

export interface MapControlsProps {
  map: MapInstance | null;
  polygon: PolygonInstance | null;
  setPolygon: (p: PolygonInstance | null) => void;
  polyline: PolylineInstance | null;
  setPolyline: (l: PolylineInstance | null) => void;
  estates: any[];
  setFiltered: (list: any[]) => void;
  isDrawing: boolean;
  setIsDrawing: (v: boolean) => void;
}

export interface DrawingToolProps {
  map: MapInstance | null;
  ymaps: typeof ymaps | null;
  isDrawing: boolean;
  estates: any[];
  polygon: PolygonInstance | null;
  setPolygon: (poly: PolygonInstance | null) => void;
  setFiltered: (list: any[]) => void;
}

export interface PropertyListProps {
  filtered: any[];
  polygon: PolygonInstance | null;
}

export interface UseMapClustersProps {
  map: MapInstance | null;
  estates: any[];
  polygon: PolygonInstance | null;
  setFiltered: (list: any[]) => void;
}
