// src/app/components/MapOverlay.tsx
'use client'; // Использует состояние и эффекты
import React from 'react';
import { X } from 'lucide-react';

interface MapOverlayProps {
    children: React.ReactNode;
    onClose: () => void;
}

const MapOverlay: React.FC<MapOverlayProps> = ({ children, onClose }) => (
    <div className="fixed inset-0 bg-white z-[60] p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Карта Акций</h2>
            <button onClick={onClose} className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                <X className="w-6 h-6" />
            </button>
        </div>
        <div className="flex-grow min-h-0">
            {children}
        </div>
    </div>
);

export default MapOverlay;