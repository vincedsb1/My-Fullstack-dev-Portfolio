import type { Metadata } from "next";
import Script from "next/script";

import GuideInteractive from "./GuideInteractive";
import { guideContent } from "./guideContent";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://vincent.desbrosses.net";
const pageUrl = `${baseUrl}/guide-premier-emploi-developpeur`;
const title = "Premier emploi de développeur : guide 2026 | Vincent Desbrosses";
const description =
  "CV, LinkedIn, portfolio, projets, réseau et entretiens : des conseils concrets pour décrocher un premier emploi de développeur.";

const articleStructuredData = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Comment décrocher son premier emploi de développeur en 2026 ?",
  description,
  image: [`${pageUrl}/opengraph-image`],
  dateModified: "2026-10-11",
  author: {
    "@type": "Person",
    name: "Vincent DESBROSSES",
    url: `${baseUrl}/fr`,
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": pageUrl,
  },
  inLanguage: "fr-FR",
};

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
    modifiedTime: "2026-10-11T00:00:00.000Z",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    creator: "@vincedsb",
  },
};

export default function GuidePage() {
  return (
    <div className="guide-page min-h-screen bg-neutral-100 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleStructuredData).replace(
            /</g,
            "\\u003c",
          ),
        }}
      />
      <GuideInteractive html={guideContent} />
      <Script id="phosphor-icon-styles" strategy="afterInteractive">
        {`["regular", "bold", "fill"].forEach((weight) => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = "https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.2/src/" + weight + "/style.css";
  document.head.appendChild(link);
});`}
      </Script>
    </div>
  );
}
