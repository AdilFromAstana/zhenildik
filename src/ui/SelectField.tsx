"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/src/lib/utils";

export type SelectOption = {
  value: string;
  label: string | React.ReactNode;
  description?: string;
};

interface SelectFieldProps {
  label?: string | React.ReactNode;
  icon?: React.ReactNode;
  hint?: string; // подсказка под лейблом
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  onChange: (val: string) => void;
  showDescription?: boolean;
  required?: boolean;
}

export function SelectField({
  label,
  icon,
  hint,
  placeholder = "Выберите значение",
  options,
  value,
  onChange,
  showDescription = true,
  required = false,
}: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const selected = options.find((o) => o.value === value);

  // позиционирование выпадашки
  useEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [open]);

  // закрытие по клику вне
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const dropdown = (
    <div
      ref={dropdownRef}
      className={cn(
        "absolute z-[9999] mt-1 max-h-64 overflow-y-auto",
        "bg-white border border-gray-200 rounded-lg shadow-lg p-1 animate-fadeIn"
      )}
      style={{
        top: menuPosition.top,
        left: menuPosition.left,
        width: menuPosition.width,
      }}
    >
      {options.length > 0 ? (
        options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={cn(
              "w-full text-left px-3 py-2 text-sm rounded-md cursor-pointer transition-colors",
              "hover:bg-blue-50 focus:bg-blue-100 focus:outline-none",
              opt.value === value
                ? "bg-blue-50 text-blue-700 font-medium"
                : "text-gray-800"
            )}
            onClick={() => {
              onChange(opt.value);
              setOpen(false);
            }}
          >
            {opt.label}
          </button>
        ))
      ) : (
        <p className="text-sm text-gray-500 px-3 py-2">Нет доступных опций</p>
      )}
    </div>
  );

  return (
    <div className="space-y-2 relative">
      {/* Label */}
      {label && (
        <div className="flex flex-col">
          <label className="flex items-center text-sm font-medium text-gray-700 gap-2">
            {icon}
            <span className="flex items-center">
              {label}
              {required && (
                <span className="text-red-500 ml-0.5" title="Обязательное поле">
                  *
                </span>
              )}
            </span>
          </label>
          {hint && <p className="text-xs text-gray-500 mt-0.5">{hint}</p>}
        </div>
      )}

      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={cn(
          "w-full flex items-center justify-between",
          "bg-white border border-gray-300 rounded-lg",
          "text-left text-gray-900 px-3 py-2 text-sm font-medium",
          "shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        )}
      >
        <span className={cn(!selected && "text-gray-400")}>
          {selected ? selected.label : placeholder}
        </span>
        <svg
          className={cn(
            "w-4 h-4 ml-2 transition-transform",
            open && "rotate-180"
          )}
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M5 7l5 5 5-5"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && createPortal(dropdown, document.body)}

      {showDescription && selected?.description && (
        <p className="text-sm text-gray-600 mt-2">{selected.description}</p>
      )}
    </div>
  );
}
