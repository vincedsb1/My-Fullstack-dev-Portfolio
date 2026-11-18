import fs from "node:fs";
import path from "node:path";
import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import manifest from "../../src/content/career-strategy/bundle-manifest.json";
import { envelope } from "../../src/features/career-strategy/storage";
import { validateBundle } from "../../src/features/career-strategy/schema.mjs";
import type { Answers } from "../../src/features/career-strategy/types";
const slugs = {
  fr: "ia-emplois-intellectuels-preparer-avenir",
  en: "ai-knowledge-work-jobs-prepare-future",
};
const storageKey = "vd_ai_career_strategy_draft_v1";
const copy = {
  fr: {
    launch: "Commencer le questionnaire",
    welcome: "Prenez le temps de réfléchir à la suite",
    short: "Version courte",
    full: "Version approfondie",
    start: "Commencer",
    next: "Continuer",
    review: "Vérifier mes réponses",
    edit: "Modifier cette section",
    portrait: "Construire mon portrait",
    portraitTitle: "Votre portrait de préférences",
    strategies: "Voir mes pistes de stratégie",
    results: "Cinq pistes pour préparer la suite",
    save: "Enregistrer ma progression sur cet appareil",
    resume: "Reprendre ma progression",
    saved: "Progression enregistrée sur cet appareil.",
    conflict: "La sauvegarde a changé dans un autre onglet",
    keep: "Conserver et enregistrer ma saisie actuelle",
  },
  en: {
    launch: "Start the questionnaire",
    welcome: "Make time to think about what comes next",
    short: "Short version",
    full: "In-depth version",
    start: "Start",
    next: "Continue",
    review: "Review my answers",
    edit: "Edit this section",
    portrait: "Build my portrait",
    portraitTitle: "Your preferences portrait",
    strategies: "See my possible strategies",
    results: "Five directions to prepare for what comes next",
    save: "Save my progress on this device",
    resume: "Resume my progress",
    saved: "Progress saved on this device.",
    conflict: "Saved progress changed in another tab",
    keep: "Keep and save my current answers",
  },
};
async function open(page: Page, locale: "fr" | "en") {
  await page
    .getByRole("button", { name: copy[locale].launch, exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page
      .getByRole("dialog")
      .locator("[data-question]")
      .or(page.getByRole("heading", { name: copy[locale].welcome })),
  ).not.toHaveCount(0);
}
async function fillSection(page: Page, generic = false) {
  for (const field of await page.locator("dialog [data-question]").all()) {
    if (await field.locator('input[type="checkbox"]').count())
      await field.locator('input[type="checkbox"]').first().check();
    else
      await field
        .locator(`input[value="${generic ? "ne_sais_pas" : "tout_a_fait"}"]`)
        .check();
  }
}
for (const locale of ["fr", "en"] as const)
  for (const mode of ["short", "full"] as const) {
    test(`${locale} ${mode}: questionnaire, correction, portrait and five directions`, async ({
      page,
    }) => {
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
      expect(
        requests.filter((url) => /\/career-strategy\/.+\.json/.test(url)),
      ).toHaveLength(0);
      await open(page, locale);
      await expect(
        page.getByRole("button", { name: copy[locale].start, exact: true }),
      ).toBeDisabled();
      await page
        .getByRole("radio", { name: new RegExp(copy[locale][mode]) })
        .check();
      await page
        .getByRole("button", { name: copy[locale].start, exact: true })
        .click();
      await page
        .getByRole("button", { name: copy[locale].next, exact: true })
        .click();
      await expect(page.locator('dialog [role="alert"]')).toBeVisible();
      await expect(page.locator("dialog [data-question]")).toHaveCount(
        mode === "short" ? 5 : 10,
      );
      for (let i = 0; i < 8; i++) {
        await fillSection(page);
        if (i === 1) {
          const field = page.locator('[data-question="q015"]');
          await field.locator('input[type="checkbox"]').nth(1).check();
          await field.locator('input[type="checkbox"]').nth(2).click();
          await expect(
            field.locator('input[type="checkbox"]:checked'),
          ).toHaveCount(2);
        }
        await page
          .getByRole("button", { name: copy[locale].next, exact: true })
          .click();
      }
      await expect(
        page.getByRole("heading", { name: copy[locale].review, exact: true }),
      ).toBeVisible();
      await page.locator("dialog details").first().locator("summary").click();
      await page
        .getByRole("button", { name: copy[locale].edit, exact: true })
        .first()
        .click();
      await page
        .locator('[data-question="q001"] input[value="plutot_oui"]')
        .check();
      await page
        .getByRole("button", { name: copy[locale].next, exact: true })
        .click();
      await expect(
        page.getByRole("heading", { name: copy[locale].review, exact: true }),
      ).toBeVisible();
      await page
        .getByRole("button", { name: copy[locale].portrait, exact: true })
        .click();
      await expect(
        page.getByRole("heading", {
          name: copy[locale].portraitTitle,
          exact: true,
        }),
      ).toBeVisible();
      await expect(page.locator("[data-portrait-group]")).toHaveCount(9);
      const axe = await new AxeBuilder({ page })
        .include("dialog")
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(axe.violations).toEqual([]);
      await page
        .getByRole("button", { name: copy[locale].strategies, exact: true })
        .click();
      await expect(
        page.getByRole("heading", { name: copy[locale].results, exact: true }),
      ).toBeVisible();
      await expect(page.locator("[data-strategy]")).toHaveCount(5);
      await expect(page.locator("[data-strategy]").first()).toHaveAttribute(
        "data-strategy",
        "socle_financier",
      );
      await page.screenshot({
        path: `tests/visual-artifacts/career-${locale}-${mode}-results.png`,
      });
      expect(
        await page.evaluate((key) => localStorage.getItem(key), storageKey),
      ).toBeNull();
      await page.keyboard.press("Escape");
      await expect(page.getByRole("dialog")).not.toBeVisible();
      await expect(
        page.getByRole("button", { name: copy[locale].launch, exact: true }),
      ).toBeFocused();
      await page
        .getByRole("button", { name: copy[locale].launch, exact: true })
        .click();
      await expect(
        page.getByRole("heading", { name: copy[locale].results, exact: true }),
      ).toBeVisible();
      expect(errors).toEqual([]);
      expect(
        payloads.some((x) => x.includes("q001") || x.includes("tout_a_fait")),
      ).toBe(false);
      expect(
        requests.some((url) => /[?&](?:answers|q001|profile)=/.test(url)),
      ).toBe(false);
    });
  }
test("general fallback, local saving, language resume and deletion", async ({
  page,
}) => {
  await page.goto(`/fr/blog/${slugs.fr}`);
  await page.evaluate(() =>
    localStorage.setItem(
      "vd_guide_checklist_v1",
      JSON.stringify({ "chk-1": true }),
    ),
  );
  await open(page, "fr");
  await page.getByRole("radio", { name: /Version courte/ }).check();
  await page.getByRole("checkbox", { name: copy.fr.save, exact: true }).check();
  await expect(page.getByText(copy.fr.saved, { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Commencer", exact: true }).click();
  for (let i = 0; i < 8; i++) {
    await fillSection(page, true);
    await page.getByRole("button", { name: "Continuer", exact: true }).click();
  }
  await page
    .getByRole("button", { name: copy.fr.portrait, exact: true })
    .click();
  await page
    .getByRole("button", { name: copy.fr.strategies, exact: true })
    .click();
  await expect(page.locator("[data-strategy]")).toHaveCount(5);
  expect(
    await page
      .locator("[data-strategy]")
      .evaluateAll((es) => es.map((e) => e.getAttribute("data-strategy"))),
  ).toEqual([
    "socle_financier",
    "maintien_employabilite",
    "apprendre_ia",
    "reseau_confiance",
    "reconversion_progressive",
  ]);
  await page.reload();
  await open(page, "fr");
  await page.getByRole("button", { name: copy.fr.resume, exact: true }).click();
  await expect(
    page.getByRole("heading", { name: copy.fr.results }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await page.locator('button[aria-controls="locale-menu"]').click();
  await page.locator(`#locale-menu a[href="/en/blog/${slugs.en}"]`).click();
  await open(page, "en");
  await page.getByRole("button", { name: copy.en.resume, exact: true }).click();
  await expect(
    page.getByRole("heading", { name: copy.en.results }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Delete saved progress", exact: true })
    .click();
  expect(
    await page.evaluate((key) => localStorage.getItem(key), storageKey),
  ).toBeNull();
  await expect(
    page.getByRole("heading", { name: copy.en.results }),
  ).toBeVisible();
  expect(
    await page.evaluate(() => localStorage.getItem("vd_guide_checklist_v1")),
  ).toBe(JSON.stringify({ "chk-1": true }));
  await page.reload();
  await open(page, "en");
  await expect(
    page.getByRole("button", { name: copy.en.resume, exact: true }),
  ).toHaveCount(0);
});
test("saving conflicts do not overwrite another tab silently", async ({
  page,
  context,
}) => {
  await page.goto(`/fr/blog/${slugs.fr}`);
  await open(page, "fr");
  await page.getByRole("radio", { name: /Version courte/ }).check();
  await page.getByRole("button", { name: "Commencer", exact: true }).click();
  await page
    .locator('[data-question="q001"] input[value="plutot_oui"]')
    .check();
  await page.getByRole("checkbox", { name: copy.fr.save, exact: true }).check();
  const other = await context.newPage();
  await other.goto(`/en/blog/${slugs.en}`);
  await open(other, "en");
  await other
    .getByRole("button", { name: copy.en.resume, exact: true })
    .click();
  await expect(page.getByText(copy.fr.conflict, { exact: true })).toBeVisible();
  await other
    .locator('[data-question="q001"] input[value="pas_du_tout"]')
    .check();
  await page
    .locator('[data-question="q001"] input[value="tout_a_fait"]')
    .check();
  expect(
    await page.evaluate(
      (key) => JSON.parse(localStorage.getItem(key)!).draft.answers.q001,
      storageKey,
    ),
  ).toBe("pas_du_tout");
  await page.getByRole("button", { name: copy.fr.keep, exact: true }).click();
  expect(
    await page.evaluate(
      (key) => JSON.parse(localStorage.getItem(key)!).draft.answers.q001,
      storageKey,
    ),
  ).toBe("tout_a_fait");
  await expect(
    other.getByText(copy.en.conflict, { exact: true }),
  ).toBeVisible();
  await other.evaluate(
    (key) => localStorage.setItem(key, "{broken"),
    storageKey,
  );
  await expect(page.getByText(copy.fr.conflict, { exact: true })).toBeVisible();
  await page
    .locator('dialog [role="alert"]')
    .getByRole("button", { name: "Supprimer la sauvegarde", exact: true })
    .click();
  expect(
    await page.evaluate((key) => localStorage.getItem(key), storageKey),
  ).toBeNull();
  await expect(
    page.locator('[data-question="q001"] input[value="tout_a_fait"]'),
  ).toBeChecked();
  await other.close();
});
test("storage denial does not block the questionnaire", async ({ page }) => {
  await page.addInitScript((key) => {
    const get = Storage.prototype.getItem,
      set = Storage.prototype.setItem;
    Storage.prototype.getItem = function (name) {
      if (name === key) throw new Error("denied");
      return get.call(this, name);
    };
    Storage.prototype.setItem = function (name, value) {
      if (name === key) throw new Error("denied");
      return set.call(this, name, value);
    };
  }, storageKey);
  await page.goto(`/en/blog/${slugs.en}`);
  await open(page, "en");
  await page.getByRole("radio", { name: /Short version/ }).check();
  await page.getByRole("checkbox", { name: copy.en.save, exact: true }).check();
  await expect(page.getByText(/Saving is unavailable/)).toBeVisible();
  await page.getByRole("button", { name: "Start", exact: true }).click();
  await page
    .locator('[data-question="q001"] input[value="plutot_oui"]')
    .check();
  await expect(
    page.locator('[data-question="q001"] input[value="plutot_oui"]'),
  ).toBeChecked();
});
test("broken and expired drafts are explained; resource errors can be retried", async ({
  page,
}) => {
  let fail = true;
  await page.route("**/career-strategy/**/*.json", (route) =>
    fail
      ? route.fulfill({ status: 503, body: "unavailable" })
      : route.continue(),
  );
  await page.goto(`/en/blog/${slugs.en}`);
  await page.getByRole("button", { name: copy.en.launch, exact: true }).click();
  await expect(
    page.getByText(/questionnaire could not be loaded/),
  ).toBeVisible();
  fail = false;
  await page.getByRole("button", { name: "Try again", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: copy.en.welcome }),
  ).toBeVisible();
  await page.getByRole("radio", { name: /Short version/ }).check();
  await page.getByRole("checkbox", { name: copy.en.save, exact: true }).check();
  await page.evaluate((key) => {
    const saved = JSON.parse(localStorage.getItem(key)!);
    saved.savedAt = Date.now() - 31 * 86400000;
    saved.expiresAt = saved.savedAt + 30 * 86400000;
    localStorage.setItem(key, JSON.stringify(saved));
  }, storageKey);
  await page.reload();
  await open(page, "en");
  await expect(page.getByText(/saved progress expired/)).toBeVisible();
  await page.evaluate(
    (key) => localStorage.setItem(key, "{broken"),
    storageKey,
  );
  await page.reload();
  await open(page, "en");
  await expect(page.getByText(/incompatible or unreadable/)).toBeVisible();
});
test("FR/EN, four widths and two themes: real visual and accessibility review", async ({
  browser,
}) => {
  test.setTimeout(180000);
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
        const invitation = page.locator(
          '[data-module="career-strategy-assistant"]',
        );
        expect(
          await invitation.evaluate((e) => getComputedStyle(e).backgroundImage),
        ).not.toBe("none");
        await open(page, locale);
        await page.screenshot({
          path: path.join(dir, `${locale}-${theme}-${width}-welcome.png`),
        });
        await page
          .getByRole("radio", { name: new RegExp(copy[locale].short) })
          .check();
        await page
          .getByRole("button", { name: copy[locale].start, exact: true })
          .click();
        await page.screenshot({
          path: path.join(dir, `${locale}-${theme}-${width}-questions.png`),
        });
        expect(
          await page
            .getByRole("dialog")
            .evaluate((e) => e.scrollWidth <= e.clientWidth + 1),
        ).toBe(true);
        const axe = await new AxeBuilder({ page })
          .include("dialog")
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze();
        expect(axe.violations).toEqual([]);
        const bundle: unknown = JSON.parse(
          fs.readFileSync("public" + manifest.urls[locale], "utf8"),
        );
        validateBundle(bundle);
        const answers: Answers = Object.fromEntries(
          bundle.questionnaire.sections
            .flatMap((section) => section.questions)
            .map((q) => [
              q.id,
              q.type === "echelle" ? "tout_a_fait" : [q.options![0].id],
            ]),
        );
        const saved = envelope(
          bundle,
          {
            mode: "complet",
            answers,
            phase: "results",
            section: 7,
            returnToReview: false,
          },
          "visual-fixture",
        );
        await page.evaluate(
          ({ key, saved }) => localStorage.setItem(key, JSON.stringify(saved)),
          { key: storageKey, saved },
        );
        await page.reload();
        await open(page, locale);
        await page
          .getByRole("button", { name: copy[locale].resume, exact: true })
          .click();
        await expect(page.locator("[data-strategy]")).toHaveCount(5);
        await page.screenshot({
          path: path.join(dir, `${locale}-${theme}-${width}-results.png`),
        });
        expect(
          await page
            .locator('[data-strategy] [aria-hidden="true"]')
            .evaluateAll((es) =>
              es.every(
                (e) =>
                  e.getBoundingClientRect().height <=
                  parseFloat(getComputedStyle(e).lineHeight) +
                    parseFloat(getComputedStyle(e).paddingTop) +
                    parseFloat(getComputedStyle(e).paddingBottom) +
                    1,
              ),
            ),
        ).toBe(true);
        expect(
          await page
            .getByRole("dialog")
            .evaluate((e) => e.scrollWidth <= e.clientWidth + 1),
        ).toBe(true);
        const resultsAxe = await new AxeBuilder({ page })
          .include("dialog")
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze();
        expect(resultsAxe.violations).toEqual([]);
        await page.keyboard.press("Shift+Tab");
        expect(
          await page.evaluate(
            () => !!document.activeElement?.closest("dialog"),
          ),
        ).toBe(true);
        await page.keyboard.press("Escape");
        await expect(
          page.getByRole("button", { name: copy[locale].launch, exact: true }),
        ).toBeFocused();
        await page.goto(`/${locale}/blog`);
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
        await expect(page.locator("h1")).toHaveCount(1);
        await context.close();
      }
});

test("mode changes preserve shared answers, theme keeps the session, reset clears only this tool", async ({
  page,
}) => {
  await page.goto(`/fr/blog/${slugs.fr}`);
  await page.evaluate(() =>
    localStorage.setItem(
      "vd_guide_checklist_v1",
      JSON.stringify({ "chk-1": true }),
    ),
  );
  await open(page, "fr");
  await page.getByRole("radio", { name: /Version courte/ }).check();
  await page.getByRole("button", { name: "Commencer", exact: true }).click();
  await page
    .locator('[data-question="q001"] input[value="plutot_oui"]')
    .check();
  await page.getByRole("combobox").selectOption("complet");
  await expect(
    page.locator('[data-question="q001"] input[value="plutot_oui"]'),
  ).toBeChecked();
  await page
    .locator('[data-question="q006"] input[value="tout_a_fait"]')
    .check();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("combobox").selectOption("court");
  await expect(page.locator('[data-question="q006"]')).toHaveCount(0);
  await expect(
    page.locator('[data-question="q001"] input[value="plutot_oui"]'),
  ).toBeChecked();
  await page.getByRole("checkbox", { name: copy.fr.save, exact: true }).check();
  expect(
    await page.evaluate(
      (key) => JSON.parse(localStorage.getItem(key)!).draft.answers.q006,
      storageKey,
    ),
  ).toBeUndefined();
  await page.keyboard.press("Escape");
  await page.getByRole("switch", { name: "Thème", exact: true }).click();
  await page.getByRole("button", { name: copy.fr.launch, exact: true }).click();
  await expect(
    page.locator('[data-question="q001"] input[value="plutot_oui"]'),
  ).toBeChecked();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Recommencer", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: copy.fr.welcome }),
  ).toBeVisible();
  await expect(
    page.getByRole("radio", { name: /Version courte/ }),
  ).not.toBeChecked();
  expect(
    await page.evaluate((key) => localStorage.getItem(key), storageKey),
  ).toBeNull();
  expect(
    await page.evaluate(() => localStorage.getItem("vd_guide_checklist_v1")),
  ).toBe(JSON.stringify({ "chk-1": true }));
});
