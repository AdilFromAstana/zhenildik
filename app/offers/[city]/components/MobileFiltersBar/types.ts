export interface OfferFilters {
  search?: string;
  cityCode?: string;
  categoryId?: number | string;
  discountType?: string;
  validity?: string;
  priceMin?: number | null;
  priceMax?: number | null;
  discountMin?: number | null;
  discountMax?: number | null;
  sortBy?: "createdAt" | "discountPercent" | "newPrice" | "title";
  sortOrder?: "ASC" | "DESC";
  dishType?: string;
  cuisine?: string;
  deal?: string;
  protein?: string;
  technique?: string;
  mealType?: string;
}

export interface MobileFiltersBarProps {
  categories: { id: number; name: string }[];
  defaultFilters: OfferFilters;
  onApply: (filters: OfferFilters) => void;
  citySlug: string;
}
