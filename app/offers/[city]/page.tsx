// app/offers/[city]/page.tsx
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

  const canonical = `https://skidka-bar.kz/offers/${city}`;

  const meta: Metadata = {
    title: `Скидки и акции ${cityName} | Skidka-Bar.kz`,
    description: `Лучшие скидки и акции в ${cityName}. Найди выгодные предложения рядом с тобой — рестораны, магазины, салоны и другие сервисы рядом.`,
    keywords: [
      `скидки ${cityName}`,
      `акции ${cityName}`,
      `распродажи ${cityName}`,
      `купоны ${cityName}`,
      `скидка бар ${cityName}`,
      "Skidka-Bar.kz",
    ],
    alternates: { canonical },
  };

  if (pageNum > 1) {
    meta.robots = { index: false, follow: true };
  }

  return meta;
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
      {/* JSON-LD можно спокойно держать в body — поисковики его понимают */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListOrder: "https://schema.org/ItemListOrderAscending",
            numberOfItems: offers.length,
            itemListElement: offers
              .filter((o: any) => o?.id && o?.title)
              .map((offer: any, i: number) => ({
                "@type": "ListItem",
                position: (pageNum - 1) * limit + i + 1,
                url: `https://skidka-bar.kz/offer/${offer.id}`,
                name: offer.title || "Акция без названия",
                item: {
                  "@type": "Offer",
                  name: offer.title,
                  description: offer.description || "",
                  image: offer.posters?.[0] || undefined,
                  url: `https://skidka-bar.kz/offer/${offer.id}`,
                  priceCurrency: "KZT",
                  price: offer.newPrice ? String(offer.newPrice) : undefined,
                  priceValidUntil: offer.endDate || undefined,
                  availability: "https://schema.org/InStock",
                  validFrom: offer.startDate || undefined,
                  category: offer.category?.name || undefined,
                  seller: offer.user
                    ? {
                        "@type": "Organization",
                        name: offer.user.name || "Партнёр Skidka-Bar",
                        logo: offer.user.avatar || undefined,
                      }
                    : undefined,
                },
              })),
          }),
        }}
      />

      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-800">
            Скидки и акции &nbsp;
          </h1>
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

      {totalPages > 1 && (
        <nav className="mt-6 flex items-center justify-center gap-4 text-sm text-gray-500">
          {pageNum > 1 && (
            <a
              href={`/offers/${city}${
                pageNum > 2 ? `?page=${pageNum - 1}` : ""
              }`}
            >
              ← Предыдущая
            </a>
          )}
          <span>
            Стр. {pageNum} из {totalPages}
          </span>
          {pageNum < totalPages && (
            <a
              href={`/offers/${city}?page={pageNum + 1}`.replace(
                "{pageNum + 1}",
                String(pageNum + 1)
              )}
            >
              Следующая →
            </a>
          )}
        </nav>
      )}
    </div>
  );
}
