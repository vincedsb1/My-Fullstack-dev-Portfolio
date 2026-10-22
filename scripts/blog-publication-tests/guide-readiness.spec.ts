import { mkdirSync, readFileSync } from "node:fs";
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
const contract = JSON.parse(
  readFileSync("docs/blog/contracts/guide-content-v1.json", "utf8"),
);
const draft = "/fr/blog/json-preview?slug=guide-premier-emploi-migration";
test.beforeEach(() => {
  mkdirSync("tests/visual-artifacts", { recursive: true });
});
for (const theme of ["light", "dark"]) {
  test(`guide préparé : parité, copie et identité commune (${theme})`, async ({
    page,
  }) => {
    await page.addInitScript((t) => localStorage.setItem("theme", t), theme);
    const response = await page.goto(draft);
    expect(response?.status()).toBe(200);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
    const sections = await page
      .locator("#blog-article-body > .blog-ds__section")
      .evaluateAll((ns) =>
        ns.map((n) => {
          const c = n.cloneNode(true) as Element;
          c.querySelectorAll(
            ".blog-ds__section-number,.blog-ds__json-checklist-head,button,svg",
          ).forEach((x) => x.remove());
          return { id: n.id, text: c.textContent!.replace(/\s+/g, "") };
        }),
      );
    for (const [i, s] of Array.from(sections.entries()))
      expect(s.text, s.id).toBe(contract.sections[i].text.replace(/\s+/g, ""));
    const marks = await page
      .locator(
        ".blog-ds__section strong,.blog-ds__section em,.blog-ds__section code",
      )
      .evaluateAll((ns) =>
        ns
          .filter((n) => !n.closest(".blog-ds__code"))
          .map((n) => ({
            tag: n.tagName.toLowerCase(),
            text: n.textContent!.replace(/\s+/g, " ").trim(),
          })),
      );
    expect(marks).toEqual(contract.emphases);
    for (const width of [320, 390, 820, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await expect(page.locator("main")).toHaveCount(1);
      await expect(page.locator("h1")).toHaveCount(1);
      const dom = await page.evaluate(() => {
        const ids = Array.from(document.querySelectorAll("[id]")).map(
          (n) => n.id,
        );
        return {
          overflow: document.documentElement.scrollWidth > innerWidth,
          duplicates: ids.length !== new Set(ids).size,
        };
      });
      expect(dom).toEqual({ overflow: false, duplicates: false });
      const axe = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(axe.violations).toEqual([]);
      const styles = await page
        .locator(".blog-ds__hero-title")
        .evaluate((n) => {
          const s = getComputedStyle(n);
          return {
            font: s.fontFamily,
            size: s.fontSize,
            weight: s.fontWeight,
            color: s.color,
            lineHeight: s.lineHeight,
          };
        });
      await page.screenshot({
        path: `tests/visual-artifacts/blog-guide-preparation-${theme}-${width}.png`,
        fullPage: true,
        animations: "disabled",
      });
      await page.goto("/fr/blog/internationaliser-saas-lancement");
      expect(
        await page.locator(".blog-ds__hero-title").evaluate((n) => {
          const s = getComputedStyle(n);
          return {
            font: s.fontFamily,
            size: s.fontSize,
            weight: s.fontWeight,
            color: s.color,
            lineHeight: s.lineHeight,
          };
        }),
      ).toEqual(styles);
      await page.goto(draft);
    }
    await expect(
      page.locator(".blog-ds__byline-metadata time").nth(1),
    ).toHaveAttribute("dateTime", "2026-10-21");
    await page.evaluate(() => {
      (window as unknown as { copied: string }).copied = "";
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: {
          writeText: async (text: string) => {
            (window as unknown as { copied: string }).copied = text;
          },
        },
      });
    });
    for (const [id, text] of Object.entries(contract.copies)) {
      await page.locator(`#${id} button`).click();
      expect(
        await page.evaluate(
          () => (window as unknown as { copied: string }).copied,
        ),
      ).toBe(text);
    }
    expect(
      await page.evaluate(() => localStorage.getItem("vd_guide_checklist_v1")),
    ).toBeNull();
    await page.locator('[data-id="chk-1"]').check();
    expect(
      await page.evaluate(() => localStorage.getItem("vd_guide_checklist_v1")),
    ).toBeNull();
    await page.emulateMedia({ media: "print" });
    await expect(page.locator(".blog-ds__print-only")).toBeVisible();
    await page.pdf({
      path: `tests/visual-artifacts/blog-guide-preparation-${theme}.pdf`,
      format: "A4",
      printBackground: true,
    });
  });
}

test("régression développement : tableau valide et aucune erreur console au chargement et en navigation", async ({
  page,
  request,
}) => {
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/fr/blog/internationaliser-saas-lancement");
  await page.locator(".blog-ds__next-article").click();
  await expect(page).toHaveURL(/guide-premier-emploi-developpeur$/);
  await page.reload();
  await expect(page.locator("table")).toBeVisible();
  const image = await request.get(
    "/fr/blog/guide-premier-emploi-developpeur/social-image",
  );
  expect(image.status()).toBe(200);
  const { createHash } = await import("node:crypto");
  expect(
    createHash("sha256")
      .update(await image.body())
      .digest("hex"),
  ).toBe(contract.socialImageSha256);
  expect(
    await page
      .locator("table,thead,tbody,tr")
      .evaluateAll((ns) =>
        ns.every((n) =>
          Array.from(n.childNodes).every(
            (c) => c.nodeType === Node.ELEMENT_NODE,
          ),
        ),
      ),
  ).toBe(true);
  await page.locator('[data-id="chk-1"]').check();
  await expect(page.locator('[data-id="chk-1"]')).toBeChecked();
  await page.goto(draft);
  await page.locator('[data-id="chk-1"]').check();
  await page.locator(".blog-ds__next-article").click();
  await expect(page).toHaveURL(/internationaliser-saas-lancement$/);
  expect(errors).toEqual([]);
});
