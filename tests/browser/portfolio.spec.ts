import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
for (const theme of ["light", "dark"]) {
  test(`responsive pages, keyboard, and accessibility (${theme})`, async ({
    page,
  }) => {
    await page.addInitScript((t) => localStorage.setItem("theme", t), theme);
    for (const route of [
      "/fr",
      "/en",
      "/fr/projets",
      "/en/projects/allaw",
      "/fr/projets/iconise",
      "/fr/blog",
      "/fr/blog/internationaliser-saas-lancement",
      "/fr/blog/guide-premier-emploi-developpeur",
      "/fr/nimporte-quoi",
    ]) {
      const response = await page.goto(route);
      expect(response?.status()).toBe(
        route.includes("nimporte-quoi") ? 404 : 200,
      );
      await expect(page.locator("main")).toHaveCount(1);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("html")).toHaveClass(new RegExp(theme));
      for (const width of [280, 390, 1440, 1920]) {
        await page.setViewportSize({ width, height: 1000 });
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth,
          ),
          `${route} at ${width}px`,
        ).toBe(true);
      }
      await page.setViewportSize({ width: 390, height: 844 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      const axe = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(
        axe.violations.filter((v) =>
          ["serious", "critical"].includes(v.impact ?? ""),
        ),
        JSON.stringify(axe.violations),
      ).toEqual([]);
      const ids = await page
        .locator("[id]")
        .evaluateAll((nodes) => nodes.map((n) => n.id));
      expect(new Set(ids).size).toBe(ids.length);
    }
  });
}
test("carousel accepts fast clicks, pauses, and exposes all studies", async ({
  page,
}) => {
  await page.goto("/fr");
  await expect(page.locator('a[href^="/fr/projets/"]')).toHaveCount(8);
  const tabs = page.getByRole("tab");
  await expect(tabs).toHaveCount(4);
  await page
    .getByRole("button", { name: "Projet suivant", exact: true })
    .click({ clickCount: 2, delay: 30 });
  await expect(tabs.nth(2)).toHaveAttribute("aria-selected", "true");
  await page
    .getByRole("button", { name: "Mettre en pause", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Reprendre le défilement" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await expect(page.locator("h1")).toBeVisible();
});
test("language switch and native archive dialog", async ({ page }) => {
  await page.goto("/fr/projets/iconise");
  await page
    .getByRole("navigation", { name: "Langue", exact: true })
    .getByRole("link", { name: "EN", exact: true })
    .click();
  await expect(page).toHaveURL(/\/en\/projects\/iconise$/);
  await page.goto("/fr/blog/internationaliser-saas-lancement");
  await expect(
    page
      .getByRole("navigation", { name: "Langue", exact: true })
      .getByRole("link", { name: "EN", exact: true }),
  ).toHaveCount(0);
  await page.goto("/fr/projets/archives");
  const trigger = page.locator('button[aria-haspopup="dialog"]').first();
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  for (let index = 0; index < 5; index++) {
    await page.keyboard.press("Tab");
    expect(
      await page.evaluate(() =>
        Boolean(document.activeElement?.closest("dialog")),
      ),
    ).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(trigger).toBeFocused();
});
test("hero and case study links are usable without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://localhost:3006/fr");
  await expect(page.locator("h1")).toBeVisible();
  expect(
    await page.locator('a[href^="/fr/projets/"]').count(),
  ).toBeGreaterThanOrEqual(7);
  expect(await page.locator("details").count()).toBe(5);
  await context.close();
});

test("mobile menu, footer links by keyboard, long FAQ and guide persistence", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/fr");
  const menu = page.getByRole("button", {
    name: "Ouvrir le menu",
    exact: true,
  });
  await menu.click();
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await expect(menu).toBeFocused();
  const footer = page.locator("footer");
  const email = footer.getByRole("link", { name: "Email", exact: true });
  const linkedin = footer.getByRole("link", { name: "LinkedIn", exact: true });
  await expect(footer.getByRole("link")).toHaveCount(2);
  await expect(email).toHaveAttribute("href", "mailto:vincedsb@gmail.com");
  await expect(linkedin).toHaveAttribute(
    "href",
    "https://www.linkedin.com/in/vincent-desbrosses/",
  );
  await expect(footer.locator('button, dialog, a[href^="tel:"]')).toHaveCount(
    0,
  );
  await email.focus();
  await expect(email).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(linkedin).toBeFocused();
  await expect(linkedin).toHaveCSS("outline-color", "rgb(244, 63, 94)");
  const faq = page.locator("details").first();
  await faq.evaluate((node) => {
    const content = node.querySelector("div")!;
    const paragraph = document.createElement("p");
    paragraph.style.height = "600px";
    paragraph.textContent = "Long answer";
    content.replaceChildren(paragraph);
  });
  await faq.locator("summary").click();
  expect(
    (await faq.locator("div").boundingBox())!.height,
  ).toBeGreaterThanOrEqual(600);
  await page.goto("/fr/blog/guide-premier-emploi-developpeur");
  const checkbox = page.locator(".checkbox-custom").first();
  await checkbox.check();
  await expect
    .poll(() =>
      page.evaluate(() => localStorage.getItem("vd_guide_checklist_v1")),
    )
    .toContain("true");
  await page.reload();
  await expect(checkbox).toBeChecked();
});

test("old resume links keep their permanent redirects", async ({ request }) => {
  for (const [oldPath, newPath] of [
    ["/CV%20Vincent%20DESBROSSES.pdf", "/cv-vincent-desbrosses-fr.pdf"],
    ["/Resume_Vincent_DESBROSSES.pdf", "/resume-vincent-desbrosses-en.pdf"],
  ]) {
    const response = await request.get(oldPath, { maxRedirects: 0 });
    expect(response.status()).toBe(308);
    expect(
      new URL(response.headers().location, "http://localhost:3006").pathname,
    ).toBe(newPath);
    expect((await request.get(newPath)).status()).toBe(200);
  }
});

test("unsupported locale reaches the themed root 404", async ({
  page,
  request,
}) => {
  expect((await request.get("/xx", { maxRedirects: 0 })).status()).toBe(404);
  await page.addInitScript(() => localStorage.setItem("theme", "dark"));
  await page.goto("/xx");
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect(
    page.getByRole("link", { name: "Accueil en français" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Home in English" }),
  ).toBeVisible();
});
