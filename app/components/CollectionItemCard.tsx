// src/app/components/CollectionItemCard.tsx
import React from 'react';
import { CollectionItem } from '../types';

interface CollectionItemCardProps {
    item: CollectionItem;
    onDetailClick: (itemId: number) => void;
}

const CollectionItemCard: React.FC<CollectionItemCardProps> = ({ item, onDetailClick }) => (
    <div
        className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer flex flex-col h-full"
        onClick={() => onDetailClick(item.id)}
    >
        <div className="h-28 bg-gray-100 relative">
            <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover"
                onError={(e: any) => e.target.src = `https://placehold.co/300x200/9CA3AF/ffffff?text=Товар+из+подборки`}
            />
        </div>
        <div className="p-3 flex-grow">
            <h4 className="font-semibold text-gray-800 line-clamp-1 text-sm">{item.title}</h4>
            <p className="text-xs text-gray-500 line-clamp-2 mt-1">{item.description}</p>
        </div>
    </div>
);

export default CollectionItemCard;