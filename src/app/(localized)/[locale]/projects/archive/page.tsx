import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getArchiveProjects } from "@/content/projects/loaders";
import { getArchivePath } from "@/lib/projects/routes";
import { buildPageMetadata } from "@/lib/seo/metadata";
import ProjectArchivesPage from "@/features/projects/ProjectArchivesPage";
export const dynamic = "force-static";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projects" });
  const s = await getTranslations({ locale, namespace: "site" });
  return buildPageMetadata({
    locale,
    path: getArchivePath(locale),
    title: t("archivesTitle"),
    description: s("archiveDescription", {
      count: getArchiveProjects().length,
    }),
    alternates: { fr: getArchivePath("fr"), en: getArchivePath("en") },
  });
}
export default async function Page({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ProjectArchivesPage locale={locale} />;
}
