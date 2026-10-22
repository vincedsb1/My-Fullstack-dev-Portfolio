import { readFileSync, readdirSync } from "node:fs";
import { gzipSync } from "node:zlib";
import assert from "node:assert/strict";
const result = {};
for (const locale of ["fr", "en"]) {
  const html = readFileSync(`.next/server/app/${locale}.html`, "utf8");
  const tags = [...html.matchAll(/<script[^>]+src="([^"]+)"[^>]*>/g)];
  const files = (legacy) => [
    ...new Set(
      tags
        .filter((m) => /nomodule/i.test(m[0]) === legacy)
        .map((m) => m[1].replace("/_next/", "")),
    ),
  ];
  const size = (paths) =>
    paths.reduce(
      (sum, file) => sum + gzipSync(readFileSync(`.next/${file}`)).length,
      0,
    ) / 1024;
  const modern = size(files(false));
  const legacy = size(files(true));
  const prefix = locale === "fr" ? "projets" : "projects";
  const links = [
    ...new Set(
      [
        ...html.matchAll(
          new RegExp(`href="/${locale}/${prefix}/([a-z-]+)"`, "g"),
        ),
      ].map((m) => m[1]),
    ),
  ].filter((slug) => slug !== "archives" && slug !== "archive");
  assert.equal(
    links.length,
    7,
    "All published studies must be linked in home HTML",
  );
  assert(modern < 150, `Home modern JavaScript budget exceeded: ${modern} KiB`);
  assert(!html.includes("data-aos"));
  assert.equal((html.match(/<main\b/g) || []).length, 1);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  result[locale] = {
    modernGzipKiB: +modern.toFixed(2),
    legacyNomoduleGzipKiB: +legacy.toFixed(2),
    linkedStudies: links.length,
    modernChunks: files(false).length,
  };
}
for (const file of readdirSync(".next/static/chunks")) {
  if (!/\.(js|css)$/.test(file)) continue;
  const code = readFileSync(`.next/static/chunks/${file}`, "utf8");
  assert(
    !code.includes("schemaVersion"),
    `Server manifest in client chunk ${file}`,
  );
  assert(!code.includes("svg-inline--fa"), `Unused icon CSS in ${file}`);
}
console.info(JSON.stringify(result, null, 2));
