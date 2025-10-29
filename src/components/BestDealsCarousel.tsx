// src/app/components/BestDealsCarousel.tsx
'use client'; // Использует состояние и рефы
import React, { useState, useRef } from 'react';
import { Deal } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BestDealsCarouselProps {
    deals: Deal[];
    onDetailClick: (deal: Deal) => void;
}

const BestDealsCarousel: React.FC<BestDealsCarouselProps> = ({ deals, onDetailClick }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const scrollTo = (index: number) => {
        if (!containerRef.current) return;
        const cardElement = containerRef.current.children[0] as HTMLElement;
        if (!cardElement) return;
        const isMobile = window.innerWidth < 640;
        const cardWidth = isMobile ? window.innerWidth * 0.8 : cardElement.clientWidth;
        const gap = parseInt(window.getComputedStyle(containerRef.current).gap || '0');
        const scrollPosition = index * (cardWidth + (isMobile ? 12 : gap));
        containerRef.current.scrollTo({
            left: scrollPosition,
            behavior: 'smooth',
        });
        setCurrentIndex(index);
    };

    const nextSlide = () => {
        const nextIndex = (currentIndex + 1) % deals.length;
        scrollTo(nextIndex);
    };

    const prevSlide = () => {
        const prevIndex = (currentIndex - 1 + deals.length) % deals.length;
        scrollTo(prevIndex);
    };

    if (deals.length === 0) return null;

    return (
        <section className="mb-10 relative">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🔥 Топ Предложения Сегодня</h2>
            <div className="relative">
                <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg z-10 hidden lg:block hover:bg-gray-100 transition"
                    aria-label="Предыдущее"
                >
                    <ChevronLeft className="w-6 h-6 text-gray-700" />
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg z-10 hidden lg:block hover:bg-gray-100 transition"
                    aria-label="Следующее"
                >
                    <ChevronRight className="w-6 h-6 text-gray-700" />
                </button>
                <div
                    ref={containerRef}
                    className="flex overflow-x-scroll snap-x snap-mandatory space-x-3 pb-4 pl-4 scrollbar-hide"
                >
                    {deals.map((deal, index) => (
                        <div
                            key={deal.id}
                            className="flex-shrink-0 w-[80vw] sm:w-1/2 md:w-1/3 lg:w-1/4 snap-start cursor-pointer"
                            onClick={() => onDetailClick(deal)}
                        >
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl">
                                <div className="h-48 relative">
                                    <img
                                        src={deal.imageUrl}
                                        alt={deal.title}
                                        className="w-full h-full object-cover"
                                        onError={(e: any) => e.target.src = `https://placehold.co/600x400/3B82F6/ffffff?text=Баннер+акции`}
                                    />
                                    <div className="absolute top-0 right-0 p-3">
                                        <span className="bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full">{deal.discountValue}</span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <p className="text-xs text-gray-500 line-clamp-1">{deal.establishment}</p>
                                    <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{deal.title}</h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center space-x-2 mt-2">
                    {deals.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => scrollTo(index)}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentIndex === index ? 'bg-blue-600 w-6' : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                            aria-label={`Перейти к слайду ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BestDealsCarousel;