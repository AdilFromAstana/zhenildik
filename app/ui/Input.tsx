"use client";

import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function Input({ className, error, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full border rounded-md px-3 py-2 text-gray-900 placeholder-gray-400 outline-none transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
        error
          ? "border-red-400 focus:ring-red-500 focus:border-red-500"
          : "border-gray-300",
        className
      )}
      {...props}
    />
  );
}
