// src/app/components/CuratedCollections.tsx
import React from 'react';
import { CuratedCollection } from '../types';
import CollectionItemCard from './CollectionItemCard';

interface CuratedCollectionsProps {
    collections: CuratedCollection[];
    onDetailClick: (itemId: number) => void;
}

const CuratedCollections: React.FC<CuratedCollectionsProps> = ({ collections, onDetailClick }) => {
    return (
        <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-5">✨ Интересные подборки</h2>
            <div className="space-y-4">
                {collections.map(collection => (
                    <div key={collection.id} className="bg-white rounded-xl shadow-md border border-gray-100 sm:mx-4">
                        <div className="px-4 pt-4">
                            <h3 className="text-xl font-bold text-gray-800 border-b pb-2">{collection.title}</h3>
                        </div>
                        <div className="flex overflow-x-scroll snap-x snap-mandatory space-x-4 py-4 pl-4 scrollbar-hide">
                            {collection.items.map(item => (
                                <div
                                    key={item.id}
                                    className="flex-shrink-0 w-[70vw] sm:w-1/3 md:w-1/4 lg:w-1/5 snap-start"
                                >
                                    <CollectionItemCard item={item} onDetailClick={onDetailClick} />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default CuratedCollections;