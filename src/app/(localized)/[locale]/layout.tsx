import { ErrorMessages } from "@/components/layout/ErrorMessages";
import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Script from "next/script";
import { locales, type Locale } from "@/i18n/routing";
import Providers from "@/components/theme/Providers";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { inter } from "@/lib/fonts";
import { themeInitializer } from "@/lib/theme/initializer";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { getUmamiConfig } from "@/lib/umami";
import "../../globals.css";
export const viewport: Viewport = { width: "device-width", initialScale: 1 };
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t("title"), template: `%s | ${SITE_NAME}` },
    description: t("description"),
  };
}
export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!locales.includes(raw as Locale)) notFound();
  const locale = raw as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "site" });
  const umami = getUmamiConfig();
  return (
    <html lang={locale} suppressHydrationWarning className={inter.variable}>
      <head>
        <script
          id="theme-initializer"
          dangerouslySetInnerHTML={{ __html: themeInitializer }}
        />
        <meta
          name="google-site-verification"
          content="PW82MjVgB5OXOfa6RcjIX06LfN3lZ1arROcD41Ao1z4"
        />
      </head>
      <body className="font-sans">
        <ErrorMessages
          messages={{
            locale,
            error: t("error"),
            retry: t("retry"),
            home: t("home"),
          }}
        >
          <Providers>
            <SiteHeader locale={locale} />
            {children}
            <SiteFooter locale={locale} />
          </Providers>
        </ErrorMessages>
        {umami && (
          <Script
            id="umami-analytics"
            src={umami.scriptUrl}
            data-website-id={umami.websiteId}
            data-domains={umami.domain}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
