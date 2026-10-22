import { getPublishedCaseStudy } from "@/content/projects/loaders";
import { getProjectDetailPath } from "@/lib/projects/routes";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
export async function RelatedProjects({
  locale,
  slugs,
}: {
  locale: Locale;
  slugs: string[];
}) {
  const t = await getTranslations({ locale, namespace: "site" });
  const projects = slugs.map((slug) => getPublishedCaseStudy(locale, slug));
  if (!projects.length) return null;
  return (
    <aside className="mt-12 rounded-card border border-border bg-surface-raised p-6">
      <h2 className="text-h3 font-semibold">{t("relatedProjects")}</h2>
      <ul className="mt-4 space-y-3">
        {projects.map((p) => {
          if (!p)
            throw new Error("Related project is not published in this locale");
          return (
            <li key={p.slug}>
              <a
                href={getProjectDetailPath(locale, p.slug)}
                className="text-accent underline"
              >
                {p.seo.title}
              </a>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
