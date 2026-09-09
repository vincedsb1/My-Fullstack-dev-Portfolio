import type { Metadata } from "next";

import IntegrationContent from "./IntegrationContent.tsx";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://vincent.desbrosses.net";

  return {
    alternates: {
      canonical: `${baseUrl}/${locale}/integration`,
      languages: {
        en: `${baseUrl}/en/integration`,
        fr: `${baseUrl}/fr/integration`,
        "x-default": `${baseUrl}/en/integration`,
      },
    },
    openGraph: {
      url: `${baseUrl}/${locale}/integration`,
    },
  };
}

export default function Page() {
  return <IntegrationContent />;
}
