"use client";

import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export function Button({
  className,
  disabled,
  loading,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300",
        disabled || loading
          ? "bg-blue-400 text-white cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-500 text-white",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
