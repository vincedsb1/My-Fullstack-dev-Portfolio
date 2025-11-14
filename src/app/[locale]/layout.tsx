import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { config } from "@fortawesome/fontawesome-svg-core";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import "@fortawesome/fontawesome-svg-core/styles.css";

import Providers from "../Providers.tsx";
import "../globals.css";

config.autoAddCss = false;

const inter = Inter({ subsets: ["latin"] });

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
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vincent-desbrosses.com'

  const title = "Vincent's portfolio";
  const description = "Dive into my world of creativity, experience, and digital connections.";
  const ogImage = `${baseUrl}/pp.jpg`;

  return {
    title,
    description,
    viewport: 'width=device-width, initial-scale=1',
    alternates: {
      languages: {
        'en': `${baseUrl}/en`,
        'fr': `${baseUrl}/fr`,
        'x-default': `${baseUrl}/en`,
      },
      canonical: `${baseUrl}/${locale}`,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}`,
      siteName: "Vincent's portfolio",
      images: [
        {
          url: ogImage,
          width: 819,
          height: 823,
          alt: 'Vincent DESBROSSES - Fullstack Developer',
          type: 'image/jpeg',
        },
      ],
      type: 'website',
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
      alternateLocale: locale === 'fr' ? 'en_US' : 'fr_FR',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
      creator: '@vincedsb',
      site: '@vincedsb',
    },
    other: {
      'application/ld+json': JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Vincent DESBROSSES',
        url: baseUrl,
        jobTitle: 'Fullstack Developer',
        description: 'From ideation to completion, my skillset covers the full lifecycle of a web project.',
        image: ogImage,
        email: 'vincedsb@gmail.com',
        sameAs: [
          'https://www.linkedin.com/in/vincent-desbrosses/',
          'https://github.com/vincedsb1',
          'https://twitter.com/vincedsb',
        ],
        knowsAbout: [
          'JavaScript',
          'TypeScript',
          'React',
          'Next.js',
          'Node.js',
          'PostgreSQL',
          'Web Development',
          'Fullstack Development',
        ],
      }),
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  // Import messages directly to ensure correct locale is used
  const messages = (await import(`../../i18n/${locale}.json`)).default;

  return (
    <html lang={locale}>
      <head>
        <meta
          name="google-site-verification"
          content="PW82MjVgB5OXOfa6RcjIX06LfN3lZ1arROcD41Ao1z4"
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
