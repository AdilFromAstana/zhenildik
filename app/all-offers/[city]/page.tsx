import FiltersBar from "./components/FiltersBar";
import DealsList from "./components/DealsList";
import CitySelector from "./components/CitySelector";
import { applyFilters, mockDeals } from "@/app/data/mocks";
import { Metadata } from "next";
import { fetchCities } from "@/app/utils/fetchCities";

export const revalidate = 3600; // обновлять раз в час

export async function generateStaticParams() {
  const cities = await fetchCities();
  return cities.map((city: any) => ({ city: city.slug }));
}

// ✅ SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  const cities = await fetchCities();
  const cityData = cities.find((c: any) => c.slug === city);
  const cityName = cityData ? cityData.name : city;

  return {
    title: `Каталог всех акций в ${cityName} | Zhenildik.kz`,
    description: `Лучшие скидки и акции в ${cityName}.`,
  };
}

// ✅ Страница
export default async function AllDealsCityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  const decodedCity = decodeURIComponent(city);

  const [categoriesRes, cities] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
      cache: "no-store",
    }),
    fetchCities(),
  ]);

  const categories = await categoriesRes.json();
  const cityData = cities.find((c: any) => c.slug === decodedCity);
  const cityName = cityData ? cityData.name : decodedCity;

  const defaultFilters = {
    city: cityName,
    category: "",
    discountType: "Все",
    validity: "Все",
  };

  const filteredDeals = applyFilters(mockDeals, defaultFilters);

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2 mb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Скидки и акции
          </h1>
          <CitySelector currentCity={decodedCity} cities={cities} />
        </div>

        <FiltersBar defaultFilters={defaultFilters} categories={categories} />
        <DealsList
          initialDeals={filteredDeals}
          defaultFilters={defaultFilters}
        />
      </main>
    </div>
  );
}
