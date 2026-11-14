import { siteOrigin, robotsPolicy } from "@/lib/seo";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { QuoteProvider } from "@/components/forms/quote-provider";
import { content } from "@/content/repository";
import "./globals.css";

export const viewport: Viewport = { interactiveWidget: "resizes-content" };

const manrope = localFont({
  src: "../../public/fonts/manrope-variable.ttf",
  variable: "--font-manrope",
  display: "swap",
  weight: "200 800",
  fallback: ["Arial", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: { default: "Мебель на заказ в Москве — демонстрационная версия", template: "%s — Демо мебели" },
  description: "Демонстрационная версия сайта мебели по индивидуальным размерам. Москва и Московская область. Сайт находится в разработке.",
  robots: robotsPolicy,
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [categories, products] = await Promise.all([content.getCategories(), content.getProducts()]);
  return (
    <html lang="ru" className={manrope.variable}>
      <body>
        <QuoteProvider categories={categories.map(({id, slug, title}) => ({id, slug, title}))} products={products.map(({categoryId, slug, title}) => ({categoryId, slug, title}))}>
        <a href="#main-content" className="skip-link">Перейти к содержимому</a>
        <SiteHeader />
        <main id="main-content" tabIndex={-1} className="site-main">{children}</main>
        <SiteFooter />
        </QuoteProvider>
      </body>
    </html>
  );
}
