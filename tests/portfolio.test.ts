vi.mock("@/i18n/navigation", async () => {
  const { routing } = await import("../src/i18n/routing");
  return {
    getPathname: ({
      locale,
      href,
    }: {
      locale: "fr" | "en";
      href: string | { pathname: string; params: Record<string, string> };
    }) => {
      const route = typeof href === "string" ? href : href.pathname;
      const config = routing.pathnames[route as keyof typeof routing.pathnames];
      let result: string = typeof config === "string" ? config : config[locale];
      if (typeof href !== "string")
        for (const [k, v] of Object.entries(href.params))
          result = result.replace(`[${k}]`, v);
      return `/${locale}${result === "/" ? "" : result}`;
    },
  };
});
import { describe, it, expect, vi } from "vitest";
import fr from "../src/i18n/messages/fr.json";
import en from "../src/i18n/messages/en.json";
vi.mock("next-intl/server", () => ({
  getTranslations: async ({
    locale = "fr",
    namespace,
  }: {
    locale?: "fr" | "en";
    namespace: string;
  }) =>
    Object.assign(
      (key: string) => {
        let value: unknown = (locale === "fr" ? fr : en)[
          namespace as keyof typeof fr
        ];
        for (const part of key.split("."))
          value = (value as Record<string, unknown>)[part];
        return String(value);
      },
      {
        raw: (key: string) => {
          let value: unknown = (locale === "fr" ? fr : en)[
            namespace as keyof typeof fr
          ];
          for (const part of key.split("."))
            value = (value as Record<string, unknown>)[part];
          return value;
        },
      },
    ),
}));
import {
  getPublishedProjectSlugs,
  getPublishedCaseStudy,
  getPublishedNeighbors,
  getProjectFromCatalog,
  getArchiveProjects,
} from "../src/content/projects/loaders";
import { getHomeProjects } from "../src/content/projects/view-models";
import { validateCaseStudyManifest } from "../src/content/projects/validation";
import { buildPageMetadata } from "../src/lib/seo/metadata";
import { estimateReadingTime } from "../src/lib/blog/reading-time";
import sitemap from "../src/app/sitemap";
import { SITE_URL } from "../src/lib/site";
describe("published projects", () => {
  it.each(["fr", "en"] as const)(
    "exposes all seven studies in %s",
    (locale) => {
      expect(getPublishedProjectSlugs(locale)).toHaveLength(7);
      expect(getPublishedCaseStudy(locale, "missing")).toBeUndefined();
      expect(getArchiveProjects()).toHaveLength(8);
    },
  );
  it("keeps previous/next neighbors inside published content", () => {
    const p = getProjectFromCatalog("allaw")!;
    const { previous, next } = getPublishedNeighbors("fr", p);
    expect(previous?.slug).toBe("truthify");
    expect(next?.slug).toBe("iconise");
  });
  it("passes only serializable view data to clients", async () => {
    const models = await getHomeProjects("fr");
    expect(models.featured).toHaveLength(4);
    expect(models.others).toHaveLength(3);
    expect(
      models.featured.every((p) => p.detailHref?.startsWith("/fr/projets/")),
    ).toBe(true);
    expect(JSON.stringify(models)).not.toMatch(
      /schemaVersion|manifestFile|caseStudyByLocale/,
    );
  });
  it("rejects impossible dates and unknown fields", () => {
    const manifest = getPublishedCaseStudy("fr", "allaw")!;
    expect(
      validateCaseStudyManifest({ ...manifest, updatedAt: "2026-02-30" }),
    ).not.toHaveLength(0);
    expect(
      validateCaseStudyManifest({ ...manifest, unknown: true }),
    ).not.toHaveLength(0);
    expect(() => validateCaseStudyManifest(null)).not.toThrow();
    expect(() =>
      validateCaseStudyManifest({ ...manifest, seo: {} }),
    ).not.toThrow();
    expect(
      validateCaseStudyManifest({ ...manifest, seo: {} }),
    ).not.toHaveLength(0);
  });
});
describe("metadata and sitemap", () => {
  it("adds a canonical and a fallback for an untranslated page", () => {
    const metadata = buildPageMetadata({
      locale: "fr",
      path: "/fr/blog/example",
      title: "Example",
      description: "Description",
    });
    expect(metadata.alternates?.canonical).toBe(`${SITE_URL}/fr/blog/example`);
    expect(metadata.alternates?.languages?.["x-default"]).toBe(
      `${SITE_URL}/fr/blog/example`,
    );
  });
  it("keeps untranslated English blog routes out and dates every URL", () => {
    const entries = sitemap();
    const urls = entries.map((e) => e.url);
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls).not.toContain(`${SITE_URL}/en/blog`);
    expect(urls).toContain(`${SITE_URL}/fr/projets`);
    expect(urls).toContain(`${SITE_URL}/en/projects`);
    expect(
      entries.every(
        (e) =>
          e.lastModified && !Number.isNaN(new Date(e.lastModified).getTime()),
      ),
    ).toBe(true);
  });
  it("estimates reading time from readable content", () => {
    expect(estimateReadingTime(" ")).toBe(1);
    expect(estimateReadingTime("mot ".repeat(401))).toBe(3);
    expect(estimateReadingTime("```ts\n" + "code ".repeat(401) + "\n```")).toBe(
      1,
    );
  });
});
