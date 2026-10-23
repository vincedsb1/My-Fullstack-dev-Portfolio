import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("un fichier JSON suffit à publier les pages FR/EN avec leur interface et SEO", async ({
  page,
  browser,
  baseURL,
}) => {
  for (const locale of ["fr", "en"]) {
    const response = await page.goto(`/${locale}/blog/audit-json-${locale}`);
    expect(response?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      new RegExp(`/${locale}/blog/audit-json-${locale}$`),
    );
    await expect(page.locator('link[hreflang="fr"]')).toHaveAttribute(
      "href",
      /audit-json-fr$/,
    );
    await expect(page.locator('link[hreflang="en"]')).toHaveAttribute(
      "href",
      /audit-json-en$/,
    );
    const headings = await page
      .locator("main :is(h1,h2,h3,h4)")
      .evaluateAll((nodes) =>
        nodes.map((node) => Number(node.tagName.slice(1))),
      );
    expect(
      headings.every(
        (level, index) => index === 0 || level <= headings[index - 1] + 1,
      ),
    ).toBe(true);
    if (locale === "en") {
      await expect(
        page.getByRole("button", { name: "Print the page or save as PDF" }),
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Reset", exact: true }),
      ).toBeDisabled();
      await expect(
        page.getByRole("link", { name: /View my projects/ }),
      ).toBeVisible();
      await expect(page.locator("main")).not.toContainText(
        "Développeur Fullstack",
      );
    } else {
      await expect(
        page.locator('main a[href="/fr/projets/iconise"]'),
      ).toHaveCount(1);
      await expect(
        page.locator(
          'main a[href="/fr/blog/internationaliser-saas-lancement"]',
        ),
      ).toHaveCount(1);
    }
    for (const theme of ["light", "dark"]) {
      await page.evaluate(
        (value) =>
          document.documentElement.classList.toggle("dark", value === "dark"),
        theme,
      );
      await expect(page.locator("body > header")).toHaveCSS(
        "color",
        theme === "dark" ? "rgb(250, 250, 250)" : "rgb(23, 23, 23)",
      );
      const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(result.violations).toEqual([]);
    }
  }
  const noJs = await browser.newContext({ javaScriptEnabled: false });
  const pageNoJs = await noJs.newPage();
  await pageNoJs.goto(`${baseURL}/fr/blog/audit-json-fr`);
  await expect(pageNoJs.locator("h1")).toHaveText(
    "Fixture technique de publication JSON",
  );
  await expect(pageNoJs.locator("#publication")).toContainText("JSON → React");
  await noJs.close();
});

test("aller-retour entre checklist historique et nouveau composant sans perte", async ({
  page,
}) => {
  await page.goto("/fr/blog/json-legacy-audit");
  await page.locator('[data-id="chk-1"]').check();
  await page.locator('[data-id="chk-14"]').check();
  await page.goto("/fr/blog/guide-premier-emploi-developpeur");
  await expect(page.locator("input:checked")).toHaveCount(2);
  await expect(page.locator("progress")).toHaveAttribute("value", "2");
  await page.locator('[data-id="chk-7"]').check();
  await page.goto("/fr/blog/json-legacy-audit");
  await expect(page.locator(".checkbox-custom:checked")).toHaveCount(3);
  await expect(page.locator('[data-id="chk-7"]')).toBeChecked();
  await page.goto("/fr/blog/guide-premier-emploi-developpeur");
  page.once("dialog", (dialog) => dialog.dismiss());
  await page.getByRole("button", { name: "Réinitialiser" }).click();
  await expect(page.locator("input:checked")).toHaveCount(3);
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Réinitialiser" }).click();
  expect(
    await page.evaluate(() => localStorage.getItem("vd_guide_checklist_v1")),
  ).toBe("{}");
  await page.goto("/fr/blog/json-legacy-audit");
  await expect(page.locator(".checkbox-custom:checked")).toHaveCount(0);
});
