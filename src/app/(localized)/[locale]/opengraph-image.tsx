import { locales } from "@/i18n/routing";
export const dynamic = "force-static";
import { getTranslations } from "next-intl/server";
import { createSocialImage } from "@/lib/seo/social-image";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Vincent DESBROSSES";
export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "header" });
  return createSocialImage({
    category: `${t("jobTitleStart")} · ${t("jobTitleEnd")}`,
    title: `${t("firstName")} ${t("lastName")}`,
    excerpt: `${t("descriptionStart")}${t("descriptionHighlight")}${t(
      "descriptionEnd",
    )}`,
  });
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
