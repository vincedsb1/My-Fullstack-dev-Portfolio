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
  return {
    title: "Vincent's portfolio",
    description:
      "Dive into my world of creativity, experience, and digital connections.",
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
