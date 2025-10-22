'use client';

import React, { useEffect } from 'react';
import { X, Home, Map, Briefcase, User, LogOut } from 'lucide-react';
import { Page } from '../types';

interface MobileSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    isAuthenticated: boolean;
    userRole: 'user' | 'business' | null;
    onLogout: () => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({
    isOpen,
    onClose,
    isAuthenticated,
    userRole,
    onLogout,
}) => {
    // Блокируем скролл при открытии
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Меню для всех
    const publicItems = [
        { id: 'HOME', label: 'Главная', icon: Home },
        { id: 'CATALOG', label: 'Каталог', icon: Map },
    ];

    // Меню для бизнеса
    const businessItems = [
        { id: 'MY_OFFERS', label: 'Мои акции', icon: Briefcase },
        { id: 'CREATE_OFFER', label: 'Создать акцию', icon: Briefcase },
    ];

    // Для обычного юзера
    const userItems = [
        { id: 'FAVORITES', label: 'Избранное', icon: User },
    ];

    // Общие
    const authItem = isAuthenticated
        ? { id: 'LOGOUT', label: 'Выйти', icon: LogOut }
        : { id: 'LOGIN', label: 'Войти', icon: User };

    return (
        <div
            className={`fixed inset-0 z-[100] transition-all duration-300 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'
                }`}
        >
            {/* затемнённый фон */}
            <div
                className={`fixed inset-0 bg-black transition-opacity duration-300 ${isOpen ? 'opacity-50' : 'opacity-0'
                    }`}
                onClick={onClose}
            ></div>

            {/* панель */}
            <div
                className={`fixed top-0 right-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Меню</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition"
                        aria-label="Закрыть меню"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="py-4">
                    <ul>
                        {/* Общие */}
                        {publicItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <li key={item.id}>
                                    <button
                                        onClick={() => {
                                            onClose();
                                        }}
                                        className="w-full text-left px-6 py-3 flex items-center space-x-3 text-gray-700 hover:bg-gray-100 transition duration-150"
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span>{item.label}</span>
                                    </button>
                                </li>
                            );
                        })}

                        {/* Если авторизован */}
                        {isAuthenticated && (
                            <>
                                {(userRole === 'business' ? businessItems : userItems).map(
                                    (item) => {
                                        const Icon = item.icon;
                                        return (
                                            <li key={item.id}>
                                                <button
                                                    onClick={() => {
                                                        onClose();
                                                    }}
                                                    className="w-full text-left px-6 py-3 flex items-center space-x-3 text-gray-700 hover:bg-gray-100 transition duration-150"
                                                >
                                                    <Icon className="w-5 h-5" />
                                                    <span>{item.label}</span>
                                                </button>
                                            </li>
                                        );
                                    }
                                )}
                            </>
                        )}

                        {/* Вход / выход */}
                        <li>
                            <button
                                onClick={() => {
                                    if (isAuthenticated) {
                                        onLogout();
                                    } else {
                                    }
                                    onClose();
                                }}
                                className="w-full text-left px-6 py-3 flex items-center space-x-3 text-gray-700 hover:bg-gray-100 transition duration-150"
                            >
                                <authItem.icon className="w-5 h-5" />
                                <span>{authItem.label}</span>
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default MobileSidebar;
