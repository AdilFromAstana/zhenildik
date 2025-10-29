"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/ui/Modal";

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

  const currentCityName =
    cities.find((c) => c.slug === currentCity)?.name || currentCity;

  const handleSelect = (slug: string) => {
    router.push(`/offers/${slug}`);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-blue-600 font-semibold hover:text-blue-800 transition text-2xl"
      >
        {currentCityName}
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Выберите город"
      >
        <div className="space-y-1">
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
      </Modal>
    </>
  );
}
