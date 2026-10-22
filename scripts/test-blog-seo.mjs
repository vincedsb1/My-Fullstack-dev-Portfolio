import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { existsSync } from "node:fs";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import nextEnv from "@next/env";
import { readAllBlogArticles } from "../src/lib/blog/article-source.mjs";
import {
  readAllJsonBlogArticles,
  validateMergedBlogArticles,
} from "../src/lib/blog/json-source.mjs";
import { validateBlogLinks } from "./validate-blog-links.mjs";

nextEnv.loadEnvConfig(process.cwd());

if (!existsSync(path.join(process.cwd(), ".next", "BUILD_ID"))) {
  console.error("[blog:seo] Lancez npm run build avant ces contrôles.");
  process.exit(1);
}

const articles = validateMergedBlogArticles([
  ...readAllBlogArticles(),
  ...readAllJsonBlogArticles(),
]);
const published = articles.filter(
  (article) => article.metadata.status === "published",
);
const drafts = articles.filter(
  (article) => article.metadata.status === "draft",
);
const canonicalOrigin = new URL(
  process.env.NEXT_PUBLIC_SITE_URL || "https://vincent.desbrosses.net",
).origin;
const failures = [];

function check(condition, label, detail = "") {
  if (condition) {
    console.info("[OK] " + label);
    return;
  }
  const message = "[ÉCHEC] " + label + (detail ? ": " + detail : "");
  failures.push(message);
  console.error(message);
}

function verifyLinkValidation() {
  const fixture = {
    filePath: path.join(
      process.cwd(),
      "src/content/blog/fr/seo-validation-fixture.mdx",
    ),
    metadata: { locale: "fr", slug: "seo-validation-fixture", status: "draft" },
    body: "[Accueil](/fr) [Article publié](/fr/blog/guide-premier-emploi-developpeur)",
  };

  try {
    validateBlogLinks([...articles, fixture]);
    check(true, "validateur des liens accepte les routes publiées");
  } catch (error) {
    check(
      false,
      "validateur des liens accepte les routes publiées",
      String(error),
    );
  }

  let rejectedUnpublishedLink = false;
  try {
    validateBlogLinks([
      ...articles,
      { ...fixture, body: "[Article absent](/fr/blog/seo-article-inexistant)" },
    ]);
  } catch {
    rejectedUnpublishedLink = true;
  }
  check(
    rejectedUnpublishedLink,
    "validateur des liens refuse un article absent ou non publié",
  );

  let rejectedMissingResource = false;
  try {
    validateBlogLinks([
      ...articles,
      {
        ...fixture,
        body: "[Fichier absent](/blog/seo-test-absent/figure.png)",
      },
    ]);
  } catch {
    rejectedMissingResource = true;
  }
  check(
    rejectedMissingResource,
    "validateur des liens refuse une ressource locale absente",
  );
}

function attributes(tag) {
  const result = {};
  for (const match of tag.matchAll(
    /([^\s=]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g,
  )) {
    result[match[1].toLowerCase()] = match[2] ?? match[3] ?? "";
  }
  return result;
}

function tags(html, name) {
  const pattern = new RegExp("<" + name + "\\b[^>]*>", "gi");
  return Array.from(html.matchAll(pattern), (match) => match[0]);
}

function meta(html, key, keyName = "name") {
  const tag = tags(html, "meta").find(
    (value) => attributes(value)[keyName] === key,
  );
  return tag ? attributes(tag).content : undefined;
}

function links(html) {
  return tags(html, "link").map(attributes);
}

function decodeHtml(value = "") {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
}

function plainText(value = "") {
  return decodeHtml(
    value
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function titleOf(html) {
  const match = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  return plainText(match?.[1]);
}

function headingLevels(html) {
  return Array.from(html.matchAll(/<h([1-6])\b/gi), (match) =>
    Number(match[1]),
  );
}

function hasValidHeadingHierarchy(levels) {
  if (levels[0] !== 1) return false;
  return levels.every(
    (level, index) => index === 0 || level <= levels[index - 1] + 1,
  );
}

function verifyContentImages(html, label) {
  const images = tags(html, "img").map(attributes);
  check(
    images.every(
      (image) =>
        Object.hasOwn(image, "alt") &&
        ((image.width && image.height) ||
          (image["data-nimg"] === "fill" && image.sizes)),
    ),
    "images avec texte alternatif et dimensions réservées " + label,
  );
  return images;
}

function jsonLdObjects(html) {
  return Array.from(
    html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi),
    (match) => ({
      attrs: attributes("<script " + match[1] + ">"),
      body: match[2],
    }),
  )
    .filter((script) => script.attrs.type === "application/ld+json")
    .map((script) => JSON.parse(script.body));
}

function urlFor(pathname) {
  return canonicalOrigin + pathname;
}

async function reservePort() {
  const server = createServer();
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Impossible de réserver un port local.");
  }
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
  return address.port;
}

async function startServer() {
  const port = await reservePort();
  const child = spawn(
    process.execPath,
    [
      path.join(process.cwd(), "node_modules/next/dist/bin/next"),
      "start",
      "--hostname",
      "127.0.0.1",
      "--port",
      String(port),
    ],
    { stdio: ["ignore", "pipe", "pipe"], env: process.env },
  );
  const logs = [];
  child.stdout.on("data", (chunk) => logs.push(chunk.toString()));
  child.stderr.on("data", (chunk) => logs.push(chunk.toString()));
  const baseUrl = "http://127.0.0.1:" + port;

  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (child.exitCode !== null) {
      throw new Error(
        "next start s'est arrêté : " + logs.join("").slice(-3000),
      );
    }
    try {
      await fetch(baseUrl + "/fr/blog", {
        redirect: "manual",
        signal: AbortSignal.timeout(1000),
      });
      return { child, baseUrl, logs };
    } catch {
      await delay(250);
    }
  }

  child.kill("SIGTERM");
  throw new Error("next start n'a pas répondu : " + logs.join("").slice(-3000));
}

async function request(baseUrl, route, options = {}) {
  return fetch(baseUrl + route, {
    redirect: "manual",
    signal: AbortSignal.timeout(10000),
    ...options,
  });
}

async function verifyLocalLinks(baseUrl, html, currentRoute, label) {
  const targets = new Set();
  const localOrigin = new URL(baseUrl).origin;

  for (const anchor of tags(html, "a")) {
    const href = attributes(anchor).href;
    if (!href) continue;

    let url;
    try {
      url = new URL(href, baseUrl + currentRoute);
    } catch {
      continue;
    }
    if (url.origin !== localOrigin || url.pathname === currentRoute) continue;
    targets.add(url.pathname + url.search);
  }

  for (const target of targets) {
    const response = await request(baseUrl, target);
    check(
      response.status === 200,
      "lien interne accessible depuis " + label + ": " + target,
      String(response.status) + " " + (response.headers.get("location") ?? ""),
    );
  }
}

function assertPublishedHead(html, response, locale, canonical) {
  const htmlTag = html.match(/<html\b[^>]*>/i)?.[0] ?? "";
  const canonicalLink = links(html).find((link) => link.rel === "canonical");
  check(attributes(htmlTag).lang === locale, "lang HTML " + locale);
  check(
    canonicalLink?.href === canonical,
    "canonical auto-référent " + canonical,
    canonicalLink?.href,
  );
  check(
    !meta(html, "robots") && !response.headers.get("x-robots-tag"),
    "page publiée indexable sans directive robots bloquante " + canonical,
  );
}

function redirectPath(response, baseUrl) {
  const location = response.headers.get("location");
  return location ? new URL(location, baseUrl).pathname : undefined;
}

function hasHeaderToken(value, token) {
  return value
    ?.split(",")
    .some((part) => part.trim().toLowerCase() === token.toLowerCase());
}

async function verifyLocaleRouting(baseUrl) {
  const rootCases = [
    {
      label: "visiteur français",
      headers: { "accept-language": "fr-FR,fr;q=0.9" },
      expected: "/fr",
    },
    {
      label: "visiteur anglais",
      headers: { "accept-language": "en-US,en;q=0.9" },
      expected: "/en",
    },
    {
      label: "langue inconnue avec fallback par défaut",
      headers: { "accept-language": "de-DE,de;q=0.9" },
      expected: "/en",
    },
    {
      label: "cookie français prioritaire sur Accept-Language anglais",
      headers: {
        "accept-language": "en-US,en;q=0.9",
        cookie: "NEXT_LOCALE=fr",
      },
      expected: "/fr",
    },
  ];

  for (const testCase of rootCases) {
    const response = await request(baseUrl, "/", {
      headers: testCase.headers,
    });
    check(response.status === 307, "racine redirigée pour " + testCase.label);
    check(
      redirectPath(response, baseUrl) === testCase.expected,
      "destination locale correcte pour " + testCase.label,
      redirectPath(response, baseUrl),
    );
  }

  const rootResponse = await request(baseUrl, "/", {
    headers: { "accept-language": "fr-FR,fr;q=0.9" },
  });
  check(
    /\bprivate\b/i.test(rootResponse.headers.get("cache-control") ?? "") &&
      /\bno-store\b/i.test(rootResponse.headers.get("cache-control") ?? ""),
    "redirection racine non mise en cache publiquement",
    rootResponse.headers.get("cache-control"),
  );
  check(
    hasHeaderToken(rootResponse.headers.get("vary"), "accept-language") &&
      hasHeaderToken(rootResponse.headers.get("vary"), "cookie"),
    "redirection racine varie selon la langue et le cookie",
    rootResponse.headers.get("vary"),
  );

  for (const locale of ["fr", "en"]) {
    const oppositeLocale = locale === "fr" ? "en" : "fr";
    const response = await request(baseUrl, "/" + locale, {
      headers: { cookie: "NEXT_LOCALE=" + oppositeLocale },
    });
    const html = await response.text();
    check(response.status === 200, "page d’accueil " + locale + " accessible");
    assertPublishedHead(html, response, locale, urlFor("/" + locale));

    const alternateLinks = links(html).filter(
      (link) => link.rel === "alternate" && link.hreflang,
    );
    check(
      alternateLinks.length === 3 &&
        alternateLinks.some(
          (link) => link.hreflang === "fr" && link.href === urlFor("/fr"),
        ) &&
        alternateLinks.some(
          (link) => link.hreflang === "en" && link.href === urlFor("/en"),
        ) &&
        alternateLinks.some(
          (link) =>
            link.hreflang === "x-default" && link.href === urlFor("/en"),
        ),
      "canonical et hreflang conservés pour /" + locale,
    );
  }
}

async function verifySocialImage(baseUrl, imageUrl, label) {
  let response;
  try {
    response = await request(baseUrl, new URL(imageUrl).pathname);
  } catch (error) {
    check(false, "image sociale accessible " + label, String(error));
    return;
  }
  const bytes = Buffer.from(await response.arrayBuffer());
  const isPng =
    bytes.length >= 24 &&
    bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  check(
    response.status === 200 &&
      response.headers.get("content-type")?.includes("image/png"),
    "réponse PNG de l'image sociale " + label,
  );
  check(
    isPng && bytes.readUInt32BE(16) === 1200 && bytes.readUInt32BE(20) === 630,
    "dimensions 1200 × 630 de l'image sociale " + label,
  );
}

let runningServer;
try {
  verifyLinkValidation();
  runningServer = await startServer();
  const { baseUrl, child } = runningServer;

  await verifyLocaleRouting(baseUrl);

  const indexResponse = await request(baseUrl, "/fr/blog");
  const indexHtml = await indexResponse.text();
  const indexTitle = titleOf(indexHtml);
  const indexDescription = meta(indexHtml, "description");
  const indexImage = meta(indexHtml, "og:image", "property");
  check(indexResponse.status === 200, "index français pré-rendu (200)");
  assertPublishedHead(indexHtml, indexResponse, "fr", urlFor("/fr/blog"));
  check(
    /développement web/i.test(indexTitle) && !/^Blog\s*\|/i.test(indexTitle),
    "title de l’index décrit les sujets publiés",
    indexTitle,
  );
  check(
    indexDescription?.length > 40 && indexDescription.length <= 160,
    "meta description claire et concise",
    indexDescription,
  );
  check(
    (indexHtml.match(/<main\b/gi) ?? []).length === 1,
    "landmark main unique sur l’index",
  );
  check(
    (indexHtml.match(/<h1\b/gi) ?? []).length === 1,
    "H1 unique sur l’index",
  );
  check(
    hasValidHeadingHierarchy(headingLevels(indexHtml)),
    "hiérarchie des titres de l’index",
  );
  const indexH1 = tags(indexHtml, "h1")[0];
  check(
    attributes(indexH1).class?.includes("text-h1") &&
      attributes(indexH1).class.includes("break-words"),
    "titre fluide et sans débordement aux petites largeurs",
  );
  const indexImages = verifyContentImages(indexHtml, "index");
  check(
    indexImages.every((image) => image.loading === "lazy"),
    "images de cartes chargées paresseusement",
  );
  check(
    indexImage?.startsWith(urlFor("/fr/blog/blog-index-image.png")),
    "image Open Graph dédiée à l’index",
    indexImage,
  );
  check(
    meta(indexHtml, "og:image:alt", "property") &&
      meta(indexHtml, "og:image:width", "property") === "1200" &&
      meta(indexHtml, "og:image:height", "property") === "630",
    "alt et dimensions Open Graph de l’index",
  );
  check(
    meta(indexHtml, "twitter:card") === "summary_large_image" &&
      meta(indexHtml, "twitter:image") === indexImage &&
      meta(indexHtml, "twitter:image:alt") ===
        meta(indexHtml, "og:image:alt", "property"),
    "prévisualisation Twitter cohérente avec Open Graph",
  );
  check(
    meta(indexHtml, "og:title", "property") ===
      indexTitle.replace(/ \| Vincent DESBROSSES$/, "") &&
      meta(indexHtml, "twitter:title") ===
        indexTitle.replace(/ \| Vincent DESBROSSES$/, "") &&
      meta(indexHtml, "og:description", "property") === indexDescription &&
      meta(indexHtml, "twitter:description") === indexDescription,
    "titres et descriptions sociaux cohérents",
  );
  await verifySocialImage(baseUrl, indexImage, "index français");
  await verifyLocalLinks(baseUrl, indexHtml, "/fr/blog", "l’index");

  const publishedLocales = new Set(
    published.map((article) => article.metadata.locale),
  );
  publishedLocales.add("fr");
  const publishedPairs = new Map();
  for (const article of published) {
    const key = article.metadata.translationKey;
    if (!key) continue;
    const pair = publishedPairs.get(key) ?? [];
    pair.push(article);
    publishedPairs.set(key, pair);
  }
  const hasTranslatedPair = Array.from(publishedPairs.values()).some(
    (pair) =>
      pair.some((article) => article.metadata.locale === "fr") &&
      pair.some((article) => article.metadata.locale === "en"),
  );
  const indexAlternates = links(indexHtml).filter(
    (link) => link.rel === "alternate" && link.hreflang,
  );
  check(
    hasTranslatedPair
      ? indexAlternates.length === 2 &&
          indexAlternates.some((link) => link.hreflang === "fr") &&
          indexAlternates.some((link) => link.hreflang === "en")
      : indexAlternates.filter((link) => link.hreflang !== "x-default")
          .length === 1 &&
          indexAlternates.some((link) => link.hreflang === "fr"),
    "hreflang de l’index limité aux langues réellement publiées",
  );

  if (publishedLocales.has("en")) {
    const englishIndexResponse = await request(baseUrl, "/en/blog");
    const englishIndexHtml = await englishIndexResponse.text();
    const englishIndexTitle = titleOf(englishIndexHtml);
    const englishIndexDescription = meta(englishIndexHtml, "description");
    const englishIndexImage = meta(englishIndexHtml, "og:image", "property");
    check(
      englishIndexResponse.status === 200,
      "index anglais pré-rendu lorsque des articles anglais existent",
    );
    assertPublishedHead(
      englishIndexHtml,
      englishIndexResponse,
      "en",
      urlFor("/en/blog"),
    );
    check(
      /web development/i.test(englishIndexTitle) &&
        (englishIndexHtml.match(/<h1\b/gi) ?? []).length === 1,
      "title et H1 descriptifs de l’index anglais",
    );
    check(
      englishIndexDescription?.length > 40 &&
        englishIndexDescription.length <= 160,
      "meta description de l’index anglais",
    );
    check(
      meta(englishIndexHtml, "og:title", "property") ===
        englishIndexTitle.replace(/ \| Vincent DESBROSSES$/, "") &&
        meta(englishIndexHtml, "twitter:title") ===
          englishIndexTitle.replace(/ \| Vincent DESBROSSES$/, "") &&
        meta(englishIndexHtml, "og:description", "property") ===
          englishIndexDescription &&
        meta(englishIndexHtml, "twitter:description") ===
          englishIndexDescription,
      "métadonnées sociales de l’index anglais",
    );
    check(
      meta(englishIndexHtml, "twitter:card") === "summary_large_image" &&
        meta(englishIndexHtml, "twitter:image") === englishIndexImage &&
        meta(englishIndexHtml, "og:image:width", "property") === "1200" &&
        meta(englishIndexHtml, "og:image:height", "property") === "630",
      "images Open Graph et Twitter de l’index anglais",
    );
    await verifySocialImage(baseUrl, englishIndexImage, "index anglais");
    await verifyLocalLinks(
      baseUrl,
      englishIndexHtml,
      "/en/blog",
      "index anglais",
    );
    const englishIndexAlternates = links(englishIndexHtml).filter(
      (link) => link.rel === "alternate" && link.hreflang,
    );
    check(
      hasTranslatedPair
        ? englishIndexAlternates.length === 2 &&
            englishIndexAlternates.some((link) => link.hreflang === "fr") &&
            englishIndexAlternates.some((link) => link.hreflang === "en")
        : englishIndexAlternates.length === 1 &&
            englishIndexAlternates[0].hreflang === "en",
      "hreflang de l’index anglais",
    );
  }

  for (const article of published) {
    const locale = article.metadata.locale;
    const route = "/" + locale + "/blog/" + article.metadata.slug;
    const canonical = urlFor(route);
    const response = await request(baseUrl, route);
    const html = await response.text();
    const h1 = plainText(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1]);
    const description = meta(html, "description");
    const canonicalLink = links(html).find((link) => link.rel === "canonical");
    const articleSchemas = jsonLdObjects(html);
    const blogPosting = articleSchemas.find(
      (schema) => schema["@type"] === "BlogPosting",
    );
    const breadcrumb = articleSchemas.find(
      (schema) => schema["@type"] === "BreadcrumbList",
    );
    check(response.status === 200, "article pré-rendu (200) " + route);
    assertPublishedHead(html, response, locale, canonical);
    check(
      titleOf(html) ===
        (article.metadata.seoTitle ?? article.metadata.title) +
          " | Vincent DESBROSSES" && titleOf(html).length <= 60,
      "title article unique et précis " + route,
      titleOf(html),
    );
    check(
      h1 === article.metadata.title,
      "H1 article depuis le frontmatter " + route,
    );
    check(
      description === article.metadata.description,
      "description article depuis le frontmatter " + route,
    );
    check(
      meta(html, "og:title", "property") ===
        (article.metadata.seoTitle ?? article.metadata.title) &&
        meta(html, "twitter:title") ===
          (article.metadata.seoTitle ?? article.metadata.title) &&
        meta(html, "og:description", "property") ===
          article.metadata.description &&
        meta(html, "twitter:description") === article.metadata.description,
      "métadonnées sociales de l’article " + route,
    );
    check(
      (html.match(/<h1\b/gi) ?? []).length === 1 &&
        (html.match(/<main\b/gi) ?? []).length === 1,
      "H1 et main uniques " + route,
    );
    check(
      hasValidHeadingHierarchy(headingLevels(html)),
      "hiérarchie des titres " + route,
    );
    verifyContentImages(html, route);
    check(
      (html.match(/<a\b[^>]*>/gi) ?? []).every((tag) => attributes(tag).href),
      "liens HTML avec href " + route,
    );
    await verifyLocalLinks(baseUrl, html, route, route);

    const socialImage = meta(html, "og:image", "property");
    check(
      socialImage === urlFor(route + "/social-image") &&
        meta(html, "og:image:width", "property") === "1200" &&
        meta(html, "og:image:height", "property") === "630" &&
        meta(html, "og:image:alt", "property") === article.metadata.title,
      "image Open Graph de l’article avec dimensions et alt " + route,
    );
    check(
      meta(html, "twitter:card") === "summary_large_image" &&
        meta(html, "twitter:image") === socialImage &&
        meta(html, "twitter:image:alt") === article.metadata.title,
      "image Twitter de l’article " + route,
    );
    await verifySocialImage(baseUrl, socialImage, route);

    check(
      blogPosting?.headline === article.metadata.title &&
        blogPosting.description === article.metadata.description &&
        blogPosting.datePublished === article.metadata.publishedAt &&
        blogPosting.dateModified === article.metadata.updatedAt &&
        blogPosting.author?.["@id"] === urlFor("/#person") &&
        blogPosting.isPartOf?.["@id"] === urlFor("/#website") &&
        blogPosting.mainEntityOfPage?.["@id"] === canonical &&
        blogPosting.inLanguage === (locale === "fr" ? "fr-FR" : "en"),
      "BlogPosting cohérent avec le frontmatter " + route,
    );
    check(
      breadcrumb?.itemListElement?.length === 3 &&
        breadcrumb.itemListElement[0].name === "Portfolio" &&
        breadcrumb.itemListElement[0].item === urlFor("/" + locale) &&
        breadcrumb.itemListElement[1].name === "Blog" &&
        breadcrumb.itemListElement[1].item === urlFor("/" + locale + "/blog") &&
        breadcrumb.itemListElement[2].name === article.metadata.title &&
        breadcrumb.itemListElement[2].item === canonical,
      "BreadcrumbList identique au fil d’Ariane visible " + route,
    );
    check(
      canonicalLink?.href === canonical &&
        meta(html, "og:url", "property") === canonical,
      "canonical et og:url article " + route,
    );

    const relatedTranslations = article.metadata.translationKey
      ? published.filter(
          (candidate) =>
            candidate.metadata.translationKey ===
            article.metadata.translationKey,
        )
      : [article];
    const alternateLinks = links(html).filter(
      (link) => link.rel === "alternate" && link.hreflang,
    );
    check(
      alternateLinks.filter((link) => link.hreflang !== "x-default").length ===
        relatedTranslations.length &&
        relatedTranslations.every((translation) =>
          alternateLinks.some(
            (link) =>
              link.hreflang === translation.metadata.locale &&
              link.href ===
                urlFor(
                  "/" +
                    translation.metadata.locale +
                    "/blog/" +
                    translation.metadata.slug,
                ),
          ),
        ),
      "hreflang réciproque sans traduction inventée " + route,
    );

    if (article.metadata.renderer === "guide") {
      check(
        html.includes("checklist-progress-text") &&
          html.includes("Un CV lisible, adapté au poste visé"),
        "contenu du guide présent dans le HTML initial " + route,
      );
      check(
        /class="[^"]*\bcheckbox-custom\b[^"]*"/.test(html) &&
          html.includes("data-guide-print") &&
          html.includes('id="share-btn"') &&
          html.includes('aria-label="Thème"'),
        "checklist, partage, impression et thème présents dans le HTML du guide",
      );
    } else {
      const firstHeading =
        article.format === "json"
          ? article.data.sections[0]?.title
          : article.body.match(/^##\s+(.+)$/m)?.[1]?.trim();
      check(
        Boolean(firstHeading) && html.includes(firstHeading),
        "premier titre et contenu MDX présents dans le HTML initial " + route,
      );
    }
  }

  const sitemapResponse = await request(baseUrl, "/sitemap.xml");
  const sitemap = await sitemapResponse.text();
  check(
    sitemapResponse.status === 200 &&
      sitemap.includes("<loc>" + urlFor("/fr/blog") + "</loc>"),
    "sitemap servi avec l’index français",
  );
  check(
    published.every((article) =>
      sitemap.includes(
        "<loc>" +
          urlFor(
            "/" + article.metadata.locale + "/blog/" + article.metadata.slug,
          ) +
          "</loc>",
      ),
    ),
    "tous les articles publiés apparaissent dans le sitemap",
  );
  check(
    drafts.every(
      (article) =>
        !sitemap.includes(
          urlFor(
            "/" + article.metadata.locale + "/blog/" + article.metadata.slug,
          ),
        ),
    ),
    "aucun brouillon n’apparaît dans le sitemap",
  );
  check(
    publishedLocales.has("en")
      ? sitemap.includes("<loc>" + urlFor("/en/blog") + "</loc>")
      : !sitemap.includes("<loc>" + urlFor("/en/blog") + "</loc>"),
    "index anglais présent uniquement avec des articles publiés",
  );

  const robotsResponse = await request(baseUrl, "/robots.txt");
  const robots = await robotsResponse.text();
  check(
    robotsResponse.status === 200 &&
      /Allow:\s*\//i.test(robots) &&
      robots.includes(urlFor("/sitemap.xml")),
    "robots.txt autorise l’exploration et référence le sitemap",
  );

  if (!publishedLocales.has("en")) {
    const response = await request(baseUrl, "/en/blog");
    const html = await response.text();
    check(
      response.status === 404,
      "/en/blog reste en 404 sans article anglais",
    );
    check(
      meta(html, "robots")?.includes("noindex"),
      "404 anglais explicitement exclu de l’index",
    );
  }

  for (const draft of drafts) {
    const route = "/" + draft.metadata.locale + "/blog/" + draft.metadata.slug;
    const response = await request(baseUrl, route);
    check(response.status === 404, "brouillon non accessible " + route);
  }

  const missingArticle = await request(
    baseUrl,
    "/fr/blog/__seo-test-missing__",
  );
  check(
    missingArticle.status === 404,
    "slug inconnu exclu des routes statiques",
  );

  const trailingSlash = await request(baseUrl, "/fr/blog/");
  check(
    trailingSlash.status === 308 &&
      new URL(trailingSlash.headers.get("location"), baseUrl).pathname ===
        "/fr/blog",
    "slash final redirigé définitivement vers l’URL canonique",
  );

  const oldGuideRoute = await request(
    baseUrl,
    "/guide-premier-emploi-developpeur",
  );
  check(
    oldGuideRoute.status === 308 &&
      new URL(oldGuideRoute.headers.get("location"), baseUrl).pathname ===
        "/fr/blog/guide-premier-emploi-developpeur",
    "ancienne URL du guide redirigée définitivement",
  );

  child.kill("SIGTERM");
  console.info(
    "[blog:seo] Contrôle terminé pour " +
      published.length +
      " article(s) publié(s) et " +
      drafts.length +
      " brouillon(s).",
  );
} catch (error) {
  failures.push(String(error));
  console.error("[blog:seo] " + String(error));
  if (runningServer?.logs) {
    console.error(runningServer.logs.join("").slice(-3000));
  }
} finally {
  if (runningServer?.child.exitCode === null) {
    runningServer.child.kill("SIGTERM");
    await delay(200);
    if (runningServer.child.exitCode === null)
      runningServer.child.kill("SIGKILL");
  }
}

if (failures.length > 0) process.exit(1);
