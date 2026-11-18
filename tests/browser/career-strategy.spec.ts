import fs from "node:fs";
import path from "node:path";
import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const slugs = {
  fr: "ia-emplois-intellectuels-preparer-avenir",
  en: "ai-knowledge-work-jobs-prepare-future",
};
const copy = {
  fr: {
    launch: "Commencer le questionnaire",
    welcome: "Vos priorités de carrière",
    start: "Commencer les 30 questions",
    twist: "Bon… on va s’arrêter là.",
    twistCta: "Découvrir les 5 pistes",
    next: "Suivant",
    previous: "Précédent",
    pillars: [
      "Développer des compétences qui conservent de la valeur",
      "Construire progressivement un patrimoine",
      "Posséder une entreprise",
      "Créer des produits qui génèrent des revenus",
      "Construire une audience et un canal de distribution",
    ],
    conclusion: "Voilà. Pas besoin de 30 questions.",
    finish: "Terminer",
    close: "Fermer l’assistant",
  },
  en: {
    launch: "Start the questionnaire",
    welcome: "What matters most in your career?",
    start: "Start the 30 questions",
    twist: "Right… let’s stop there.",
    twistCta: "Discover the 5 directions",
    next: "Next",
    previous: "Previous",
    pillars: [
      "Develop skills that keep their value",
      "Gradually build wealth",
      "Own a business",
      "Create products that generate income",
      "Build an audience and a distribution channel",
    ],
    conclusion: "There you go. No need for 30 questions.",
    finish: "Finish",
    close: "Close the assistant",
  },
};
const heading = (page: Page, name: string) =>
  page.getByRole("dialog").getByRole("heading", { name, exact: true });
const button = (page: Page, name: string) =>
  page.getByRole("dialog").getByRole("button", { name, exact: true });
async function axe(page: Page) {
  const result = await new AxeBuilder({ page })
    .include("dialog")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(result.violations).toEqual([]);
}

for (const locale of ["fr", "en"] as const) {
  test(`${locale}: two questions, the twist, five pillars and the conclusion`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    const requests: string[] = [],
      payloads: string[] = [],
      errors: string[] = [];
    page.on("request", (r) => {
      requests.push(r.url());
      if (r.postData()) payloads.push(r.postData()!);
    });
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(`/${locale}/blog/${slugs[locale]}`, {
      waitUntil: "networkidle",
    });
    const c = copy[locale];
    const launch = page.getByRole("button", { name: c.launch, exact: true });
    await launch.click();
    const dialog = page.getByRole("dialog");
    await expect(heading(page, c.welcome)).toBeVisible();
    await button(page, c.start).click();

    // Question 1 keeps the questionnaire illusion, keyboard included.
    await expect(dialog.locator('[data-question="q001"]')).toBeVisible();
    await expect(dialog.getByText("1 / 30", { exact: true })).toBeVisible();
    await axe(page);
    await page.keyboard.press("5");
    await expect(dialog.locator('[data-question="q002"]')).toBeVisible();
    await expect(dialog.getByText("2 / 30", { exact: true })).toBeVisible();
    await page.keyboard.press("ArrowLeft");
    await expect(
      dialog.locator('[data-question="q001"] [data-answer="tout_a_fait"]'),
    ).toHaveAttribute("aria-pressed", "true");
    await dialog.locator('[data-answer="tout_a_fait"]').click();
    // Before the twist, a click outside must not lose the questionnaire.
    await page.mouse.click(1, 1);
    await expect(dialog).toBeVisible();
    await dialog.locator('[data-answer="ne_sais_pas"]').click();

    // The twist replaces question 3: no "3 / 30".
    await expect(heading(page, c.twist)).toBeFocused();
    await expect(dialog.locator('[data-story="twist"]')).toContainText("28");
    await expect(dialog.getByText("3 / 30", { exact: true })).toHaveCount(0);
    await expect(dialog.locator("[data-question]")).toHaveCount(0);
    await axe(page);
    await button(page, c.previous).click();
    await expect(
      dialog.locator('[data-question="q002"] [data-answer="ne_sais_pas"]'),
    ).toHaveAttribute("aria-pressed", "true");
    await dialog.locator('[data-answer="ne_sais_pas"]').click();
    await button(page, c.twistCta).click();

    for (let i = 0; i < c.pillars.length; i++) {
      const title = c.pillars[i];
      await expect(heading(page, title)).toBeFocused();
      await expect(
        dialog.getByText(`${i + 1} / 5`, { exact: true }),
      ).toBeVisible();
      await expect(dialog.locator("[data-story] li")).toHaveCount(2);
      if (i === 0) await axe(page);
      if (i === 2) {
        await page.keyboard.press("ArrowLeft");
        await expect(heading(page, c.pillars[1])).toBeFocused();
        await page.keyboard.press("ArrowRight");
        await expect(heading(page, title)).toBeFocused();
      }
      await button(page, c.next).click();
    }

    await expect(heading(page, c.conclusion)).toBeFocused();
    await axe(page);
    await button(page, c.finish).click();
    await expect(dialog).not.toBeVisible();
    await expect(launch).toBeFocused();

    // Finishing starts the journey again from the welcome screen.
    await launch.click();
    await expect(heading(page, c.welcome)).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();

    // From the twist onwards, a click outside closes the dialog; the position is kept.
    await launch.click();
    await button(page, c.start).click();
    await page.keyboard.press("3");
    await page.keyboard.press("3");
    await expect(heading(page, c.twist)).toBeVisible();
    await page.mouse.click(1, 1);
    await expect(dialog).not.toBeVisible();
    await launch.click();
    await expect(heading(page, c.twist)).toBeVisible();
    await button(page, c.close).click();
    await expect(dialog).not.toBeVisible();
    await expect(launch).toBeFocused();

    expect(errors).toEqual([]);
    expect(
      payloads.some((x) => /q00[12]|tout_a_fait|ne_sais_pas/.test(x)),
    ).toBe(false);
    expect(requests.some((url) => /career-strategy\/.+\.json/.test(url))).toBe(
      false,
    );
    expect(
      await page.evaluate(() =>
        [...Object.keys(localStorage), ...Object.keys(sessionStorage)].filter(
          (key) => /career|strategy|answer/i.test(key),
        ),
      ),
    ).toEqual([]);
  });
}

test("FR/EN, four widths and two themes: narrative screens fit and stay accessible", async ({
  browser,
}) => {
  test.setTimeout(240000);
  const dir = "tests/visual-artifacts/career-assistant";
  fs.mkdirSync(dir, { recursive: true });
  for (const locale of ["fr", "en"] as const)
    for (const theme of ["light", "dark"] as const)
      for (const width of [320, 390, 820, 1440]) {
        const context = await browser.newContext({
          viewport: { width, height: 950 },
          colorScheme: theme,
          reducedMotion: "reduce",
        });
        await context.addInitScript(
          (value) => localStorage.setItem("theme", value),
          theme,
        );
        const page = await context.newPage();
        await page.goto(`/${locale}/blog/${slugs[locale]}`);
        const c = copy[locale];
        await page.getByRole("button", { name: c.launch, exact: true }).click();
        await button(page, c.start).click();
        await page.screenshot({
          path: path.join(dir, `${locale}-${theme}-${width}-question.png`),
        });
        await page.keyboard.press("4");
        await page.keyboard.press("4");
        await expect(heading(page, c.twist)).toBeVisible();
        await page.screenshot({
          path: path.join(dir, `${locale}-${theme}-${width}-twist.png`),
        });
        await button(page, c.twistCta).click();
        for (let i = 0; i < c.pillars.length; i++) {
          expect(
            await page
              .getByRole("dialog")
              .evaluate((e) => e.scrollWidth <= e.clientWidth + 1),
          ).toBe(true);
          if (i === 0 || i === 4)
            await page.screenshot({
              path: path.join(
                dir,
                `${locale}-${theme}-${width}-pillar-${i + 1}.png`,
              ),
            });
          if (i === 4) await axe(page);
          await button(page, c.next).click();
        }
        await expect(heading(page, c.conclusion)).toBeVisible();
        await page.screenshot({
          path: path.join(dir, `${locale}-${theme}-${width}-conclusion.png`),
        });
        await axe(page);
        await context.close();
      }
});
