"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="absolute top-4 left-4 z-10 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm"
    >
      <ArrowLeft className="h-4 w-4" />
    </button>
  );
}
