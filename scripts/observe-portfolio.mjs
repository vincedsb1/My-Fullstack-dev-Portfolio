import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import { chromium } from "@playwright/test";
import sharp from "sharp";
const origin = process.env.PORTFOLIO_BASE_URL ?? "http://localhost:3006";
const output = path.resolve(
  process.env.PORTFOLIO_ARTIFACT_DIR ?? "test-results/audit-2026-10-22",
);
await mkdir(output, { recursive: true });
const sitemap = await (await fetch(`${origin}/sitemap.xml`)).text();
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(
  (m) => new URL(m[1]),
);
const report = { pages: [], captures: [], consoleErrors: [] };
const decode = (value) => value.replaceAll("&amp;", "&");
for (const url of urls) {
  const response = await fetch(origin + url.pathname);
  assert.equal(response.status, 200, url.pathname);
  const html = await response.text();
  const image = html.match(/<meta property="og:image" content="([^"]+)"/);
  const data = { path: url.pathname, status: response.status };
  if (url.pathname !== "/juliedieris") {
    assert(image, `Missing social image: ${url.pathname}`);
    const imageUrl = new URL(decode(image[1]));
    const imageResponse = await fetch(
      origin + imageUrl.pathname + imageUrl.search,
    );
    assert.equal(imageResponse.status, 200, imageUrl.pathname);
    const dimensions = await sharp(
      Buffer.from(await imageResponse.arrayBuffer()),
    ).metadata();
    assert.equal(dimensions.width, 1200, url.pathname);
    assert.equal(dimensions.height, 630, url.pathname);
    data.socialImage = "1200x630";
    for (const match of html.matchAll(
      /<script type="application\/ld\+json">(.*?)<\/script>/g,
    )) {
      const schema = JSON.parse(match[1]);
      if (schema["@type"] === "CreativeWork") {
        const asset = new URL(schema.image);
        assert.equal(
          (await fetch(origin + asset.pathname)).status,
          200,
          asset.pathname,
        );
      }
    }
  }
  report.pages.push(data);
}
const browser = await chromium.launch({ headless: true });
try {
  for (const width of [390, 1440])
    for (const theme of ["light", "dark"]) {
      const context = await browser.newContext({
        viewport: { width, height: 1000 },
        reducedMotion: "reduce",
      });
      await context.addInitScript(
        (t) => localStorage.setItem("theme", t),
        theme,
      );
      const page = await context.newPage();
      page.on("pageerror", (e) => report.consoleErrors.push(e.message));
      for (const [label, route] of [
        ["home", "/fr"],
        ["project", "/fr/projets/iconise"],
        ["article", "/fr/blog/internationaliser-saas-lancement"],
      ]) {
        const response = await page.goto(origin + route);
        assert.equal(response.status(), 200);
        await page.evaluate(async () => {
          await document.fonts.ready;
        });
        await page.locator("h1").waitFor();
        const name = `${label}-${width}-${theme}`;
        await page.screenshot({
          path: path.join(output, `${name}.png`),
          fullPage: true,
        });
        await page.screenshot({
          path: path.join(output, `${name}-viewport.png`),
        });
        report.captures.push(name);
      }
      await context.close();
    }
} finally {
  await browser.close();
}
assert.deepEqual(report.consoleErrors, []);
await writeFile(
  path.join(output, "verification.json"),
  JSON.stringify(report, null, 2) + "\n",
);
console.info(
  JSON.stringify(
    {
      pages: report.pages.length,
      captures: report.captures.length,
      consoleErrors: report.consoleErrors.length,
      output,
    },
    null,
    2,
  ),
);
