import { ArrowUpRight } from "lucide-react";
import { getPublishedCaseStudy } from "@/content/projects/loaders";
import { getProjectDetailPath } from "@/lib/projects/routes";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
export async function RelatedProjects({
  locale,
  slugs,
  compact = false,
}: {
  locale: Locale;
  slugs: string[];
  compact?: boolean;
}) {
  const t = await getTranslations({ locale, namespace: "site" });
  const projects = slugs.map((slug) => getPublishedCaseStudy(locale, slug));
  if (!projects.length) return null;
  return (
    <aside
      className={
        compact
          ? "blog-related-projects blog-related-projects--compact"
          : "blog-related-projects mt-12 rounded-card border border-border bg-surface-raised p-6"
      }
    >
      <h2 className={compact ? "blog-ds__next-label" : "text-h3 font-semibold"}>
        {t("relatedProjects")}
      </h2>
      <ul className={compact ? undefined : "mt-4 space-y-3"}>
        {projects.map((p) => {
          if (!p)
            throw new Error("Related project is not published in this locale");
          return (
            <li key={p.slug}>
              <a
                href={getProjectDetailPath(locale, p.slug)}
                className={
                  compact
                    ? "blog-ds__related-project-link"
                    : "text-accent underline"
                }
              >
                {p.seo.title}
                {compact ? <ArrowUpRight size={15} aria-hidden="true" /> : null}
              </a>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
