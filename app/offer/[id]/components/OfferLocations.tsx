"use client";

import { useEffect, useMemo, useState } from "react";
import {
  MapPin,
  Phone,
  Clock,
  Map,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Offer } from "app/offers/my/page";

type Props = {
  offer: Offer;
  initialVisible?: number; // сколько адресов видно на мобиле (по умолчанию 1)
};

export default function OfferLocations({ offer, initialVisible = 1 }: Props) {
  const all = offer.locations || [];
  const [expanded, setExpanded] = useState(false);

  // На >= md показываем все адреса сразу
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = () => setExpanded(mq.matches);
    handler();
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  const visible = useMemo(() => {
    if (expanded) return all;
    return all.slice(0, Math.max(0, initialVisible));
  }, [expanded, all, initialVisible]);

  if (all.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-3 text-gray-900">
          Где действует акция
        </h2>
        <p className="text-sm text-gray-500">
          Адреса не указаны. Уточните у партнёра.
        </p>
      </div>
    );
  }

  const restCount = Math.max(0, all.length - visible.length);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-gray-900">
          Где действует акция
        </h2>
        <span className="text-xs text-gray-500">{all.length} адрес(ов)</span>
      </div>

      <ul className="divide-y divide-gray-100">
        {visible.map((loc) => (
          <li key={loc.id} className="py-3">
            <div className="flex flex-col gap-1">
              {/* Название точки */}
              <div className="text-base font-semibold text-gray-900">
                {loc.name || "Точка продаж"}
              </div>

              {/* Адрес */}
              <div className="flex items-start text-sm text-gray-700">
                <MapPin className="w-4 h-4 text-primary-orange mr-2 mt-0.5 flex-shrink-0" />
                <span>{loc.fullAddress || "Адрес не указан"}</span>
              </div>

              {/* Телефон */}
              {loc.phone && (
                <div className="flex items-center text-sm text-gray-700">
                  <Phone className="w-4 h-4 text-primary-orange mr-2 flex-shrink-0" />
                  <a
                    href={`tel:${loc.phone}`}
                    className="text-blue-600 hover:underline"
                  >
                    {loc.phone}
                  </a>
                </div>
              )}

              {/* Часы работы */}
              {loc.workingHours && (
                <div className="flex items-start text-sm text-gray-700">
                  <Clock className="w-4 h-4 text-primary-orange mr-2 mt-0.5 flex-shrink-0" />
                  <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-0.5">
                    {Object.entries(loc.workingHours).map(([day, hours]) => (
                      <li key={day} className="text-xs text-gray-600">
                        <span className="font-medium text-gray-800">
                          {translateDay(day)}:
                        </span>{" "}
                        {hours.open}–{hours.close}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Ссылки на карты */}
              {loc.latitude != null && loc.longitude != null && (
                <div className="mt-2 flex flex-wrap gap-3 text-xs font-medium">
                  <a
                    href={`https://yandex.kz/maps/?ll=${loc.longitude}%2C${loc.latitude}&z=16`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:underline"
                  >
                    <Map className="w-3.5 h-3.5 mr-1 text-primary-orange" />
                    Яндекс Карты
                  </a>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${loc.latitude},${loc.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:underline"
                  >
                    <Map className="w-3.5 h-3.5 mr-1 text-primary-orange" />
                    Google Maps
                  </a>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* Кнопка раскрытия (только если есть скрытые адреса на мобиле) */}
      {restCount > 0 && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-3 inline-flex items-center text-sm font-semibold text-blue-600 hover:underline md:hidden"
          aria-expanded={expanded}
        >
          Показать ещё {restCount}{" "}
          {pluralize(restCount, ["адрес", "адреса", "адресов"])}
          <ChevronDown className="w-4 h-4 ml-1" />
        </button>
      )}

      {/* Кнопка сворачивания (мобила/планшет) */}
      {expanded && all.length > initialVisible && (
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="mt-3 inline-flex items-center text-sm font-semibold text-blue-600 hover:underline md:hidden"
          aria-expanded={expanded}
        >
          Свернуть
          <ChevronUp className="w-4 h-4 ml-1" />
        </button>
      )}
    </div>
  );
}

function translateDay(day: string): string {
  const map: Record<string, string> = {
    monday: "Пн",
    tuesday: "Вт",
    wednesday: "Ср",
    thursday: "Чт",
    friday: "Пт",
    saturday: "Сб",
    sunday: "Вс",
  };
  return map[day] || day;
}

function pluralize(n: number, forms: [string, string, string]) {
  const abs = Math.abs(n) % 100;
  const n1 = abs % 10;
  if (abs > 10 && abs < 20) return forms[2];
  if (n1 > 1 && n1 < 5) return forms[1];
  if (n1 === 1) return forms[0];
  return forms[2];
}
