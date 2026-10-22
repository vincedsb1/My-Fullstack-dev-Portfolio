import { mkdirSync, readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const pairs = [
  {
    fr: "guide-premier-emploi-developpeur",
    en: "first-developer-job-guide",
    title: "How to land your first developer job in 2026",
  },
  {
    fr: "internationaliser-saas-lancement",
    en: "internationalize-saas-at-launch",
    title: "Should you internationalize your SaaS at launch?",
  },
];
const copy = JSON.parse(
  readFileSync("src/i18n/messages/en.json", "utf8"),
).blogSaas;
for (const theme of ["light", "dark"]) {
  test(`parcours anglais, traduction réciproque et responsive (${theme})`, async ({
    page,
  }) => {
    test.setTimeout(180000);
    mkdirSync("tests/visual-artifacts", { recursive: true });
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    await page.addInitScript((t) => localStorage.setItem("theme", t), theme);
    await page.goto("/en");
    const homeBlogLinks = await page
      .locator('a[href*="/blog"]')
      .evaluateAll((ns) => ns.map((n) => n.getAttribute("href")!));
    expect(homeBlogLinks.length).toBeGreaterThanOrEqual(4);
    expect(homeBlogLinks.every((href) => href.startsWith("/en/blog"))).toBe(
      true,
    );
    await page.locator('[data-social="blog"]').click();
    await expect(page).toHaveURL(/\/en\/blog$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    for (const pair of pairs) {
      await expect(
        page.locator(`main a[href="/en/blog/${pair.en}"]`),
      ).toHaveCount(1);
    }
    for (const pair of pairs) {
      expect((await page.goto(`/en/blog/${pair.en}`))?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveText(pair.title);
      await expect(page.locator(".blog-ds__author-card")).not.toContainText(
        "Développeur Fullstack",
      );
      await expect(page.locator('main a[href^="/fr"]')).toHaveCount(0);
      for (const width of [320, 390, 820, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        const state = await page.evaluate(() => {
          const ids = Array.from(document.querySelectorAll("[id]")).map(
            (n) => n.id,
          );
          return {
            overflow: document.documentElement.scrollWidth > innerWidth,
            duplicate: ids.length !== new Set(ids).size,
            broken: Array.from(
              document.querySelectorAll<HTMLAnchorElement>('main a[href^="#"]'),
            )
              .map((a) => decodeURIComponent(a.hash.slice(1)))
              .filter((id) => id && !document.getElementById(id)),
          };
        });
        expect(state).toEqual({
          overflow: false,
          duplicate: false,
          broken: [],
        });
        await expect(page.locator("main")).toHaveCount(1);
        await expect(page.locator("h1")).toHaveCount(1);
        if (width === 390 || width === 1440)
          expect(
            (
              await new AxeBuilder({ page })
                .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
                .analyze()
            ).violations,
          ).toEqual([]);
        await page.screenshot({
          path: `tests/visual-artifacts/blog-en-${pair.en}-${theme}-${width}.png`,
          fullPage: true,
          animations: "disabled",
        });
      }
      await page.getByRole("button", { name: /Language/ }).click();
      await expect(page.locator('#locale-menu a[lang="fr"]')).toHaveAttribute(
        "href",
        `/fr/blog/${pair.fr}`,
      );
      await page.locator('#locale-menu a[lang="fr"]').click();
      await expect(page).toHaveURL(new RegExp(`/fr/blog/${pair.fr}$`));
      await page.getByRole("button", { name: /Langue/ }).click();
      await expect(page.locator('#locale-menu a[lang="en"]')).toHaveAttribute(
        "href",
        `/en/blog/${pair.en}`,
      );
      await page.locator('#locale-menu a[lang="en"]').click();
      await expect(page).toHaveURL(new RegExp(`/en/blog/${pair.en}$`));
    }
    expect(errors).toEqual([]);
  });
}
test("les cinq widgets anglais gardent la matrice, les sélecteurs et les huit décisions", async ({
  page,
}) => {
  await page.goto("/en/blog/internationalize-saas-at-launch");
  await expect(page.locator('[data-module^="saas-"]')).toHaveCount(5);
  await expect(page.locator(".blog-ds__hero-visual")).toContainText(
    "More value?",
  );
  await expect(page.locator(".blog-language-mosaic__tile")).toHaveCount(6);
  const demo = page.locator(".blog-language-demo");
  await expect(demo.locator("select").first()).toHaveValue("en");
  await demo.locator("select").first().selectOption("de");
  await demo.locator("select").nth(1).selectOption("ja");
  await expect(demo.locator(".blog-language-demo__preview")).toHaveAttribute(
    "lang",
    "de",
  );
  await expect(
    demo.locator(".blog-language-demo__direction strong"),
  ).toHaveAttribute("lang", "ja");
  const matrix = page.locator(".blog-language-matrix");
  await expect(matrix.locator("tbody td")).toHaveCount(36);
  const selected = matrix.locator('button[aria-pressed="true"]');
  await expect(selected).toHaveAttribute(
    "aria-label",
    /French for the interface, Japanese for the content/,
  );
  await selected.focus();
  await page.keyboard.press("End");
  await expect(matrix.locator('button[aria-pressed="true"]')).toHaveAttribute(
    "aria-label",
    /Japanese for the interface, Japanese for the content/,
  );
  await page.keyboard.press("Home");
  await expect(matrix.locator('button[aria-pressed="true"]')).toHaveAttribute(
    "aria-label",
    /French for the interface, French for the content/,
  );
  await expect(page.locator(".blog-funnel__stage")).toHaveCount(4);
  await expect(page.locator(".blog-funnel__stage").first()).toContainText(
    "Visitors",
  );
  const tree = page.locator(".blog-decision-tree");
  const expected = [
    copy.adviceValidateTitle,
    copy.adviceValidateTitle,
    copy.adviceArchitectureTitle,
    copy.adviceDemandTitle,
    copy.adviceArchitectureTitle,
    copy.adviceInternationalTitle,
    copy.adviceArchitectureTitle,
    copy.adviceInternationalTitle,
  ];
  for (let bits = 0; bits < 8; bits++) {
    if (bits) await tree.getByRole("button", { name: "Start again" }).click();
    for (let i = 0; i < 3; i++)
      await tree
        .locator("fieldset")
        .nth(i)
        .getByRole("button", {
          name: bits & (1 << (2 - i)) ? "Yes" : "No",
          exact: true,
        })
        .click();
    await expect(tree.locator(".blog-decision-tree__result-title")).toHaveText(
      expected[bits],
    );
  }
  await page.locator(".blog-ds__next-article").click();
  await expect(page).toHaveURL(/\/en\/blog\/first-developer-job-guide$/);
});
test("la sauvegarde historique reste commune FR/EN, synchronisée et réinitialisable en anglais", async ({
  page,
  context,
}) => {
  await page.goto("/fr/blog/guide-premier-emploi-developpeur");
  await page.evaluate(() =>
    localStorage.setItem(
      "vd_guide_checklist_v1",
      JSON.stringify({ "chk-1": true, "chk-14": true }),
    ),
  );
  await page.reload();
  const checked = () => page.locator(".blog-ds__json-checklist input:checked");
  await expect(checked()).toHaveCount(2);
  await page.getByRole("button", { name: /Langue/ }).click();
  await page.locator('#locale-menu a[lang="en"]').click();
  await expect(page).toHaveURL(/first-developer-job-guide$/);
  await expect(checked()).toHaveCount(2);
  await expect(page.locator("progress")).toHaveAttribute("value", "2");
  await page.locator('[data-id="chk-7"]').focus();
  await page.keyboard.press("Space");
  await expect(checked()).toHaveCount(3);
  await page.goto("/fr/blog/guide-premier-emploi-developpeur");
  await expect(checked()).toHaveCount(3);
  const english = await context.newPage();
  await english.goto("/en/blog/first-developer-job-guide");
  await expect(english.locator("input:checked")).toHaveCount(3);
  english.once("dialog", async (d) => {
    expect(d.message()).toBe("Reset the entire checklist?");
    await d.dismiss();
  });
  await english.getByRole("button", { name: "Reset", exact: true }).click();
  await expect(english.locator("input:checked")).toHaveCount(3);
  english.once("dialog", (d) => d.accept());
  await english.getByRole("button", { name: "Reset", exact: true }).click();
  await expect(checked()).toHaveCount(0);
  expect(
    await english.evaluate(() => localStorage.getItem("vd_guide_checklist_v1")),
  ).toBe("{}");
  await english.close();
});
test("SEO anglais, hreflang et sitemap correspondent aux vraies traductions", async ({
  page,
  request,
  browser,
  baseURL,
}) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const pair of pairs) {
    await page.goto(`/en/blog/${pair.en}`);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `https://vincent.desbrosses.net/en/blog/${pair.en}`,
    );
    for (const locale of ["fr", "en"] as const)
      await expect(page.locator(`link[hreflang="${locale}"]`)).toHaveAttribute(
        "href",
        new RegExp(`/${locale}/blog/${pair[locale]}$`),
      );
    const schema = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((ns) =>
        ns
          .map((n) => JSON.parse(n.textContent!))
          .find((x) => x["@type"] === "BlogPosting"),
      );
    expect(schema.inLanguage).toBe("en");
    expect(schema.headline).toBe(pair.title);
    const image = await request.get(`/en/blog/${pair.en}/social-image`);
    expect(image.status()).toBe(200);
    expect(image.headers()["content-type"]).toContain("image/png");
    expect(sitemap).toContain(`/en/blog/${pair.en}`);
    const context = await browser.newContext({ javaScriptEnabled: false });
    const noJs = await context.newPage();
    await noJs.goto(`${baseURL}/en/blog/${pair.en}`);
    await expect(noJs.locator("h1")).toHaveText(pair.title);
    await expect(noJs.locator(".blog-ds__section")).toHaveCount(
      pair.en === "first-developer-job-guide" ? 11 : 5,
    );
    await context.close();
  }
});
