import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Skidka-bar.kz — все скидки и акции Казахстана в одном месте",
  description:
    "Skidka-bar.kz — единый каталог выгодных предложений Казахстана. Находи акции, скидки, бонусы и промо-акции рядом с тобой.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Skidka-bar.kz — каталог скидок и акций Казахстана",
    description:
      "Все акции и скидки Казахстана — на одном сайте. Еда, красота, одежда, медицина, техника и многое другое.",
    url: "https://skidka-bar.kz",
    siteName: "Skidka-bar.kz",
    locale: "ru_RU",
    type: "website",
    images: [
      {
        url: "https://skidka-bar.kz/logo.png",
        width: 512,
        height: 512,
        alt: "Skidka-bar.kz логотип",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Skidka-bar.kz — все скидки и акции Казахстана",
    description:
      "Находи акции, скидки и бонусы рядом с тобой. Skidka-bar.kz — живи выгодно!",
    images: ["https://skidka-bar.kz/logo.png"],
  },
};

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* HERO */}
      <section className="text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          Скидки и акции в Астане
        </h1>
        <p className="text-gray-700 max-w-2xl mx-auto mb-6">
          Skidka-bar.kz — сервис, где собраны лучшие предложения города: еда,
          магазины, фитнес, салоны красоты и развлечения. Мы ежедневно обновляем
          каталог, чтобы вы могли экономить без лишних усилий.
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          <Link
            href="/offers/astana?category=eda"
            className="px-5 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            🍣 Еда
          </Link>
          <Link
            href="/offers/astana?category=krasota"
            className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            💅 Красота
          </Link>
          <Link
            href="/offers/astana?category=fitnes"
            className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            💪 Фитнес
          </Link>
          <Link
            href="/offers/astana"
            className="px-5 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
          >
            Все акции
          </Link>
        </div>
      </section>

      {/* КАТАЛОГ / СЕГОДНЯШНИЕ АКЦИИ */}
      <section className="mb-14">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          🔥 Актуальные скидки сегодня
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Все предложения проходят проверку и обновляются ежедневно.
        </p>
        {/* Здесь можно отрендерить компонент со списком акций */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Пример карточек-заглушек (замени на компонент OfferCard) */}
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition"
            >
              <Image
                src={`https://placehold.co/600x400?text=Акция+${i}`}
                alt={`Акция ${i}`}
                width={600}
                height={400}
                className="rounded-lg mb-3"
              />
              <h3 className="font-semibold text-lg mb-1">Пример акции #{i}</h3>
              <p className="text-sm text-gray-600">
                Скидка до 40% на популярные товары и услуги в Астане.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ИНФО БЛОК */}
      <section className="bg-orange-50 border border-orange-200 rounded-2xl p-6 md:p-10 text-center mb-14">
        <h2 className="text-2xl font-semibold mb-3">
          Как работает Skidka-bar.kz
        </h2>
        <p className="text-gray-700 max-w-3xl mx-auto">
          Мы ежедневно собираем акции с ресторанов, магазинов, салонов и
          сервисов Казахстана. Выбирайте интересные предложения, переходите на
          страницу акции и пользуйтесь выгодой — без регистрации и скрытых
          условий.
        </p>
      </section>

      {/* ДРУГИЕ ГОРОДА */}
      <section className="mb-14">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          🌆 Смотрите также скидки в других городах
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/almaty"
            className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Алматы
          </Link>
          <Link
            href="/shymkent"
            className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Шымкент
          </Link>
          <Link
            href="/karaganda"
            className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Караганда
          </Link>
        </div>
      </section>

      {/* НИЖНИЙ SEO-ТЕКСТ */}
      <section className="text-sm text-gray-600 leading-relaxed max-w-4xl mx-auto text-center">
        <p className="mb-3">
          Skidka-bar.kz — это единый каталог скидок и акций Казахстана. Здесь
          собраны лучшие предложения Астаны: от ресторанов и кафе до салонов
          красоты, магазинов и сервисов. Мы помогаем находить реальные скидки и
          экономить каждый день.
        </p>
        <p>
          Смотрите также{" "}
          <Link href="/almaty" className="text-orange-600 hover:underline">
            акции в Алматы
          </Link>{" "}
          и{" "}
          <Link href="/shymkent" className="text-orange-600 hover:underline">
            предложения в Шымкенте
          </Link>
          . Живи выгодно вместе с{" "}
          <span className="font-semibold">Skidka-bar.kz</span>.
        </p>
      </section>
    </div>
  );
}
