// src/app/components/AllDealsCatalog.tsx
'use client'; // Использует состояние, эффекты, коллбэки
import React, { useState, useEffect, useCallback, useMemo, SetStateAction } from 'react';
import { Deal, FilterState, Page } from '../types';
import DealCard from './DealCard';
import { SlidersHorizontal, X, Loader2 } from 'lucide-react';
import { categories, applyFilters, mockDeals, DEALS_PER_PAGE } from '../data/mocks';
import MapSection from './MapSection'; // Убедитесь, что путь правильный
import dynamic from 'next/dynamic'; // Используем динамический импорт для компонентов, зависящих от браузера

// Динамический импорт для компонентов, зависящих от браузера
const MobileMapButton = dynamic(() => import('./MobileMapButton'), { ssr: false });
const MapOverlay = dynamic(() => import('./MapOverlay'), { ssr: false });

interface AllDealsCatalogProps {
    onDetailClick: (deal: Deal) => void;
    filters: FilterState;
    setFilters: React.Dispatch<SetStateAction<FilterState>>;
    onOpenFilters: () => void;
    onNavigate: (page: Page, deal?: Deal) => void; // Добавляем для перехода к деталям
}

const AllDealsCatalog: React.FC<AllDealsCatalogProps> = ({ onDetailClick, filters, setFilters, onOpenFilters, onNavigate }) => {
    const [showMapOverlay, setShowMapOverlay] = useState(false);
    const [allFilteredDeals, setAllFilteredDeals] = useState<Deal[]>([]);
    const [displayedDeals, setDisplayedDeals] = useState<Deal[]>([]);
    const [page, setPage] = useState(1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [mapRenderKey, setMapRenderKey] = useState(0);

    useEffect(() => {
        // Гарантируем, что город установлен корректно (моковые данные только для Астаны)
        if (filters.city !== 'Астана') {
            setFilters(prev => ({ ...prev, city: 'Астана' }));
        }
        const filtered = applyFilters(mockDeals, filters);
        setAllFilteredDeals(filtered);
        setPage(1);
        setDisplayedDeals(filtered.slice(0, DEALS_PER_PAGE));
        setHasMore(filtered.length > DEALS_PER_PAGE);
        setIsLoadingMore(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [filters, setFilters]); // Срабатывает при изменении фильтров

    const loadMoreDeals = useCallback(() => {
        if (isLoadingMore || !hasMore) return;
        setIsLoadingMore(true);
        setTimeout(() => {
            setPage(prevPage => {
                const nextPage = prevPage + 1;
                const start = prevPage * DEALS_PER_PAGE;
                const end = nextPage * DEALS_PER_PAGE;
                const newDealsBatch = allFilteredDeals.slice(start, end);
                setDisplayedDeals(prevDeals => {
                    const currentIds = new Set(prevDeals.map(d => d.id));
                    const uniqueNewDeals = newDealsBatch.filter(d => !currentIds.has(d.id));
                    const newTotalDeals = prevDeals.length + uniqueNewDeals.length;
                    setHasMore(newTotalDeals < allFilteredDeals.length);
                    setIsLoadingMore(false);
                    return [...prevDeals, ...uniqueNewDeals];
                });
                return nextPage;
            });
        }, 500);
    }, [isLoadingMore, hasMore, allFilteredDeals]);

    useEffect(() => {
        const handleScroll = () => {
            const isAtBottom = window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 500;
            if (isAtBottom && !isLoadingMore && hasMore) {
                loadMoreDeals();
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isLoadingMore, hasMore, loadMoreDeals]);

    const activeFilters = useMemo(() => Object.entries(filters).filter(([key, value]) => value !== 'Все' && value !== '' && !(key === 'city' && value === 'Астана')), [filters]);

    const handleFilterChange = (key: keyof FilterState, value: string) => {
        setFilters({ ...filters, [key]: value });
    };

    const clearFilter = (key: keyof FilterState) => {
        if (key === 'city') {
            setFilters({ ...filters, city: 'Астана' });
        } else if (key === 'category') {
            setFilters({ ...filters, category: '' });
        }
        else {
            setFilters({ ...filters, [key]: 'Все' });
        }
    };

    const openMapOverlay = () => {
        setMapRenderKey(prev => prev + 1);
        setShowMapOverlay(true);
    };

    const closeMapOverlay = () => {
        setMapRenderKey(prev => prev + 1);
        setShowMapOverlay(false);
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <main className="container mx-auto px-4 py-6">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-6 border-b pb-2">Каталог Всех Акций</h1>
                <section className="mb-6">
                    <div className="text-lg font-bold mb-3 text-gray-700">Категории</div>
                    <div className="flex space-x-3 overflow-x-scroll pb-2 scrollbar-hide">
                        {['Все', ...categories.map(c => c.name)].map(name => {
                            const Icon = categories.find(c => c.name === name)?.icon || (props => <span {...props}>#</span>);
                            const isActive = filters.category === name || (name === 'Все' && filters.category === '');
                            return (
                                <button
                                    key={name}
                                    onClick={() => handleFilterChange('category', name === 'Все' ? '' : name)}
                                    className={`flex items-center justify-center flex-shrink-0 px-4 py-2 text-sm rounded-full transition duration-150 border
                    ${isActive
                                            ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                                            : 'bg-white text-gray-600 border-gray-300 hover:bg-blue-50 hover:border-blue-400'
                                        }`}
                                >
                                    <Icon className="w-4 h-4 mr-1" />
                                    {name}
                                </button>
                            );
                        })}
                    </div>
                </section>
                <section className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex-1">
                            {activeFilters.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    <span className="font-medium text-sm text-gray-600 mr-1">Активные:</span>
                                    {activeFilters.map(([key, value]) => (
                                        <div key={key} className="flex items-center bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
                                            {key === 'city' ? 'Город' : key === 'discountType' ? 'Скидка' : key === 'validity' ? 'Срок' : value}: {value}
                                            <button onClick={() => clearFilter(key as keyof FilterState)} className="ml-1.5 p-0.5 hover:text-blue-900">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button
                            onClick={onOpenFilters}
                            className="flex items-center text-blue-600 font-medium text-sm hover:text-blue-700 transition lg:hidden"
                        >
                            <SlidersHorizontal className="w-4 h-4 mr-1" />
                            Доп. фильтры
                        </button>
                    </div>
                </section>
                <section className="mb-10 hidden md:block">
                    <h2 className="text-xl font-bold mb-3 text-gray-800">Акции на карте (Астана)</h2>
                    <MapSection deals={displayedDeals} onDetailClick={onDetailClick} mapKey={0} />
                </section>
                <section className="mb-12">
                    <div className="text-xl font-bold mb-4 text-gray-800">
                        Найдено {allFilteredDeals.length} акций в Астане
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {displayedDeals.length > 0 ? (
                            displayedDeals.map(deal => (
                                <DealCard key={deal.id} deal={deal} onDetailClick={onDetailClick} />
                            ))
                        ) : (
                            <p className="col-span-full text-center text-gray-500 py-10">
                                По вашим фильтрам акций не найдено. Попробуйте изменить критерии поиска.
                            </p>
                        )}
                    </div>
                    {isLoadingMore && (
                        <div className="col-span-full text-center py-6">
                            <Loader2 className="w-8 h-8 mx-auto text-blue-600 animate-spin" />
                            <p className="text-sm text-gray-500 mt-2">Загружаем больше акций...</p>
                        </div>
                    )}
                    {!hasMore && allFilteredDeals.length > 0 && (
                        <div className="col-span-full text-center py-6">
                            <p className="text-gray-500 font-medium">Вы достигли конца списка акций ({allFilteredDeals.length} шт.).</p>
                        </div>
                    )}
                </section>
            </main>
            <MobileMapButton onClick={openMapOverlay} />
            {showMapOverlay && (
                <MapOverlay onClose={closeMapOverlay}>
                    <MapSection deals={allFilteredDeals} onDetailClick={onDetailClick} isOverlay={true} mapKey={mapRenderKey} />
                </MapOverlay>
            )}
        </div>
    );
};

export default AllDealsCatalog;