import type { Metadata } from "next";
import Script from "next/script";

import GuideInteractive from "./GuideInteractive";
import { guideContent } from "./guideContent";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://vincent.desbrosses.net";
const pageUrl = `${baseUrl}/guide-premier-emploi-developpeur`;
const title =
  "Comment décrocher son premier emploi de développeur en 2026 ? | Vincent DESBROSSES";
const description =
  "Guide gratuit : CV, LinkedIn, portfolio, candidatures, réseau, projets et entretiens pour décrocher un premier poste dans le développement web.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: pageUrl },
  openGraph: {
    title,
    description,
    url: pageUrl,
    siteName: "Vincent DESBROSSES",
    type: "article",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
};

export default function GuidePage() {
  return (
    <div className="guide-page min-h-screen bg-neutral-100 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">
      <GuideInteractive html={guideContent} />
      <Script
        src="https://unpkg.com/@phosphor-icons/web"
        strategy="afterInteractive"
      />
    </div>
  );
}
