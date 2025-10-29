"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
    // Блокируем прокрутку при открытии модалки
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const modalContent = (
        <div
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            {/* Основное содержимое модалки — останавливаем всплытие кликов */}
            <div
                className="relative w-[90svw] h-[70vh] bg-white rounded-none sm:rounded-2xl shadow-xl flex flex-col p-6 rounded-xl"
                onClick={(e) => e.stopPropagation()} // ← вот это ключевое
            >
                {/* Кнопка закрытия */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Закрыть"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Заголовок */}
                {title && (
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        {title}
                    </h2>
                )}

                {/* Контент */}
                <div className="flex-1 overflow-y-auto">{children}</div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}