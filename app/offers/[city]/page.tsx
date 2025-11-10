import { cookies } from "next/headers";
import { Metadata } from "next";
import CitySelector from "./components/CitySelector";
import FiltersBar from "./components/FiltersBar";
import ClientOffersPage from "./components/ClientOffersPage";
import MobileFiltersButton from "./components/MobileFiltersButton";
import { fetchCities } from "@/utils/fetchCities";

export const revalidate = 3600;

interface Props {
  params: Promise<{ city: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { city } = await params;
  const { page } = await searchParams;
  const pageNum = Number(page || 1);

  const cities = await fetchCities();
  const cityData = cities.find((c: any) => c.slug === city);
  const cityName = cityData ? cityData.name : city;
  const canonical = `https://skidka-bar.kz/offers/${city}`;

  return {
    title: `Скидки и акции ${cityName} | Skidka-Bar.kz`,
    description: `Лучшие скидки и акции в ${cityName}.`,
    alternates: { canonical },
    robots: pageNum > 1 ? { index: false, follow: true } : undefined,
  };
}

export default async function AllOffersByCityPage({ params, searchParams }: Props) {
  const { city } = await params;
  const { page } = await searchParams;
  const pageNum = Number(page || 1);
  const limit = 20;

  const cookieStore = await cookies();
  const filtersCookie = cookieStore.get("offersFilters")?.value;
  const filters = filtersCookie ? JSON.parse(decodeURIComponent(filtersCookie)) : {};

  const apiParams = new URLSearchParams({
    cityCode: city,
    page: String(pageNum),
    limit: String(limit),
  });

  const keys = [
    "search", "categoryId", "discountType", "priceMin", "priceMax",
    "discountMin", "discountMax", "sortBy", "sortOrder",
    "dishType", "cuisine", "deal", "protein", "technique", "mealType",
  ];
  keys.forEach((k) => {
    if (filters[k]) apiParams.set(k, filters[k]);
  });

  const [categoriesRes, cities, offersRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, { next: { revalidate: 3600 } }),
    fetchCities(),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/offers?${apiParams.toString()}`, {
      next: { revalidate: 60 },
    }),
  ]);

  const categories = await categoriesRes.json();
  const { data: offers = [], total } = await offersRes.json();
  const totalPages = Math.ceil(total / limit);
  console.log("cities: ", cities)
  const cityData = cities.find((c: any) => c.slug === city);
  const cityName = cityData ? cityData.name : city;

  const defaultFilters = { ...filters, city, cityName };

  return (
    <div className="container mx-auto px-4 py-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-800">Скидки и акции</h1>
          <CitySelector currentCity={city} cities={cities} />
        </div>
        <MobileFiltersButton />
      </div>

      <FiltersBar defaultFilters={defaultFilters} categories={categories} />

      <ClientOffersPage
        total={total}
        totalPages={totalPages}
        currentPage={pageNum}
        categories={categories}
        citySlug={city}
        cityName={cityName}
        defaultFilters={defaultFilters}
        initialOffers={offers}
      />
    </div>
  );
}
