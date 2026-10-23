import LocaleLinks from "./LocaleLinks";
import { getTranslations } from "next-intl/server";
import { getPublishedArticles } from "@/lib/blog/articles";
import { getPathname } from "@/i18n/paths";
import type { Locale } from "@/i18n/routing";
import { SITE_NAME } from "@/lib/site";
import ThemeToggle from "@/components/theme/ThemeToggle";
import HeaderNavigation from "./HeaderNavigation";
export default async function SiteHeader({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "site" });
  const homePath = getPathname({ locale, href: "/" });
  const links = [
    { href: `${homePath}#projects3`, label: t("projects") },
    {
      href: `/${locale}/blog`,
      label: t("blog"),
    },
    { href: `${homePath}#parcours`, label: t("career") },
    { href: `${homePath}#contact`, label: t("contact") },
  ];
  return (
    <>
      <a href="#main" className="skip-link">
        {t("skip")}
      </a>
      <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur-md">
        <div className="mx-auto flex min-h-20 max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-2 sm:px-6">
          <a
            aria-label={SITE_NAME}
            href={`/${locale}`}
            className="inline-flex items-center gap-2 font-semibold"
          >
            <span
              aria-hidden
              className="flex size-8 items-center justify-center rounded-control bg-content text-surface"
            >
              V
            </span>
            <span className="hidden lg:inline">{SITE_NAME}</span>
          </a>
          <HeaderNavigation
            links={links}
            label={t("navigation")}
            menuLabel={t("menu")}
          />
          <div className="flex items-center gap-2">
            <ThemeToggle
              labels={Object.fromEntries(
                ["theme", "light", "dark", "system"].map((k) => [k, t(k)]),
              )}
            />
            <LocaleLinks
              label={t("language")}
              paths={
                Object.fromEntries(
                  (["fr", "en"] as const).map((l) => [
                    l,
                    {
                      home: getPathname({ locale: l, href: "/" }),
                      projects: getPathname({ locale: l, href: "/projects" }),
                      archive: getPathname({
                        locale: l,
                        href: "/projects/archive",
                      }),
                      project: getPathname({
                        locale: l,
                        href: {
                          pathname: "/projects/[slug]",
                          params: { slug: "__slug__" },
                        },
                      }),
                      preview: getPathname({
                        locale: l,
                        href: {
                          pathname: "/projects/preview/[variant]",
                          params: { variant: "__variant__" },
                        },
                      }),
                      blog: getPathname({ locale: l, href: "/blog" }),
                      ui: getPathname({ locale: l, href: "/preview/ui" }),
                    },
                  ]),
                ) as unknown as Record<Locale, Record<string, string>>
              }
              locale={locale}
              articles={getPublishedArticles().map((a) => ({
                locale: a.metadata.locale,
                slug: a.metadata.slug,
                key: a.metadata.translationKey,
              }))}
            />
          </div>
        </div>
      </header>
    </>
  );
}
