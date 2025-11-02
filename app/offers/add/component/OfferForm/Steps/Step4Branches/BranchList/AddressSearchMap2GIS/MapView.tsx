"use client";
import React, { useEffect, useRef, useCallback, memo } from "react";
import { LocateFixed } from "lucide-react";
import { Branch } from "..";

type MapViewProps = {
  initialCoords?: [number, number];
  initialName?: string;
  selectedCoords?: [number, number] | null;
  selectedLabel?: string;
  api: any;
  isReady: boolean;
  map: any;
  containerRef: any;
  allBranches: Branch[]
};

// Функция валидации координат (для безопасности, как обсуждалось ранее)
const isValidCoordinates = (coords: any): coords is [number, number] => {
  if (!Array.isArray(coords) || coords.length !== 2) return false;
  const [lon, lat] = coords;
  return typeof lon === 'number' && isFinite(lon) && typeof lat === 'number' && isFinite(lat);
};


const MapView: React.FC<MapViewProps> = ({
  initialCoords,
  initialName,
  selectedCoords,
  selectedLabel,
  map,
  api,
  isReady,
  containerRef,
  allBranches
}) => {
  const branchMarkersRef = useRef<any[]>([]);
  const markerRef = useRef<any | null>(null);
  const locationMarkerRef = useRef<any | null>(null);

  // Функция для фокусировки на заданной точке
  const focusOn = useCallback(
    (coords: [number, number], labelText = "") => {
      if (!map || !api || !isValidCoordinates(coords)) return;
      if (markerRef.current) markerRef.current.destroy();

      markerRef.current = new api.Marker(map, {
        coordinates: coords,
        icon: "/branch-icon.svg",
        size: [20, 30],
      });

      map.setCenter(coords);
      map.setZoom(16);
    },
    [map, api]
  );

  // ----------------------------------------------------
  // НОВЫЫЙ ЭФФЕКТ: УПРАВЛЕНИЕ МАРКЕРАМИ ВСЕХ ФИЛИАЛОВ
  // ----------------------------------------------------
  useEffect(() => {
    if (!isReady || !map || !api) return;

    // 1. Удаляем все старые маркеры
    branchMarkersRef.current.forEach(marker => marker.destroy());
    branchMarkersRef.current = [];

    // 2. Создаем новые маркеры для каждого филиала
    const newMarkers = allBranches.map(branch => {
      // Проверяем валидность координат перед созданием маркера
      if (!branch.coords || !isValidCoordinates(branch.coords)) {
        console.error(`Филиал ${branch.name} имеет невалидные координаты.`);
        return null;
      }

      const marker = new api.Marker(map, {
        coordinates: branch.coords, // [lon, lat]
        icon: "/branch-icon.svg", // Иконка, как вы просили
        size: [20, 30],
        // Опционально: можно добавить всплывающее окно с именем
        // content: branch.name, 
      });
      return marker;
    }).filter(m => m !== null); // Фильтруем невалидные

    // 3. Сохраняем новые маркеры
    branchMarkersRef.current = newMarkers;

    // Функция очистки: вызывается при демонтаже или изменении зависимостей
    return () => {
      branchMarkersRef.current.forEach(marker => marker.destroy());
      branchMarkersRef.current = [];
    };

  }, [isReady, allBranches, map, api]); // Зависит от списка филиалов
  // ----------------------------------------------------

  // ----------------------------------------------------
  // НОВАЯ ЛОГИКА: АВТОМАТИЧЕСКОЕ ОТОБРАЖЕНИЕ МЕСТОПОЛОЖЕНИЯ
  // ----------------------------------------------------
  const showUserLocation = useCallback(() => {
    if (!map || !api || !navigator.geolocation) return;

    // Используем getCurrentPosition для получения точки только один раз
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [
          pos.coords.longitude,
          pos.coords.latitude,
        ];

        // Добавляем или обновляем маркер местоположения
        if (locationMarkerRef.current) {
          locationMarkerRef.current.setCoordinates(coords);
        } else {
          locationMarkerRef.current = new api.Marker(map, {
            coordinates: coords,
            icon: "/user-point.svg", // Маркер пользователя
            size: [24, 24],
          });
        }
        // ВАЖНО: Мы НЕ вызываем map.setCenter() и map.setZoom(),
        // чтобы не перебивать начальный фокус карты.
      },
      // Обработчик ошибки (используем console.error вместо alert)
      (error) => console.error("Не удалось определить местоположение для начального отображения:", error)
    );
  }, [map, api]);

  // ЭФФЕКТ ДЛЯ АВТОМАТИЧЕСКОГО ОТОБРАЖЕНИЯ
  useEffect(() => {
    if (isReady) {
      // Пытаемся показать местоположение юзера сразу после готовности карты
      showUserLocation();
    }
  }, [isReady, showUserLocation]);
  // ----------------------------------------------------

  // Эффект для начальной фокусировки (остается без изменений)
  useEffect(() => {
    if (isReady && isValidCoordinates(initialCoords)) focusOn(initialCoords, initialName);
  }, [isReady, initialCoords, initialName, focusOn]);

  // Эффект для фокусировки на выбранных координатах (остается без изменений)
  useEffect(() => {
    if (selectedCoords && isValidCoordinates(selectedCoords)) focusOn(selectedCoords, selectedLabel);
  }, [selectedCoords, selectedLabel, focusOn]);


  // ОБРАБОТЧИК КНОПКИ: Теперь кнопка центрирует карту на местоположении юзера
  const handleLocate = () => {
    if (!map || !api) return;

    if (!navigator.geolocation) {
      console.error("Геолокация не поддерживается вашим браузером.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [
          pos.coords.longitude,
          pos.coords.latitude,
        ];

        // Используем существующую функцию для отображения маркера
        if (locationMarkerRef.current) {
          locationMarkerRef.current.setCoordinates(coords);
        } else {
          locationMarkerRef.current = new api.Marker(map, {
            coordinates: coords,
            icon: "/user-point.svg",
            size: [24, 24],
          });
        }

        map.setCenter(coords);
        map.setZoom(15);
      },
      // Обработчик ошибки (используем console.error вместо alert)
      () => console.error("Не удалось определить местоположение.")
    );
  };

  return (
    <div className="relative h-full rounded-lg overflow-hidden border border-gray-200">
      <div ref={containerRef} className="absolute inset-0" />

      {/* Кнопка поверх карты */}
      <button
        onClick={handleLocate}
        disabled={!isReady} // Блокируем, пока карта не готова
        className="absolute bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 active:scale-95 transition flex items-center justify-center disabled:bg-gray-400"
        title="Моё местоположение"
        aria-label="Моё местоположение"
      >
        <LocateFixed className="w-6 h-6" />
      </button>
    </div>
  );
};

export default memo(MapView);