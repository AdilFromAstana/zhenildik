import { Metadata } from "next";
import CitySelector from "./components/CitySelector";
import FiltersBar from "./components/FiltersBar";
import ClientOffersPage from "./components/ClientOffersPage";
import MobileFiltersButton from "./components/MobileFiltersButton";
import { fetchCities } from "@/utils/fetchCities";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  const citySlug = decodeURIComponent(city);
  const cities = await fetchCities();
  const cityData = cities.find((c: any) => c.slug === citySlug);
  const cityName = cityData ? cityData.name : citySlug;

  return {
    title: `Скидки и акции ${cityName} | iAkcii.kz`,
    description: `Лучшие скидки, акции и распродажи в ${cityName}. Найдите актуальные предложения, скидки на еду, красоту, одежду, технику и многое другое.`,
    keywords: `скидки ${cityName}, акции ${cityName}, распродажи ${cityName}, купоны ${cityName}, скидки iAkcii`,
  };
}

export default async function AllOffersByCityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  const decodedCity = decodeURIComponent(city);

  const [categoriesRes, cities, offersRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
      cache: "no-store",
    }),
    fetchCities(),
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/offers?cityCode=${decodedCity}&page=1&limit=20`,
      { cache: "no-store" }
    ),
  ]);

  const categories = await categoriesRes.json();
  const cityData = cities.find((c: any) => c.slug === decodedCity);
  const cityName = cityData ? cityData.name : decodedCity;
  const { data: offers = [], total } = await offersRes.json();

  const defaultFilters = {
    city: cityName,
    category: "",
    discountType: "Все",
    validity: "Все",
  };

  return (
    <div className="container mx-auto px-4 py-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-800">Скидки и акции</h1>
          <CitySelector currentCity={decodedCity} cities={cities} />
        </div>

        <MobileFiltersButton />
      </div>

      <FiltersBar defaultFilters={defaultFilters} categories={categories} />

      <ClientOffersPage
        total={total}
        categories={categories}
        cityName={decodedCity}
        defaultFilters={defaultFilters}
        initialOffers={offers}
      />
    </div>
  );
}
