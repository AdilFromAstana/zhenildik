export interface MapAPI {
    Map: any;
    Marker: any;
    // Добавьте другие типы из mapgl API по мере необходимости
}

export type MapInstance = any; // Замените на конкретный тип из mapgl, если он доступен
export type MarkerInstance = any;

// --- 1. Интерфейс для объекта внутри search_attributes.suggest_parts ---
export interface SuggestPart {
    is_suggested: boolean;
    text: string;
}

// --- 2. Интерфейс для объекта search_attributes ---
export interface SearchAttributes {
    handling_type: number;
    suggest_parts: SuggestPart[];
    suggested_text: string;
}

// --- 3. Интерфейс для отдельного элемента в массиве 'items' ---
export interface SuggestItem {
    // Общие поля для всех объектов
    id: string;
    name: string;
    type: 'branch' | 'station'; // Типы, которые я вижу в данных
    search_attributes: SearchAttributes;
    full_name?: string; // Присутствует не во всех
    address_name?: string; // Присутствует не во всех
    address_comment?: string; // Присутствует не во всех

    // Поля, специфичные для 'branch' (компании, магазины)
    building_name?: string;
    purpose_name?: string; // Назначение (например, 'Торговый центр')

    // Поля, специфичные для 'station' (остановки)
    route_type?: string; // 'bus'
    subtype?: string; // 'stop'
    coords?: [number, number]
}

// --- 1. Вложенные структуры: Компоненты Адреса ---
interface AddressComponent {
    number: string;
    street: string;
    street_id: string;
    type: string; // "street_number"
}

// --- 2. Вложенные структуры: Объект Адреса ---
interface Address {
    building_code: string;
    building_id: string;
    building_name: string; // "ТЦ Жаннур"
    components: AddressComponent[];
}

// --- 3. Вложенные структуры: Флаги Административного Деления ---
interface AdmDivFlags {
    is_default: boolean;
    is_region_center: boolean;
}

// --- 4. Вложенные структуры: Элемент Административного Деления ---
interface AdmDivItem {
    id: string;
    name: string; // "Казахстан", "Астана", "Байконыр район"
    type: string; // "country", "region", "city", "district"
    city_alias?: string; // Присутствует в объекте "city"
    flags?: AdmDivFlags; // Присутствует в объекте "city"
    is_default?: boolean; // Присутствует в объекте "city"
}

// --- 5. Вложенные структуры: Геометрия и Точка ---
interface Geometry {
    centroid: string; // "POINT(71.440425 51.169364)"
}

interface Point {
    lat: number; // 51.169364
    lon: number; // 71.440425
}

// --- 6. Главный интерфейс для Объекта ---
export interface ByIdItem {
    address: Address;
    address_comment: string; // "1-4 этаж"
    address_name: string; // "проспект Абая, 48"
    adm_div: AdmDivItem[];
    building_name: string; // "Жаннур, торговый центр"
    full_name: string; // "Астана, Жаннур, торговый центр"
    geometry: Geometry;
    id: string;
    name: string; // "Жаннұр, торговый центр"
    point: Point;
    purpose_name: string; // "Торговый центр"
    type: string; // "branch"
}