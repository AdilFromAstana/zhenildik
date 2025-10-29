"use client";

import { CheckCircle2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Modal from "@/ui/Modal";
import { fetchCities } from "@/utils/fetchCities";

export type City = {
    id: number;
    name: string;
    slug: string;
};

interface CitySelectorModalProps {
    open: boolean;
    onClose: () => void;
    onSelect: (city: City) => void;
    selectedCityCode?: string | null;
}

export default function CitySelectorModal({
    open,
    onClose,
    onSelect,
    selectedCityCode,
}: CitySelectorModalProps) {
    const {
        data: cities = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["cities"],
        queryFn: fetchCities,
        staleTime: 1000 * 60 * 60, // 1 час
        gcTime: 1000 * 60 * 60 * 24, // хранить в кэше 24 часа
        enabled: open, // запрос выполняется только при открытии
    });

    return (
        <Modal isOpen={open} onClose={onClose} title="Выбор города">
            {isLoading ? (
                <div className="text-center text-gray-500 py-6 text-sm">
                    Загрузка...
                </div>
            ) : isError ? (
                <div className="text-center text-red-500 py-6 text-sm">
                    Ошибка при загрузке городов
                </div>
            ) : cities.length > 0 ? (
                <div className="flex flex-col gap-1">
                    {cities.map((city: any) => {
                        const isSelected = city.slug === selectedCityCode;
                        return (
                            <button
                                key={city.code}
                                onClick={() => {
                                    onSelect(city);
                                    onClose();
                                }}
                                className={`flex justify-between items-center px-3 py-2 rounded-lg transition ${isSelected
                                    ? "bg-blue-100 border border-blue-300 text-blue-700"
                                    : "hover:bg-gray-100"
                                    }`}
                            >
                                <span>{city.name}</span>
                                {isSelected && (
                                    <CheckCircle2 size={16} className="text-blue-500" />
                                )}
                            </button>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center text-gray-500 py-6 text-sm">
                    Нет доступных городов
                </div>
            )}
        </Modal>
    );
}
