import { locales } from "@/i18n/routing";
export const dynamic = "force-static";
import { getTranslations } from "next-intl/server";
import { createSocialImage } from "@/lib/seo/social-image";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Portfolio";
export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projects" });
  return createSocialImage({
    category: "Portfolio",
    title: t("archivesTitle"),
    excerpt: "Vincent DESBROSSES",
  });
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
