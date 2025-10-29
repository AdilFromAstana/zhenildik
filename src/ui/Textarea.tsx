"use client";

import { cn } from "@/src/lib/utils";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export function Textarea({ className, error, ...props }: TextareaProps) {
  return (
    <textarea
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
