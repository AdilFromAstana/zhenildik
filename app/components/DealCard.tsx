// src/app/components/DealCard.tsx
import React from 'react';
import { Deal } from '../types';
import { MapPin } from 'lucide-react';

interface DealCardProps {
    deal: Deal;
    onDetailClick: (deal: Deal) => void;
}

const DealCard: React.FC<DealCardProps> = ({ deal, onDetailClick }) => (
    <div
        className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer flex flex-col"
        onClick={() => onDetailClick(deal)}
    >
        <div className="relative h-40 bg-gray-100">
            <img
                src={deal.imageUrl}
                alt={deal.title}
                className="w-full h-full object-cover"
                onError={(e: any) => e.target.src = `https://placehold.co/600x400/3B82F6/ffffff?text=Фото+акции`}
            />
            {deal.tag && (
                <span className={`absolute top-2 left-2 px-3 py-1 text-xs font-bold rounded-full
            ${deal.tag === 'ТОП' ? 'bg-red-600 text-white' : 'bg-green-500 text-white'}`}
                >
                    {deal.tag}
                </span>
            )}
        </div>
        <div className="p-4 flex-grow flex flex-col justify-between">
            <div className="mb-2">
                <p className="text-sm text-gray-500 line-clamp-1">{deal.establishment}</p>
                <h3 className="font-semibold text-gray-800 text-lg line-clamp-2">{deal.title}</h3>
            </div>
            <div className="flex items-end justify-between mt-auto">
                <p className="text-2xl font-bold text-orange-600">
                    {deal.discountValue}
                    {deal.discountType === 'Процент' && <span className="text-xl">%</span>}
                </p>
                <div className="flex items-center text-sm text-gray-500 ml-2">
                    <MapPin className="w-4 h-4 mr-1 text-blue-500" />
                    {deal.distance}
                </div>
            </div>
        </div>
    </div>
);

export default DealCard;