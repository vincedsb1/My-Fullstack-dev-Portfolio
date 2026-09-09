import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import HomeContent from "./HomeContent.tsx";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://vincent.desbrosses.net";
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        en: `${baseUrl}/en`,
        fr: `${baseUrl}/fr`,
        "x-default": `${baseUrl}/en`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${baseUrl}/${locale}`,
    },
  };
}

export default function Page() {
  return <HomeContent />;
}
