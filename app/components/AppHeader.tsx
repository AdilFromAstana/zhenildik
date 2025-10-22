"use cleint"
// src/app/components/AppHeader.tsx
import React from 'react';
import { Search, SlidersHorizontal, Menu } from 'lucide-react'; // Убрали User, добавили Menu

interface AppHeaderProps {
    onOpenMobileMenu: () => void; // Новый пропс для открытия бокового меню
}

const AppHeader: React.FC<AppHeaderProps> = ({ onOpenMobileMenu }) => (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <h1
                className="text-2xl font-extrabold text-blue-600 cursor-pointer"
            >
                <span className="text-orange-600">i</span>Akcii
            </h1>
            <nav className="hidden sm:flex space-x-4">
                <button className="text-gray-600 hover:text-blue-600 font-medium transition">
                    Главная
                </button>
                <button className="text-gray-600 hover:text-blue-600 font-medium transition">
                    Все акции
                </button>
            </nav>
            <div className="flex-1 max-w-lg hidden md:flex">
                <input
                    type="text"
                    placeholder="Что вы ищете? — стрижка, обед, скидка..."
                    className="w-full p-2.5 pl-4 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-gray-700 text-sm"
                />
                <button className="ml-[-40px] z-10 p-2 text-gray-500 hover:text-blue-600 transition">
                    <Search className="w-5 h-5" />
                </button>
            </div>
            <div className="flex items-center space-x-3">
                <button className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full transition" onClick={onOpenMobileMenu} aria-label="Меню">
                    <Menu className="w-6 h-6" />
                </button>
                {/* {isCatalogPage && (
                    <button
                        onClick={onOpenFilters}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition border border-transparent hover:border-blue-300"
                        aria-label="Фильтры"
                    >
                        <SlidersHorizontal className="w-6 h-6" />
                    </button>
                )} */}
            </div>
        </div>
    </header>
);

export default AppHeader;