import { Metadata } from "next";
import CitySelector from "./components/CitySelector";
import FiltersBar from "./components/FiltersBar";
import ClientOffersPage from "./components/ClientOffersPage";
import MobileFiltersButton from "./components/MobileFiltersButton";
import { fetchCities } from "@/utils/fetchCities";

export const revalidate = 3600;

interface Props {
  params: Promise<{ city: string }>; // ✅ Promise теперь правильно
  searchParams: Promise<{ page?: string }>; // ✅ searchParams тоже
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { city } = await params;
  const { page } = await searchParams;
  const pageNum = Number(page || 1);

  const cities = await fetchCities();
  const cityData = cities.find((c: any) => c.slug === city);
  const cityName = cityData ? cityData.name : city;

  const canonical =
    pageNum > 1
      ? `https://zhenildik.kz/offers/${city}?page=${pageNum}`
      : `https://zhenildik.kz/offers/${city}`;

  return {
    title: `Скидки и акции ${cityName}${
      pageNum > 1 ? ` — страница ${pageNum}` : ""
    } | Zhenildik.kz`,
    description: `Лучшие скидки и акции в ${cityName}. Найди выгодные предложения рядом с тобой.`,
    alternates: { canonical },
    keywords: [
      `скидки ${cityName}`,
      `акции ${cityName}`,
      `распродажи ${cityName}`,
      `купоны ${cityName}`,
      "Zhenildik.kz",
    ],
  };
}

export default async function AllOffersByCityPage({
  params,
  searchParams,
}: Props) {
  const { city } = await params;
  const { page } = await searchParams;
  const pageNum = Number(page || 1);
  const limit = 20;

  const [categoriesRes, cities, offersRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
      next: { revalidate: 3600 },
    }),
    fetchCities(),
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/offers?cityCode=${city}&page=${pageNum}&limit=${limit}`,
      { next: { revalidate: 3600 } }
    ),
  ]);

  const categories = await categoriesRes.json();
  const cityData = cities.find((c: any) => c.slug === city);
  const cityName = cityData ? cityData.name : city;
  const { data: offers = [], total } = await offersRes.json();
  console.log("offers: ", offers)
  const totalPages = Math.ceil(total / limit);

  const defaultFilters = {
    city,
    cityName,
    category: "",
    discountType: "Все",
    validity: "Все",
  };

  return (
    <div className="container mx-auto px-4 py-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-800">Скидки и акции в</h1>
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

      {/* JSON-LD для SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: offers
              .filter((o: any) => o?.city) // 👈 исключаем undefined
              .map((offer: any, i: number) => ({
                "@type": "ListItem",
                position: (pageNum - 1) * limit + i + 1,
                url: `https://zhenildik.kz/offer/${offer.city}`, // 👈 slug обязателен
                name: offer.title || "Акция без названия",
              })),
          }),
        }}
      />
    </div>
  );
}
