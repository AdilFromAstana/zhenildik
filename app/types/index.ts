// src/app/types/index.ts
export interface Deal {
    id: number;
    title: string;
    description: string;
    category: 'Еда' | 'Красота' | 'Медицина' | 'Одежда' | 'Спорт' | 'Техника' | 'Развлечения';
    discountType: 'Процент' | 'ФиксированнаяСумма' | 'Подарок';
    discountValue: string;
    establishment: string;
    tag: 'ТОП' | 'Новая' | null;
    distance: string;
    city: 'Алматы' | 'Астана' | 'Шымкент' | 'Атырау' | 'Караганда';
    area: string;
    imageUrl: string;
    validUntil: string;
    conditions: string;
    contact: { phone: string; website: string; address: string; hours: string; rating: number; reviews: number };
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

export type Page = 'HOME' | 'CATALOG' | 'DEAL_DETAIL' | 'BUSINESS_FORM';