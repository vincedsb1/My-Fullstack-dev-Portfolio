import { mkdirSync, readFileSync } from "node:fs";
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import customContracts from "../../src/lib/blog/json-custom-modules.json";

const routes = [
  "showcase",
  "internationaliser-saas-lancement",
  "guide-premier-emploi-developpeur",
];
const contract = JSON.parse(
  readFileSync("docs/blog/contracts/guide-checklist-v1.json", "utf8"),
) as { storageKey: string; items: Array<{ id: string; label: string }> };

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  // Les requêtes vidéo restent opt-in ; le test ne dépend pas du réseau YouTube.
  await page.route("https://i.ytimg.com/**", (route) =>
    route.fulfill({
      contentType: "image/svg+xml",
      body: readFileSync("public/blog/json-demo-blog/structure.svg"),
    }),
  );
});

async function domContract(page: Page) {
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("main")).toHaveCount(1);
  const state = await page.evaluate(() => {
    const ids = Array.from(document.querySelectorAll("[id]")).map(
      (node) => node.id,
    );
    return {
      duplicate: ids.filter((id, index) => ids.indexOf(id) !== index),
      missing: Array.from(
        document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'),
      )
        .map((node) => node.getAttribute("href")!)
        .filter(
          (href) =>
            href.length > 1 &&
            !document.getElementById(decodeURIComponent(href.slice(1))),
        ),
      overflow: document.documentElement.scrollWidth > innerWidth,
    };
  });
  expect(state).toEqual({ duplicate: [], missing: [], overflow: false });
}

for (const theme of ["light", "dark"] as const) {
  test(`contrats DOM, responsive et accessibilité des trois pages (${theme})`, async ({
    page,
  }) => {
    test.setTimeout(180000);
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.addInitScript(
      (value) => localStorage.setItem("theme", value),
      theme,
    );
    for (const route of routes) {
      await page.goto(`/fr/blog/${route}`);
      await expect(page.locator("html")).toHaveClass(new RegExp(theme));
      for (const width of [320, 390, 820, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        await domContract(page);
        if (width === 390 || width === 1440) {
          const result = await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
            .analyze();
          expect(result.violations, `${route}, ${theme}, ${width}`).toEqual([]);
        }
      }
      if (route === "showcase") {
        await page.locator("#fondations .blog-ds__accordion summary").click();
        const expanded = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze();
        expect(expanded.violations).toEqual([]);
      }
    }
    expect(errors).toEqual([]);
  });
}

for (const route of ["showcase", "internationaliser-saas-lancement"]) {
  test(`cinq widgets réels : souris, clavier et huit décisions (${route})`, async ({
    page,
  }) => {
    await page.goto(`/fr/blog/${route}`);
    if (route === "showcase") {
      for (const host of await page.locator("[data-module]").all()) {
        const name = (await host.getAttribute(
          "data-module",
        )) as keyof typeof customContracts;
        const actual = await host
          .locator("[id]")
          .evaluateAll((nodes) => nodes.map((node) => node.id).sort());
        expect(actual, name).toEqual([...customContracts[name].ids].sort());
      }
    }
    await expect(page.locator(".blog-language-mosaic__tile")).toHaveCount(6);
    const demo = page.locator(".blog-language-demo");
    await demo.locator("select").first().focus();
    await demo.locator("select").first().selectOption("en");
    await demo.locator("select").nth(1).selectOption("ja");
    await expect(demo.locator(".blog-language-demo__preview")).toHaveAttribute(
      "lang",
      "en",
    );
    await expect(
      demo.locator(".blog-language-demo__direction strong"),
    ).toHaveText("創造的な勢い");
    const matrix = page.locator(".blog-language-matrix");
    await expect(matrix.locator("tbody td")).toHaveCount(36);
    await expect(matrix.locator('[aria-pressed="true"]')).toHaveCount(1);
    await matrix.locator('[aria-pressed="true"]').focus();
    await page.keyboard.press("End");
    await expect(matrix.locator('[aria-pressed="true"]')).toBeFocused();
    await expect(
      matrix.locator(".blog-language-matrix__selection strong"),
    ).toHaveText("日本語 / 日本語");
    await page.keyboard.press("Home");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowDown");
    await expect(
      matrix.locator(".blog-language-matrix__selection strong"),
    ).toHaveText("English / English");
    await expect(matrix.locator('button[tabindex="0"]')).toHaveCount(1);
    await expect(page.locator(".blog-funnel__stage")).toHaveCount(4);
    await expect(
      page.getByText(
        "Schéma conceptuel : les largeurs ne représentent pas des taux réels.",
      ),
    ).toBeVisible();
    const decision = page.locator(".blog-decision-tree");
    for (let mask = 0; mask < 8; mask++) {
      const answers = [Boolean(mask & 4), Boolean(mask & 2), Boolean(mask & 1)];
      for (const [index, answer] of Array.from(answers.entries())) {
        const button = decision
          .locator("fieldset")
          .nth(index)
          .getByRole("button", { name: answer ? "Oui" : "Non", exact: true });
        await button.focus();
        await page.keyboard.press("Space");
        await expect(button).toHaveAttribute("aria-pressed", "true");
      }
      const [international, demand, capacity] = answers;
      const expected =
        international && capacity
          ? "Plusieurs langues peuvent se justifier dès le lancement."
          : demand && capacity
          ? "Commence par les marchés qui montrent déjà un signal."
          : demand || international
          ? "Prépare l’architecture, puis élargis progressivement."
          : "Garde une ou deux langues et valide la demande.";
      await expect(
        decision.locator(".blog-decision-tree__result-title"),
      ).toHaveText(expected);
    }
    await decision.getByRole("button", { name: "Recommencer" }).click();
    await expect(decision.locator('[aria-pressed="true"]')).toHaveCount(0);
  });
}

test("checklist JSON : restauration, sauvegarde, autre onglet et reset", async ({
  page,
  context,
}) => {
  const key = "vd_blog_json_showcase_v1";
  await page.addInitScript(() =>
    localStorage.setItem(
      "vd_blog_json_showcase_v1",
      '{"step-1":true,"step-3":true}',
    ),
  );
  await page.goto("/fr/blog/showcase");
  const checklist = page.locator("#interactions .blog-ds__json-checklist");
  await expect(checklist.locator(":checked")).toHaveCount(2);
  await checklist.locator('[data-id="step-2"]').check();
  expect(
    await page.evaluate(
      (value) => JSON.parse(localStorage.getItem(value)!),
      key,
    ),
  ).toEqual({ "step-1": true, "step-2": true, "step-3": true });
  const other = await context.newPage();
  await other.goto("/fr/blog/showcase");
  await other.evaluate(
    (value) => localStorage.setItem(value, '{"step-2":true}'),
    key,
  );
  await expect(checklist.locator(":checked")).toHaveCount(1);
  await expect(checklist.locator("progress")).toHaveAttribute("value", "1");
  await checklist.getByRole("button", { name: "Réinitialiser" }).click();
  expect(await page.evaluate((value) => localStorage.getItem(value), key)).toBe(
    "{}",
  );
  await expect(other.locator("#interactions input:checked")).toHaveCount(0);
  await other.close();
});

test("checklist utilisable avec données corrompues ou stockage refusé", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const get = Storage.prototype.getItem;
    const set = Storage.prototype.setItem;
    Storage.prototype.getItem = function (key) {
      return key === "vd_blog_json_showcase_v1"
        ? "invalid-json"
        : get.call(this, key);
    };
    Storage.prototype.setItem = function (key, value) {
      if (key === "vd_blog_json_showcase_v1")
        throw new DOMException("Blocked", "SecurityError");
      set.call(this, key, value);
    };
  });
  await page.goto("/fr/blog/showcase");
  const checklist = page.locator("#interactions .blog-ds__json-checklist");
  await expect(checklist.locator(":checked")).toHaveCount(0);
  await checklist.locator("input").first().check();
  await expect(checklist.locator(":checked")).toHaveCount(1);
  await expect(checklist.getByRole("status")).toContainText(
    "Le stockage est indisponible",
  );
  await checklist.getByRole("button", { name: "Réinitialiser" }).click();
  await expect(checklist.locator(":checked")).toHaveCount(0);
});

test("sommaire clavier, copie exacte, vidéo au clic et impression lisible", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/fr/blog/showcase");
  const summary = page.locator(".blog-ds__toc-mobile > summary");
  await summary.focus();
  await page.keyboard.press("Enter");
  const anchor = page
    .locator(".blog-ds__toc-mobile")
    .getByRole("link", { name: /Un texte lisible/ });
  await anchor.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#structure")).toBeFocused();
  const code = page
    .locator('.blog-ds__code[data-language="typescript"]')
    .first();
  await code.getByRole("button", { name: "Copier", exact: true }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    await code.locator("code").textContent(),
  );
  await page.evaluate(() =>
    Object.defineProperty(navigator, "share", {
      value: undefined,
      configurable: true,
    }),
  );
  await page.locator(".blog-ds__toolbar button").last().click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    page.url(),
  );
  await expect(code.locator('[style*="--shiki-light"]')).not.toHaveCount(0);
  const video = page.locator(".blog-ds__video");
  await expect(video.locator("iframe")).toHaveCount(0);
  await page.route("https://www.youtube-nocookie.com/**", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<title>Test vidéo</title>",
    }),
  );
  await video.getByRole("button", { name: /Lire/ }).click();
  await expect(video.locator("iframe")).toHaveAttribute(
    "src",
    /youtube-nocookie\.com\/embed\/jNQXAC9IVRw/,
  );
  const accordion = page.locator(".blog-ds__accordion details").first();
  await accordion.locator("summary").focus();
  await page.keyboard.press("Space");
  await expect(accordion).toHaveAttribute("open", "");
  for (const theme of ["light", "dark"]) {
    await page.evaluate((value) => {
      document.documentElement.classList.toggle("dark", value === "dark");
    }, theme);
    await page.evaluate(() => window.dispatchEvent(new Event("beforeprint")));
    await page.emulateMedia({ media: "print" });
    await expect(page.locator("body > header")).toBeHidden();
    await expect(page.locator("body > footer")).toBeHidden();
    await expect(page.locator(".blog-ds__reading-progress")).toBeHidden();
    await expect(page.locator("html")).toHaveCSS("color-scheme", "light");
    await expect(video.locator("iframe")).toBeHidden();
    await expect(video.locator("figcaption")).toBeVisible();
    await expect(page.locator(".blog-ds")).toHaveCSS(
      "background-color",
      "rgb(255, 255, 255)",
    );
    await expect(page.locator(".blog-ds__hero-title")).toHaveCSS(
      "color",
      "rgb(23, 23, 23)",
    );
    expect(
      await page.locator(".blog-ds__accordion details:not([open])").count(),
    ).toBe(0);
    mkdirSync("tests/visual-artifacts", { recursive: true });
    await page.pdf({
      path: `tests/visual-artifacts/blog-showcase-print-${theme}.pdf`,
      format: "A4",
      printBackground: true,
    });
    await page.evaluate(() => window.dispatchEvent(new Event("afterprint")));
    await page.emulateMedia({ media: "screen" });
    await expect(accordion).toHaveAttribute("open", "");
    await expect(page.locator(".blog-ds__accordion details[open]")).toHaveCount(
      1,
    );
  }
});

test("le guide restaure les 14 cases et le format historique sans réattribuer les IDs", async ({
  page,
}) => {
  const saved = Object.fromEntries(
    contract.items.map((item) => [item.id, true]),
  );
  await page.addInitScript(
    ({ key, value }) => localStorage.setItem(key, JSON.stringify(value)),
    { key: contract.storageKey, value: saved },
  );
  await page.goto("/fr/blog/guide-premier-emploi-developpeur");
  await expect(page.locator(".checkbox-custom:checked")).toHaveCount(14);
  await expect(page.locator("#checklist-progress-text")).toHaveText(
    "14/14 étapes terminées",
  );
  for (const item of contract.items)
    await expect(
      page.locator(`label:has([data-id="${item.id}"])`),
    ).toContainText(item.label);
  const last = page.locator('[data-id="chk-14"]');
  await last.uncheck();
  expect(
    await page.evaluate(
      (key) => JSON.parse(localStorage.getItem(key)!),
      contract.storageKey,
    ),
  ).toEqual(
    Object.fromEntries(
      contract.items.slice(0, 13).map((item) => [item.id, true]),
    ),
  );
});

test("captures des états focus, hover, variantes ouvertes et résultat métier", async ({
  page,
}) => {
  mkdirSync("tests/visual-artifacts", { recursive: true });
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const theme of ["light", "dark"]) {
    await page.addInitScript(
      (value) => localStorage.setItem("theme", value),
      theme,
    );
    await page.goto("/fr/blog/showcase");
    await expect(page.locator("html")).toHaveClass(new RegExp(theme));
    const matrix = page.locator('[data-module="saas-language-matrix"]');
    await matrix.locator('[aria-pressed="true"]').focus();
    await page.keyboard.press("End");
    await matrix.screenshot({
      path: `tests/visual-artifacts/blog-state-matrix-focus-${theme}.png`,
      animations: "disabled",
    });
    const decision = page.locator('[data-module="saas-decision-tree"]');
    for (const question of await decision.locator("fieldset").all())
      await question.getByRole("button", { name: "Oui", exact: true }).click();
    await decision.screenshot({
      path: `tests/visual-artifacts/blog-state-decision-${theme}.png`,
      animations: "disabled",
    });
    const variants = page.locator("#fondations .blog-ds__accordion");
    await variants.locator("summary").click();
    await variants.screenshot({
      path: `tests/visual-artifacts/blog-state-variants-${theme}.png`,
      animations: "disabled",
    });
    await page.locator(".blog-ds__hero .blog-ds__button").hover();
    await page.locator(".blog-ds__hero").screenshot({
      path: `tests/visual-artifacts/blog-state-hero-hover-${theme}.png`,
      animations: "disabled",
    });
  }
});

test("impression des articles historiques lisible dans les deux thèmes", async ({
  page,
}) => {
  mkdirSync("tests/visual-artifacts", { recursive: true });
  for (const theme of ["light", "dark"]) {
    await page.addInitScript(
      (value) => localStorage.setItem("theme", value),
      theme,
    );
    for (const slug of [
      "internationaliser-saas-lancement",
      "guide-premier-emploi-developpeur",
    ]) {
      await page.goto(`/fr/blog/${slug}`);
      await expect(page.locator("html")).toHaveClass(new RegExp(theme));
      await page.emulateMedia({ media: "print" });
      await expect(page.locator("body > header")).toBeHidden();
      await expect(page.locator("html")).toHaveCSS("color-scheme", "light");
      await expect(page.locator("body > footer")).toBeHidden();
      await expect(page.locator("body > .skip-link")).toBeHidden();
      await expect(page.locator("body")).toHaveCSS(
        "background-color",
        "rgb(255, 255, 255)",
      );
      const titleContrast = await page.locator("h1").evaluate((node) => {
        const rgb = getComputedStyle(node)
          .color.match(/\d+/g)!
          .slice(0, 3)
          .map((value) => Number(value) / 255);
        const linear = rgb.map((value) =>
          value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
        );
        return (
          1.05 /
          (linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722 + 0.05)
        );
      });
      expect(titleContrast).toBeGreaterThanOrEqual(7);
      await page.pdf({
        path: `tests/visual-artifacts/blog-print-${slug}-${theme}.pdf`,
        format: "A4",
        printBackground: true,
      });
      await page.emulateMedia({ media: "screen" });
    }
  }
});
