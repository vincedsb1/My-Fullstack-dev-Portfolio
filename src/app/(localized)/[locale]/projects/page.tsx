import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import {
  getPublishedProjectSlugs,
  getProjectFromCatalog,
} from "@/content/projects/loaders";
import { getProjectModels } from "@/content/projects/view-models";
import { getProjectsPath, getArchivePath } from "@/lib/projects/routes";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";
import ProjectArchiveGrid from "@/features/projects/ProjectArchiveGrid";
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
    path: getProjectsPath(locale),
    title: s("allProjects"),
    description: t("subtitle"),
    alternates: { fr: getProjectsPath("fr"), en: getProjectsPath("en") },
  });
}
export default async function Page({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("site");
  const p = await getTranslations("projects");
  const models = await getProjectModels(
    locale,
    getPublishedProjectSlugs(locale).map(
      (slug) => getProjectFromCatalog(slug)!,
    ),
  );
  return (
    <main id="main" className="py-16 sm:py-24">
      <Container>
        <h1 className="mb-10 text-h1 font-bold">{t("allProjects")}</h1>
        <ProjectArchiveGrid projects={models} />
        <div className="mt-8">
          <ButtonLink href={getArchivePath(locale)} variant="secondary">
            {p("archives")}
          </ButtonLink>
        </div>
      </Container>
    </main>
  );
}
