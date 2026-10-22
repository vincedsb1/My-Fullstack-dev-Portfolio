import type { Metadata } from "next";
import { SITE_URL, SITE_NAME, AUTHOR, absoluteUrl } from "../site";
import type { Locale } from "@/i18n/routing";
interface Input {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  type?: "website" | "article";
  alternates?: Partial<Record<Locale, string>>;
  image?: string;
  imageAlt?: string;
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
}
export function buildPageMetadata(input: Input): Metadata {
  const languages = Object.fromEntries(
    Object.entries(input.alternates ?? { [input.locale]: input.path }).map(
      ([l, p]) => [l, absoluteUrl(p)],
    ),
  );
  languages["x-default"] = languages.en ?? languages[input.locale];
  const title = input.title.replace(/ \| Vincent DESBROSSES$/, "");
  const images = input.image
    ? [
        {
          url: absoluteUrl(input.image),
          width: 1200,
          height: 630,
          alt: input.imageAlt ?? title,
        },
      ]
    : undefined;
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description: input.description,
    alternates: { canonical: absoluteUrl(input.path), languages },
    robots: input.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description: input.description,
      url: absoluteUrl(input.path),
      siteName: SITE_NAME,
      type: input.type ?? "website",
      locale: input.locale === "fr" ? "fr_FR" : "en_US",
      ...(images ? { images } : {}),
      ...(input.type === "article"
        ? {
            publishedTime: input.publishedTime,
            modifiedTime: input.modifiedTime,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: input.description,
      creator: AUTHOR.twitter,
      site: AUTHOR.twitter,
      ...(images ? { images } : {}),
    },
  };
}
