"use client";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

interface CitySelectorProps {
  currentCity: string; // здесь slug, например "astana"
  cities: { id: number; name: string; slug: string }[];
}

export default function CitySelector({
  currentCity,
  cities,
}: CitySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // ✅ Находим название города по slug
  const currentCityName = useMemo(() => {
    const city = cities.find((c) => c.slug === currentCity);
    return city ? city.name : currentCity; // fallback, если slug неизвестен
  }, [currentCity, cities]);

  const handleSelect = (citySlug: string) => {
    router.push(`/all-deals/${citySlug}`);
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Кнопка открытия */}
      <button
        onClick={() => setIsOpen(true)}
        className="text-blue-600 font-semibold hover:text-blue-800 transition flex items-center gap-1 text-2xl p-0 m-0"
      >
        {currentCityName}
      </button>

      {/* Overlay */}
      {isOpen && (
        <>
          {/* Затемнение фона */}
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fadeIn"
          />

          {/* Модальное окно */}
          <div className="fixed inset-0 z-50 flex items-center justify-center animate-fadeIn">
            <div className="bg-white w-[90%] max-w-md rounded-2xl shadow-2xl p-6 relative">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Выберите город
              </h2>

              <div className="max-h-[80svh] overflow-y-auto space-y-1">
                {cities.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => handleSelect(city.slug)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition ${
                      city.slug === currentCity
                        ? "bg-blue-600 text-white font-semibold"
                        : "hover:bg-blue-50 text-gray-800"
                    }`}
                  >
                    {city.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
