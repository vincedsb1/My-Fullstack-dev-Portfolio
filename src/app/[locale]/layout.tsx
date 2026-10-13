import React from "react";
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Inter } from "next/font/google";
import { config } from "@fortawesome/fontawesome-svg-core";
import { NextIntlClientProvider } from "next-intl";
import Script from "next/script";
import { getTranslations, setRequestLocale } from "next-intl/server";
import "@fortawesome/fontawesome-svg-core/styles.css";

import { locales, type Locale } from "../../../i18n.config.ts";
import Providers from "../Providers.tsx";
import "../globals.css";
import { getUmamiConfig } from "@/lib/umami";

config.autoAddCss = false;

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

// E. Pre-render both locale routes at build time instead of on demand.
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const SITE_NAME = "Vincent DESBROSSES";

const getBaseUrl = () =>
  process.env.NEXT_PUBLIC_SITE_URL || "https://vincent.desbrosses.net";

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const baseUrl = getBaseUrl();
  const t = await getTranslations({ locale, namespace: "metadata" });

  const title = t("title");
  const description = t("description");
  const ogImage = `${baseUrl}/pp.jpg`;

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}`,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage,
          width: 1084,
          height: 1084,
          alt: "Vincent DESBROSSES - Fullstack Developer",
          type: "image/jpeg",
        },
      ],
      type: "website",
      locale: locale === "fr" ? "fr_FR" : "en_US",
      alternateLocale: locale === "fr" ? "en_US" : "fr_FR",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
      creator: "@vincedsb",
      site: "@vincedsb",
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  // Import messages directly to ensure correct locale is used
  const messages = (await import(`../../i18n/${locale}.json`)).default;

  const baseUrl = getBaseUrl();
  const th = await getTranslations({ locale, namespace: "header" });
  const umami = getUmamiConfig();

  // Every value below is rendered on the page: name and jobTitle in the hero,
  // description as the hero paragraph, image as the profile picture.
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: th("name"),
    url: `${baseUrl}/${locale}`,
    jobTitle: th("jobTitle"),
    description: th("description"),
    image: `${baseUrl}/pp.jpg`,
    sameAs: [
      "https://www.linkedin.com/in/vincent-desbrosses/",
      "https://github.com/vincedsb1",
      "https://twitter.com/vincedsb",
      "https://www.malt.fr/profile/vincentdesbrosses",
    ],
    knowsAbout: [
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "PostgreSQL",
      "Web Development",
      "Fullstack Development",
    ],
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: ["Vincent Desbrosses", "vincent.desbrosses.net"],
    url: "https://vincent.desbrosses.net/",
  };

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <Script
          id="theme-initializer"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html:
              '(()=>{let storedTheme;try{storedTheme=localStorage.getItem("theme");}catch{}const theme=storedTheme==="light"||storedTheme==="dark"?storedTheme:window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";const root=document.documentElement;root.classList.remove("light","dark");root.classList.add(theme);root.style.colorScheme=theme;})();',
          }}
        />
        <meta
          name="google-site-verification"
          content="PW82MjVgB5OXOfa6RcjIX06LfN3lZ1arROcD41Ao1z4"
        />
        <noscript>
          <style
            dangerouslySetInnerHTML={{
              __html:
                "[data-aos]{opacity:1!important;transform:none!important}",
            }}
          />
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
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
