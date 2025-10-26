"use client";

import { useRouter } from "next/navigation";
import { Home } from "lucide-react";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
      <h1 className="text-5xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-lg text-gray-600 mb-8">
        Упс! Такой страницы не существует.
      </p>

      <button
        onClick={() => router.push("/")}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
      >
        <Home className="w-5 h-5" />
        На главную
      </button>
    </main>
  );
}
