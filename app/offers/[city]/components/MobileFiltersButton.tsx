"use client";

import { Filter } from "lucide-react";

export default function MobileFiltersButton() {
  return (
    <button
      onClick={() => document.dispatchEvent(new CustomEvent("openFilters"))}
      className="md:hidden bg-blue-600 text-white p-2 rounded-md"
    >
      <Filter className="w-6 h-6"/>
    </button>
  );
}
