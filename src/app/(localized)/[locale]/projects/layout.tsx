import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
export default async function ProjectsLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const m = await getMessages({ locale });
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={{ projects: m.projects, caseStudy: m.caseStudy, site: m.site }}
    >
      {children}
    </NextIntlClientProvider>
  );
}
