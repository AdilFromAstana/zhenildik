// src/app/components/FormFields.tsx
import React from 'react';

interface InputFieldProps {
    label: string;
    name: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    required?: boolean;
}

export const InputField: React.FC<InputFieldProps> = (props) => (
    <div>
        <label htmlFor={props.name} className="block text-sm font-medium text-gray-700 mb-1">{props.label}{props.required && <span className="text-red-500">*</span>}</label>
        <input
            id={props.name}
            name={props.name}
            type={props.type || 'text'}
            value={props.value}
            onChange={props.onChange}
            placeholder={props.placeholder}
            required={props.required}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
        />
    </div>
);

interface TextareaFieldProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    required?: boolean;
}

export const TextareaField: React.FC<TextareaFieldProps> = (props) => (
    <div>
        <label htmlFor={props.name} className="block text-sm font-medium text-gray-700 mb-1">{props.label}{props.required && <span className="text-red-500">*</span>}</label>
        <textarea
            id={props.name}
            name={props.name}
            rows={4}
            value={props.value}
            onChange={props.onChange}
            placeholder={props.placeholder}
            required={props.required}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition resize-none"
        />
    </div>
);

interface SelectFieldProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: string[];
    required?: boolean;
}

export const SelectField: React.FC<SelectFieldProps> = (props) => (
    <div>
        <label htmlFor={props.name} className="block text-sm font-medium text-gray-700 mb-1">{props.label}{props.required && <span className="text-red-500">*</span>}</label>
        <select
            id={props.name}
            name={props.name}
            value={props.value}
            onChange={props.onChange}
            required={props.required}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition bg-white"
        >
            <option value="" disabled>Выберите категорию</option>
            {props.options.map(option => (
                <option key={option} value={option}>{option}</option>
            ))}
        </select>
    </div>
);