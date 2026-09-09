import type { Metadata } from "next";

import HomeContent from "./HomeContent.tsx";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://vincent.desbrosses.net";

  // Only `alternates` is overridden here. Page-level metadata REPLACES the
  // parent object rather than deep-merging it, so redeclaring a partial
  // `openGraph` would drop og:image, og:type, og:site_name and og:locale.
  return {
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        en: `${baseUrl}/en`,
        fr: `${baseUrl}/fr`,
        "x-default": `${baseUrl}/en`,
      },
    },
  };
}

export default function Page() {
  return <HomeContent />;
}
