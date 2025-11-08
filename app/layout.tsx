import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReactQueryClientProvider from "@/providers/QueryClientProvider";
import AppClientLayout from "@/providers/AppClientLayout";
import { AuthProvider } from "@/providers/AuthProvider";
// import { MapProvider } from "@/providers/MapProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Skidka-bar.kz — все скидки и акции Казахстана в одном месте",
  description:
    "Skidka-bar.kz — единый каталог выгодных предложений Казахстана. Находи акции, скидки, бонусы и промо-акции рядом с тобой: рестораны, магазины, салоны, техника и многое другое.",
  keywords: [
    "Skidka-bar.kz",
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
    title: "Skidka-bar.kz — каталог скидок и акций Казахстана",
    description:
      "Все акции и скидки Казахстана — на одном сайте. Еда, красота, одежда, медицина, техника и многое другое. Экономь каждый день с Skidka-bar.kz!",
    url: "https://skidka-bar.kz",
    siteName: "Skidka-bar.kz",
    locale: "ru_RU",
    type: "website",
    images: [
      {
        url: "https://skidka-bar.kz/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Skidka-bar.kz — каталог скидок и акций Казахстана",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Skidka-bar.kz — все скидки и акции Казахстана",
    description:
      "Находи акции, скидки и бонусы рядом с тобой. Skidka-bar.kz — живи выгодно!",
    images: ["https://skidka-bar.kz/og-image.jpg"],
  },
  metadataBase: new URL("https://skidka-bar.kz"),
  alternates: {
    canonical: "https://skidka-bar.kz",
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
        <ReactQueryClientProvider>
          <AuthProvider>
            <AppClientLayout>{children}</AppClientLayout>
          </AuthProvider>
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
