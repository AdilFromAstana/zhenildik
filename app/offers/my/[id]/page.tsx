"use client";

import OfferEditForm from "./component/OfferEditForm";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function OfferEditPage() {
  const router = useRouter();

  return (
    <div className="max-w-5xl mx-auto md:px-4 md:py-8 p-4">
      {/* Кнопка Назад */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 mb-4 text-gray-700 hover:text-gray-900 transition"
      >
        <ArrowLeft className="w-5 h-5" />
        Назад
      </button>

      <OfferEditForm />
    </div>
  );
}
