// src/app/components/FilterOverlay.tsx
'use client'; // Использует состояние и эффекты
import React, { useState, useMemo } from 'react';
import { FilterState } from '../types';
import { X, Tag, SlidersHorizontal, MapPin, Percent, Clock } from 'lucide-react';
import SelectFilter from './SelectFilter';
import { categories } from '../../app/data/mocks'; // Импортируем категории

interface FilterOverlayProps {
    currentFilters: FilterState;
    onApply: (filters: FilterState) => void;
    onClose: () => void;
}

// Определяем DEFAULT_FILTERS локально или импортируем
const DEFAULT_FILTERS: FilterState = {
    category: '', // Пустое означает "Все"
    city: 'Астана',
    discountType: 'Все',
    validity: 'Все'
};

const FilterOverlay: React.FC<FilterOverlayProps> = ({ currentFilters, onApply, onClose }) => {
    const [tempFilters, setTempFilters] = useState<FilterState>(currentFilters);

    const handleFilterChange = (key: keyof FilterState, value: string) => {
        setTempFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleApply = () => {
        onApply(tempFilters); // App component will handle closing via prop
    };

    const handleReset = () => {
        setTempFilters(DEFAULT_FILTERS);
    };

    const { applyFilters, mockDeals } = require('../data/mocks');
    const filteredDealsCount = useMemo(() => {
        return applyFilters(mockDeals, tempFilters);
    }, [tempFilters]);

    const activeFiltersCount = Object.entries(tempFilters).filter(([key, value]) => value !== 'Все' && value !== '' && !(key === 'city' && value === 'Астана')).length;

    return (
        <div className="fixed inset-0 bg-white z-[70] flex flex-col overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center shadow-sm z-10">
                <h2 className="text-2xl font-bold text-gray-800">Фильтры ({activeFiltersCount})</h2>
                <button onClick={onClose} className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition">
                    <X className="w-6 h-6" />
                </button>
            </div>
            <div className="flex-grow p-4 space-y-8 container mx-auto max-w-lg">
                <section>
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><Tag className="w-5 h-5 mr-2 text-orange-600" /> Категория</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {['Все', ...categories.map(c => c.name)].map(name => {
                            const Icon = categories.find(c => c.name === name)?.icon || Tag;
                            const isActive = tempFilters.category === name || (name === 'Все' && tempFilters.category === '');
                            return (
                                <button
                                    key={name}
                                    onClick={() => handleFilterChange('category', name === 'Все' ? '' : name)}
                                    className={`flex flex-col items-center justify-center p-3 text-sm rounded-xl transition duration-150 border-2
                                        ${isActive
                                            ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400'
                                        }`}
                                >
                                    <Icon className="w-6 h-6 mb-1" />
                                    <span className="font-medium text-center">{name}</span>
                                </button>
                            );
                        })}
                    </div>
                </section>
                <section className="grid grid-cols-1 gap-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center"><SlidersHorizontal className="w-5 h-5 mr-2 text-orange-600" /> Дополнительные параметры</h3>
                    <SelectFilter
                        label="Город / Район"
                        value={tempFilters.city}
                        options={['Астана']}
                        onChange={(val) => handleFilterChange('city', val)}
                        Icon={MapPin}
                    />
                    <SelectFilter
                        label="Тип скидки"
                        value={tempFilters.discountType}
                        options={['Все', 'Процент', 'ФиксированнаяСумма', 'Подарок']}
                        onChange={(val) => handleFilterChange('discountType', val)}
                        Icon={Percent}
                    />
                    <SelectFilter
                        label="Дата действия"
                        value={tempFilters.validity}
                        options={['Все', 'Сегодня', 'До конца недели', 'Весь месяц']}
                        onChange={(val) => handleFilterChange('validity', val)}
                        Icon={Clock}
                    />
                </section>
            </div>
            <div className="sticky bottom-0 bg-white p-4 border-t border-gray-200 shadow-2xl">
                <div className="container mx-auto max-w-lg flex gap-3">
                    <button
                        onClick={handleReset}
                        className="w-1/3 py-3 border border-gray-300 text-gray-700 rounded-xl font-bold transition hover:bg-gray-50"
                    >
                        Сбросить
                    </button>
                    <button
                        onClick={handleApply}
                        className="w-2/3 py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center transition hover:bg-blue-700 shadow-lg"
                    >
                        Применить ({filteredDealsCount.length})
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterOverlay;