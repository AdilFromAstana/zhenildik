import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppClientLayout from "./providers/AppClientLayout";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zhenildik.kz — все скидки и акции Казахстана в одном месте",
  description:
    "Zhenildik.kz — единый каталог выгодных предложений Казахстана. Находи акции, скидки, бонусы и промо-акции рядом с тобой: рестораны, магазины, салоны, техника и многое другое.",
  keywords: [
    "Zhenildik.kz",
    "скидки Казахстан",
    "акции Казахстан",
    "купоны Казахстан",
    "скидки в Астане",
    "скидки в Алматы",
    "акции супермаркетов",
    "распродажа",
    "бонусы",
    "промокоды",
    "выгодные предложения",
    "каталог акций",
  ],
  openGraph: {
    title: "Zhenildik.kz — каталог скидок и акций Казахстана",
    description:
      "Все акции и скидки Казахстана — на одном сайте. Еда, красота, одежда, медицина, техника и многое другое. Экономь каждый день с Zhenildik.kz!",
    url: "https://zhenildik.kz",
    siteName: "Zhenildik.kz",
    locale: "ru_RU",
    type: "website",
    images: [
      {
        url: "https://zhenildik.kz/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Zhenildik.kz — каталог скидок и акций Казахстана",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zhenildik.kz — все скидки и акции Казахстана",
    description:
      "Находи акции, скидки и бонусы рядом с тобой. Zhenildik.kz — живи выгодно!",
    images: ["https://zhenildik.kz/og-image.jpg"],
  },
  metadataBase: new URL("https://zhenildik.kz"),
  alternates: {
    canonical: "https://zhenildik.kz",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900 w-full`}
      >
        <Providers>
          <AppClientLayout>{children}</AppClientLayout>
        </Providers>
      </body>
    </html>
  );
}
