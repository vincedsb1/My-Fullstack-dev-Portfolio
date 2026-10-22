import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

const baseline = JSON.parse(
  readFileSync("docs/blog/contracts/internationaliser-saas-v1.json", "utf8"),
);
const preview = process.env.BLOG_SAAS_PREVIEW === "1";
const route = preview
  ? "/fr/blog/json-preview?slug=internationaliser-saas-lancement"
  : "/fr/blog/internationaliser-saas-lancement";

for (const theme of ["light", "dark"]) {
  test(`SaaS JSON : parité éditoriale du rendu et navigation (${theme})`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addInitScript(
      (value) => localStorage.setItem("theme", value),
      theme,
    );
    expect((await page.goto(route))?.status()).toBe(200);
    const actual = await page.locator("#blog-article-body").evaluate((body) => {
      const clean = (n: Node) => n.textContent!.replace(/\s+/g, " ").trim();
      function spans(el: Node): Array<Record<string, unknown>> {
        return Array.from(el.childNodes).flatMap<Record<string, unknown>>(
          (n) => {
            if (n.nodeType === Node.TEXT_NODE)
              return n.textContent ? [{ text: n.textContent }] : [];
            const element = n as Element;
            return spans(element).map((s) => ({
              ...s,
              ...(element.tagName === "STRONG" ? { bold: true } : {}),
              ...(element.tagName === "CODE" ? { code: true } : {}),
              ...(element.tagName === "A"
                ? { link: { href: element.getAttribute("href") } }
                : {}),
            }));
          },
        );
      }
      function block(n: Element): Record<string, unknown> {
        if (n.matches("[data-module]"))
          return {
            kind: "module",
            name: n.getAttribute("data-module"),
            text: clean(n),
          };
        if (n.matches("p")) return { kind: "paragraph", spans: spans(n) };
        if (n.matches("ul"))
          return { kind: "list", items: Array.from(n.children).map(spans) };
        if (n.matches("blockquote"))
          return { kind: "highlight", spans: spans(n) };
        throw new Error(`Bloc sans contrôle de parité : ${n.tagName}`);
      }
      return [
        ...Array.from(body.querySelector(".blog-ds__json-intro")!.children).map(
          block,
        ),
        ...Array.from(
          body.querySelectorAll(":scope > .blog-ds__section"),
        ).flatMap((s) => [
          { kind: "anchor", id: s.id },
          { kind: "heading", text: clean(s.querySelector("h2")!) },
          ...Array.from(s.children).slice(1).map(block),
        ]),
      ];
    });
    expect(actual).toEqual(baseline.content);
    await expect(page.locator("h1")).toHaveText(baseline.metadata.title);
    await expect(page.locator(".blog-ds__byline-metadata")).toContainText(
      "4 min de lecture",
    );
    await expect(
      page.locator(".blog-ds__hero-visual [data-highlight]"),
    ).toHaveCount(12);
    await expect(page.locator(".blog-ds__author-card")).toContainText(
      "Je conçois des applications web et partage les réflexions qui accompagnent leur création.",
    );
    await expect(page.locator(".blog-ds__json-after")).toHaveText(
      "La suite se mesure.",
    );
    for (const href of baseline.links as string[]) {
      if (href.startsWith("#")) await expect(page.locator(href)).toHaveCount(1);
      else
        expect(
          await page
            .locator("main a")
            .evaluateAll(
              (nodes, target) =>
                nodes.some((n) => n.getAttribute("href") === target),
              href,
            ),
          href,
        ).toBe(true);
    }
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const section of baseline.content.filter(
        (x: { kind: string }) => x.kind === "anchor",
      )) {
        if (width === 390)
          await page.locator(".blog-ds__toc-mobile summary").click();
        const link = page
          .locator(
            width === 390
              ? ".blog-ds__toc-mobile a"
              : ".blog-ds__toc-desktop a",
          )
          .filter({
            hasText:
              baseline.content[
                baseline.content.findIndex(
                  (x: { id: string }) => x.id === section.id,
                ) + 1
              ].text,
          });
        await expect(link).toBeVisible();
        await link.focus();
        await expect(link).toBeFocused();
        await page.keyboard.press("Enter");
        await expect(page).toHaveURL(new RegExp(`#${section.id}$`));
        await expect(page.locator(`#${section.id}`)).toBeFocused();
        const top = await page
          .locator(`#${section.id}`)
          .evaluate((n) => n.getBoundingClientRect().top);
        expect(top).toBeGreaterThanOrEqual(70);
        expect(top).toBeLessThan(220);
      }
    }
  });
}

test("SaaS JSON : SEO pré-rendu identique au MDX et image sociale inchangée", async ({
  page,
  request,
}) => {
  test.skip(
    preview,
    "La prévisualisation porte volontairement noindex et ne publie pas les métadonnées de l’article",
  );
  await page.goto(route);
  const seo = await page.evaluate(() => ({
    title: document.title,
    meta: Array.from(
      document.head.querySelectorAll(
        'meta[name],meta[property],link[rel="canonical"],link[rel="alternate"]',
      ),
    ).map((n) =>
      Object.fromEntries(
        Array.from(n.attributes).map((a) => [a.name, a.value]),
      ),
    ),
    jsonLd: Array.from(
      document.querySelectorAll('script[type="application/ld+json"]'),
    ).map((n) => JSON.parse(n.textContent!)),
  }));
  const sorted = (items: Array<Record<string, string>>) =>
    items
      .map((n) => JSON.stringify(Object.fromEntries(Object.entries(n).sort())))
      .sort();
  expect(seo.title).toBe(baseline.seo.title);
  expect(sorted(seo.meta)).toEqual(sorted(baseline.seo.meta));
  expect(seo.jsonLd).toEqual(baseline.seo.jsonLd);
  const image = await request.get(`${route}/social-image`);
  expect(image.status()).toBe(200);
  // Le générateur reçoit les mêmes métadonnées ; la référence garde aussi le hash PNG original.
  const { createHash } = await import("node:crypto");
  expect(
    createHash("sha256")
      .update(await image.body())
      .digest("hex"),
  ).toBe(baseline.socialImageSha256);
});

test("SaaS JSON : texte et anciennes ancres disponibles sans JavaScript", async ({
  browser,
  baseURL,
}) => {
  test.skip(preview, "Vérification du HTML publié");
  const context = await browser.newContext({
    javaScriptEnabled: false,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  try {
    const response = await page.goto(`${baseURL}${route}#article-body`);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveText(baseline.metadata.title);
    await expect(
      page.locator("#blog-article-body > .blog-ds__section"),
    ).toHaveCount(5);
    await expect(page.locator(".blog-ds__json-intro")).toContainText(
      baseline.content[0].spans[0].text,
    );
    for (const item of baseline.content.filter(
      (x: { kind: string }) => x.kind === "anchor",
    ))
      await expect(page.locator(`#${item.id}`)).toBeVisible();
    await expect(page.locator("#article-body")).toBeVisible();
    await expect(
      page.locator('main a[href="/fr/blog/guide-premier-emploi-developpeur"]'),
    ).toBeVisible();
  } finally {
    await context.close();
  }
});
