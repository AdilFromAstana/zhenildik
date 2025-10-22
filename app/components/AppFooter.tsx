// src/app/components/AppFooter.tsx
import React from 'react';

const AppFooter: React.FC = () => (
    <footer className="bg-gray-800 text-white mt-12">
        <div className="container mx-auto px-4 py-8 text-center text-sm md:flex md:justify-around md:text-left">
            <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-bold mb-2 text-blue-400">iAkcii</h3>
                <p className="text-gray-400">Лучшие скидки и акции Казахстана.</p>
            </div>
            <div className="space-y-2">
                <h4 className="font-semibold mb-1">Компания</h4>
                <ul className="space-y-1">
                    <li><a href="#" className="text-gray-300 hover:text-blue-400 transition">О нас</a></li>
                    <li><a href="#" className="text-gray-300 hover:text-blue-400 transition">Контакты</a></li>
                    <li><a href="#" className="text-gray-300 hover:text-blue-400 transition">Пользовательское соглашение</a></li>
                </ul>
            </div>
            <div className="mt-4 md:mt-0 space-y-2">
                <h4 className="font-semibold mb-1">Партнёрам</h4>
                <ul className="space-y-1">
                    {/* Убираем кнопку из футера, она в заголовке и в меню */}
                    <li><a href="#" className="text-gray-300 hover:text-blue-400 transition">Партнёрская программа</a></li>
                </ul>
            </div>
        </div>
        <div className="text-center text-gray-500 py-4 border-t border-gray-700 text-xs">
            &copy; {new Date().getFullYear()} iAkcii. Все права защищены.
        </div>
    </footer>
);

export default AppFooter;