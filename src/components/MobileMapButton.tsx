// src/app/components/MobileMapButton.tsx
"use client"; // Использует состояние и эффекты
import React from "react";
import { MapPin } from "lucide-react";

interface MobileMapButtonProps {
  onClick: () => void;
}

const MobileMapButton: React.FC<MobileMapButtonProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="fixed bottom-4 right-4 md:hidden bg-blue-600 text-white rounded-full shadow-xl flex items-center space-x-2 transition duration-300 hover:bg-blue-700 z-50 p-4"
  >
    <MapPin className="w-5 h-5" />
  </button>
);

export default MobileMapButton;
