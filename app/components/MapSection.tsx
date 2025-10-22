// src/app/components/MapSection.tsx
'use client'; // Важно: этот компонент использует браузерные API

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Deal } from '../types';
import { Loader2, AlertTriangle, RotateCw } from 'lucide-react';

// Объявляем глобальную переменную L для Leaflet, которая будет доступна через скрипт
declare const L: any;

interface MapSectionProps {
    deals: Deal[];
    onDetailClick: (deal: Deal) => void;
    isOverlay?: boolean;
    mapKey: number; // Для принудительной перерисовки
}

const MapSection: React.FC<MapSectionProps> = ({ deals, onDetailClick, isOverlay = false, mapKey }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const [isLeafletLoaded, setIsLeafletLoaded] = useState(false); // Инициализируем как false
    const [isLoading, setIsLoading] = useState(true);
    const [errorDetails, setErrorDetails] = useState<string | null>(null);

    const LEAFLET_JS_URL = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    const LEAFLET_CSS_URL = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";

    const cleanupLeafletElements = () => {
        document.body.querySelector(`script[src="${LEAFLET_JS_URL}"]`)?.remove();
        document.head.querySelector(`link[href="${LEAFLET_CSS_URL}"]`)?.remove();
    };

    const loadLeafletScript = useCallback(() => {
        setIsLoading(true);
        setErrorDetails(null);
        cleanupLeafletElements();

        // Проверяем, загружен ли уже Leaflet
        if (typeof L !== 'undefined' && typeof L.map === 'function') {
            setIsLeafletLoaded(true);
            setIsLoading(false);
            return;
        }

        // Загружаем CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = LEAFLET_CSS_URL;
        link.integrity = "sha256-p4NxAo9T/6jV3l880nS5gX9lF146W40/x5R44qF4Q4w="; // Укажите реальный integrity hash, если используете
        link.crossOrigin = "";
        document.head.appendChild(link);

        // Загружаем JS
        const script = document.createElement('script');
        script.src = LEAFLET_JS_URL;
        script.integrity = "sha256-oBMO7tU09J+jV3l880nS5gX9lF146W40/x5R44qF4Q4w="; // Укажите реальный integrity hash, если используете
        script.crossOrigin = "";
        script.async = true;
        script.onload = () => {
            if (typeof L !== 'undefined' && typeof L.map === 'function') {
                setIsLeafletLoaded(true);
                setIsLoading(false);
                setErrorDetails(null);
                console.log("Leaflet JS успешно загружен и инициализирован.");
            } else {
                const msg = "Leaflet: Скрипт загружен, но функция L.map не найдена. Возможно, произошла внутренняя ошибка инициализации.";
                setErrorDetails(msg);
                setIsLoading(false);
                console.error(msg);
            }
        };
        script.onerror = () => {
            const msg = `Ошибка сети при загрузке скрипта Leaflet с ${LEAFLET_JS_URL}. Проверьте подключение или блокировщики контента.`;
            setErrorDetails(msg);
            setIsLoading(false);
            console.error(msg);
        };
        document.body.appendChild(script);
    }, []);

    useEffect(() => {
        if (isLeafletLoaded) return;
        loadLeafletScript();

        return () => {
            cleanupLeafletElements();
        };
    }, [isLeafletLoaded, loadLeafletScript, mapKey]);

    useEffect(() => {
        if (!isLeafletLoaded || !mapContainerRef.current) {
            return;
        }

        if (typeof L === 'undefined' || typeof L.map !== 'function') {
            const msg = "Leaflet загружен, но L.map недоступен. Попытка реинициализации...";
            setErrorDetails(msg);
            setIsLoading(false);
            return;
        }

        let map = mapInstanceRef.current;

        try {
            if (!map) {
                // Используем координаты Астаны
                const initialLat = 51.169392;
                const initialLon = 71.449074;
                map = L.map(mapContainerRef.current).setView([initialLat, initialLon], 13);
                mapInstanceRef.current = map;

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
                    maxZoom: 19,
                }).addTo(map);

                console.log("Leaflet карта инициализирована.");
            }

            // Обновляем размер карты (полезно при изменении размера контейнера)
            setTimeout(() => {
                if (mapInstanceRef.current) {
                    mapInstanceRef.current.invalidateSize();
                }
            }, 300);

            // Удаляем старые маркеры
            map.eachLayer((layer: any) => {
                if (layer instanceof L.Marker) {
                    map.removeLayer(layer);
                }
            });

            // Добавляем маркеры для сделок
            deals.forEach(deal => {
                const marker = L.marker([deal.lat, deal.lon]).addTo(map);
                const popupContent = `
          <div class="font-sans text-gray-800">
            <p class="font-bold text-base mb-1">${deal.title}</p>
            <p class="text-sm text-orange-600 font-semibold">${deal.establishment}</p>
            <p class="text-xs text-gray-500">${deal.discountValue}</p>
            <button id="deal-${deal.id}" class="mt-2 text-sm text-blue-600 hover:underline">Подробнее</button>
          </div>
        `;
                marker.bindPopup(popupContent, { minWidth: 200 });

                marker.on('popupopen', () => {
                    const button = document.getElementById(`deal-${deal.id}`);
                    if (button) {
                        button.onclick = () => onDetailClick(deal);
                    }
                });
            });

            // Подгоняем вид под маркеры
            if (deals.length > 0) {
                const bounds = L.latLngBounds(deals.map((d: Deal) => [d.lat, d.lon]));
                map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
            } else {
                map.setView([51.169392, 71.449074], 13); // Центр по умолчанию
            }

            setIsLoading(false);
        } catch (error: any) {
            const message = `Внутренняя ошибка Leaflet: ${error.message || 'Неизвестная ошибка инициализации. Проверьте консоль.'}`;
            console.error("Критическая ошибка Leaflet:", error);
            setErrorDetails(message);
            setIsLoading(false);
        }

        // Очистка при размонтировании
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [deals, onDetailClick, isLeafletLoaded, mapKey]); // Добавляем mapKey как зависимость для пересоздания карты

    return (
        <div key={mapKey} className={`w-full ${isOverlay ? 'flex-grow h-full' : 'h-96'} bg-gray-200 rounded-xl shadow-lg relative overflow-hidden`}>
            {isLoading && !errorDetails && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50/70 z-10 transition-opacity duration-300">
                    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-xl">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                        <p className="mt-3 text-gray-600 font-medium">Загрузка карты...</p>
                    </div>
                </div>
            )}
            {errorDetails && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-50/90 z-10 transition-opacity duration-300">
                    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-xl border border-red-300 max-w-sm mx-auto">
                        <AlertTriangle className="w-8 h-8 text-red-600" />
                        <p className="mt-3 text-red-600 font-semibold text-center text-lg">Ошибка загрузки карты</p>
                        <p className="text-sm text-gray-700 mt-2 text-center break-words">
                            <strong>Подробности:</strong> {errorDetails}
                        </p>
                        <button
                            onClick={loadLeafletScript}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center"
                        >
                            <RotateCw className="w-4 h-4 mr-2" />
                            Повторить попытку загрузки
                        </button>
                        <p className="text-xs text-gray-500 mt-3 text-center italic">
                            (Проверьте подключение или блокировщики контента.)
                        </p>
                    </div>
                </div>
            )}
            <div ref={mapContainerRef} id="leaflet-map-container" style={{ width: '100%', height: '100%' }} />
        </div>
    );
};

export default MapSection;