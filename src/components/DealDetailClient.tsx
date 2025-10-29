'use client';

import React from "react";
import { ChevronLeft, Star, Calendar, Clock, MapPin, HandCoins, Phone, Globe } from "lucide-react";
import { Deal } from "../types";
import DealCard from "./DealCard";
import { mockDeals } from "../../app/data/mocks";

interface DealDetailClientProps {
    deal: Deal;
}

const DealDetailClient: React.FC<DealDetailClientProps> = ({ deal }) => {
    const similarDeals = mockDeals
        .filter((d) => d.category === deal.category && d.id !== deal.id)
        .slice(0, 3);

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-6 max-w-4xl">
                <button
                    onClick={() => history.back()}
                    className="flex items-center text-blue-600 hover:text-blue-700 mb-6 font-medium transition"
                >
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    Назад
                </button>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="h-64 sm:h-80 bg-gray-100 relative">
                        <img
                            src={deal.imageUrl}
                            alt={deal.title}
                            className="w-full h-full object-cover"
                            onError={(e: any) =>
                            (e.target.src =
                                "https://placehold.co/800x320/3B82F6/ffffff?text=Баннер+акции")
                            }
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-end p-6">
                            <span className="text-white text-4xl font-extrabold bg-orange-600 px-3 py-1 rounded-lg">
                                {deal.discountValue}
                                {deal.discountType === "Процент" && "%"}
                            </span>
                        </div>
                    </div>

                    <div className="p-6">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            {deal.title}
                        </h1>
                        <p className="text-xl text-orange-600 font-semibold mb-4">
                            {deal.establishment}
                        </p>

                        <div className="flex items-center text-sm text-gray-600 mb-4 border-b pb-4">
                            <div className="flex items-center mr-4">
                                <Star className="w-5 h-5 fill-yellow-400 stroke-yellow-500 mr-1" />
                                <span className="font-bold text-gray-800">
                                    {deal.contact.rating}
                                </span>
                                <span className="ml-1 text-gray-500">
                                    ({deal.contact.reviews} отзывов)
                                </span>
                            </div>
                            <p className="flex items-center text-blue-600 font-medium">
                                <MapPin className="w-4 h-4 mr-1" />
                                {deal.distance}
                            </p>
                        </div>

                        <h2 className="text-2xl font-semibold text-gray-700 mt-4 mb-2">
                            Описание и условия
                        </h2>
                        <p className="text-gray-600 mb-6">{deal.description}</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            <InfoBox
                                Icon={Calendar}
                                title="Срок действия"
                                value={`До ${deal.validUntil}`}
                                color="green"
                            />
                            <InfoBox
                                Icon={Clock}
                                title="График работы"
                                value={deal.contact.hours}
                                color="blue"
                            />
                            <InfoBox
                                Icon={MapPin}
                                title="Адрес"
                                value={deal.contact.address}
                                color="gray"
                            />
                            <InfoBox
                                Icon={HandCoins}
                                title="Ограничения"
                                value={deal.conditions}
                                color="red"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 mb-8 border-t pt-6">
                            <a
                                href={`tel:${deal.contact.phone}`}
                                className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold flex items-center justify-center transition hover:bg-green-700 shadow-md"
                            >
                                <Phone className="w-5 h-5 mr-2" />
                                Позвонить
                            </a>
                            <a
                                href={deal.contact.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 border border-blue-600 text-blue-600 py-3 rounded-xl font-bold flex items-center justify-center transition hover:bg-blue-50 shadow-md"
                            >
                                <Globe className="w-5 h-5 mr-2" />
                                Сайт
                            </a>
                        </div>
                    </div>
                </div>

                {similarDeals.length > 0 && (
                    <section className="mt-10">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            Похожие акции
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {similarDeals.map((deal) => (
                                <DealCard key={deal.id} deal={deal} onDetailClick={() => { }} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

const InfoBox = ({
    Icon,
    title,
    value,
    color,
}: {
    Icon: React.ElementType;
    title: string;
    value: string;
    color: "green" | "blue" | "red" | "gray";
}) => {
    const colorMap = {
        green: "bg-green-100 text-green-700",
        blue: "bg-blue-100 text-blue-700",
        red: "bg-red-100 text-red-700",
        gray: "bg-gray-100 text-gray-700",
    };
    return (
        <div className={`p-4 rounded-xl ${colorMap[color]}`}>
            <div className="flex items-center mb-1">
                <Icon className="w-5 h-5 mr-2" />
                <p className="font-semibold text-sm">{title}</p>
            </div>
            <p className="text-base font-medium">{value}</p>
        </div>
    );
};

export default DealDetailClient;
