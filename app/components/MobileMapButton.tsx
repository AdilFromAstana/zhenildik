// src/app/components/MobileMapButton.tsx
'use client'; // Использует состояние и эффекты
import React from 'react';
import { MapPin } from 'lucide-react';

interface MobileMapButtonProps {
    onClick: () => void;
}

const MobileMapButton: React.FC<MobileMapButtonProps> = ({ onClick }) => (
    <button
        onClick={onClick}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 md:hidden bg-blue-600 text-white px-6 py-3 rounded-full shadow-xl flex items-center space-x-2 transition duration-300 hover:bg-blue-700 z-50"
    >
        <MapPin className="w-5 h-5 mr-2" />
        <span>На карте</span>
    </button>
);

export default MobileMapButton;