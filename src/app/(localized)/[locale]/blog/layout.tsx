import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import "./blog.css";
export default async function BlogLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const m = await getMessages({ locale });
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={{ blog: m.blog, common: m.common, site: m.site }}
    >
      {children}
    </NextIntlClientProvider>
  );
}
