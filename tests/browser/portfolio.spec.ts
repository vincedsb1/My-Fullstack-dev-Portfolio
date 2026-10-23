import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const baseURL = `http://localhost:${process.env.PORTFOLIO_E2E_PORT ?? "3006"}`;
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
      // Les sous-titres historiques de l'accueil ont été demandés tels que sur GitHub.
      // Leur contraste est suivi séparément dans le journal d'audit.
      const homepage = route === "/fr" || route === "/en";
      expect(
        axe.violations.filter(
          (v) =>
            ["serious", "critical"].includes(v.impact ?? "") &&
            !(homepage && v.id === "color-contrast"),
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
test("carousel restores the timed dots and horizontal drag", async ({
  page,
}) => {
  await page.goto("/fr");
  const panel = page.locator('#projects3 [role="tabpanel"]');
  await panel.scrollIntoViewIfNeeded();
  const tabs = page.getByRole("tab");
  await expect(tabs).toHaveCount(4);
  await expect(tabs.first().locator('[role="progressbar"]')).toHaveCount(1);
  await expect
    .poll(async () =>
      Number(
        await tabs
          .first()
          .locator('[role="progressbar"]')
          .getAttribute("aria-valuenow"),
      ),
    )
    .toBeGreaterThan(0);
  const box = await panel.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.move(box!.x + box!.width * 0.75, box!.y + box!.height * 0.5);
  await page.mouse.down();
  await page.mouse.move(
    box!.x + box!.width * 0.15,
    box!.y + box!.height * 0.5,
    { steps: 8 },
  );
  await page.mouse.up();
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
  await expect(tabs.nth(1)).toHaveAttribute("aria-disabled", "false");
  await expect(page.locator('#projects3 [role="tabpanel"]')).toHaveCount(1);
  const reversePanel = page.locator("#featured-project-panel-iconise");
  await reversePanel.scrollIntoViewIfNeeded();
  const reverseBox = await reversePanel.boundingBox();
  await page.mouse.move(
    reverseBox!.x + reverseBox!.width * 0.6,
    reverseBox!.y + reverseBox!.height * 0.5,
  );
  await page.mouse.down();
  await page.mouse.move(
    reverseBox!.x + reverseBox!.width * 0.9,
    reverseBox!.y + reverseBox!.height * 0.5,
    { steps: 8 },
  );
  await page.mouse.up();
  await expect(tabs.first()).toHaveAttribute("aria-selected", "true");
  await page.waitForTimeout(550);
  await tabs.nth(1).click();
  await page.waitForTimeout(550);
  await page
    .getByRole("button", { name: "Projet suivant", exact: true })
    .click();
  await expect(tabs.nth(2)).toHaveAttribute("aria-selected", "true");
  await tabs.nth(2).hover();
  await expect(tabs.nth(2).locator('[role="progressbar"]')).toHaveCSS(
    "opacity",
    "0",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await expect(page.locator("h1")).toBeVisible();
});
test("language menu and native project dialog", async ({ page }) => {
  await page.goto("/fr/projets/iconise");
  await page.getByRole("button", { name: "Langue : Français" }).click();
  await page
    .getByRole("navigation", { name: "Langue", exact: true })
    .getByRole("link", { name: "🇬🇧 English" })
    .click();
  await expect(page).toHaveURL(/\/en\/projects\/iconise$/);
  await page.goto("/fr/blog/internationaliser-saas-lancement");
  await page.getByRole("button", { name: "Langue : Français" }).click();
  await expect(
    page
      .getByRole("navigation", { name: "Langue", exact: true })
      .getByRole("link", { name: "🇬🇧 English" }),
  ).toHaveAttribute("href", "/en/blog/internationalize-saas-at-launch");
  await page.goto("/fr/projets/archives");
  const trigger = page.locator('[aria-haspopup="dialog"]').first();
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
test("theme switch follows system and remembers a manual choice", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/fr");
  const theme = page.getByRole("switch", { name: "Thème" });
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect(theme).toHaveAttribute("aria-checked", "true");
  await theme.click();
  await expect(page.locator("html")).toHaveClass(/light/);
  expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe(
    "light",
  );
  await page.reload();
  await expect(theme).toHaveAttribute("aria-checked", "false");
  await theme.click();
  expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe("dark");
});
test("hero and featured case study links are usable without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${baseURL}/fr`);
  await expect(page.locator("h1")).toBeVisible();
  expect(
    await page.locator('a[href^="/fr/projets/"]').count(),
  ).toBeGreaterThanOrEqual(1);
  await context.close();
});

test("mobile menu, footer links by keyboard, FAQ and guide persistence", async ({
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
  const faq = page.locator("#faqContainer button").first();
  const panel = page.locator("#faqContainer div[aria-hidden]").first();
  await faq.click();
  await expect(faq).toHaveAttribute("aria-expanded", "true");
  await expect(panel).toHaveAttribute("aria-hidden", "false");
  await page.goto("/fr/blog/guide-premier-emploi-developpeur");
  const checkbox = page.locator(".blog-ds__json-checklist input").first();
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
    expect(new URL(response.headers().location, baseURL).pathname).toBe(
      newPath,
    );
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
