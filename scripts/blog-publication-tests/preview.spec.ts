import { mkdirSync, readFileSync } from "node:fs";
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const theme of ["light", "dark"] as const) {
  test(`prévisualisation du shell JSON en développement (${theme})`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.addInitScript(
      (value) => localStorage.setItem("theme", value),
      theme,
    );
    await page.route("https://i.ytimg.com/**", (route) =>
      route.fulfill({
        contentType: "image/svg+xml",
        body: readFileSync("public/blog/json-demo-blog/structure.svg"),
      }),
    );
    const response = await page.goto(
      "/fr/blog/json-preview?slug=json-demo-blog",
    );
    expect(response?.status()).toBe(200);
    await expect(page.locator("html")).toHaveClass(new RegExp(theme));
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator('[data-module^="saas-"]')).toHaveCount(5);
    for (const width of [320, 390, 820, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      const state = await page.evaluate(() => {
        const ids = Array.from(document.querySelectorAll("[id]")).map(
          (node) => node.id,
        );
        const broken = Array.from(
          document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'),
        )
          .map((node) => node.hash.slice(1))
          .filter(
            (id) => id && !document.getElementById(decodeURIComponent(id)),
          );
        return {
          overflow: document.documentElement.scrollWidth > innerWidth,
          duplicates: ids.length !== new Set(ids).size,
          broken,
        };
      });
      expect(state).toEqual({ overflow: false, duplicates: false, broken: [] });
      if (width === 390 || width === 1440) {
        const result = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze();
        expect(result.violations).toEqual([]);
      }
      mkdirSync("tests/visual-artifacts", { recursive: true });
      await page.screenshot({
        path: `tests/visual-artifacts/blog-json-preview-${theme}-${width}.png`,
        fullPage: true,
        animations: "disabled",
      });
    }
    const demo = page.locator('[data-module="saas-language-demo"]');
    await demo.locator("select").first().selectOption("en");
    await expect(demo.locator(".blog-language-demo__preview")).toHaveAttribute(
      "lang",
      "en",
    );
    const checklist = page.locator("#interactions .blog-ds__json-checklist");
    await checklist.locator("input").first().check();
    await expect(checklist.locator("progress")).toHaveAttribute("value", "1");
    expect(errors).toEqual([]);
    expect(
      (await page.goto("/fr/blog/json-preview?slug=article-absent"))?.status(),
    ).toBe(404);
    expect(
      (
        await page.goto(
          "/fr/blog/json-preview?slug=internationaliser-saas-lancement",
        )
      )?.status(),
    ).toBe(404);
  });
}
