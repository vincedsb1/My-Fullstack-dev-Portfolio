import React from "react";
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Inter } from "next/font/google";
import { config } from "@fortawesome/fontawesome-svg-core";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import "@fortawesome/fontawesome-svg-core/styles.css";

import { locales, type Locale } from "../../../i18n.config.ts";
import Providers from "../Providers.tsx";
import "../globals.css";

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
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}`,
      siteName: title,
      images: [
        {
          url: ogImage,
          width: 819,
          height: 823,
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
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Vincent DESBROSSES",
    url: `${baseUrl}/${locale}`,
    jobTitle: "Fullstack Developer",
    description:
      "From ideation to completion, my skillset covers the full lifecycle of a web project.",
    image: `${baseUrl}/pp.jpg`,
    email: "vincedsb@gmail.com",
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

  return (
    <html lang={locale}>
      <head>
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
