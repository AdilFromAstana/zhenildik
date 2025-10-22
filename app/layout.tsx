import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppClientLayout from "./providers/AppClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Скидки и акции рядом — находи выгодные предложения от бизнеса",
  description:
    "Платформа, где бизнесы размещают свои акции и скидки, а пользователи находят выгодные предложения поблизости. Экономь и продавай больше.",
  keywords: [
    "скидки",
    "акции",
    "купоны",
    "выгодные покупки",
    "казахстан",
    "распродажа",
    "бизнес",
    "реклама",
  ],
  openGraph: {
    title: "Скидки и акции рядом — выгодно покупай, больше продавай",
    description: "Находи акции и скидки от местных бизнесов, экономь каждый день.",
    url: "https://example.kz",
    siteName: "OneDeal",
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Скидки и акции рядом",
    description: "Находи акции и скидки поблизости — экономь каждый день.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
        <AppClientLayout>
          {children}
        </AppClientLayout>
      </body>
    </html>
  );
}
