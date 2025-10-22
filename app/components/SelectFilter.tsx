// src/app/components/SelectFilter.tsx
import React from 'react';

interface SelectFilterProps {
    label: string;
    value: string;
    options: string[];
    onChange: (val: string) => void;
    Icon: React.ElementType;
}

const SelectFilter: React.FC<SelectFilterProps> = ({ label, value, options, onChange, Icon }) => (
    <div className="flex flex-col">
        <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center">
            <Icon className="w-4 h-4 mr-2 text-blue-500" />
            {label}
        </label>
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="p-3 border border-gray-300 rounded-xl text-base bg-white focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
        >
            {options.map(option => (
                <option key={option} value={option}>{option}</option>
            ))}
        </select>
    </div>
);

export default SelectFilter;