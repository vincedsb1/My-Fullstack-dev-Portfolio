import { readdirSync, statSync } from "node:fs";
import path from "node:path";

const publicRoot = path.resolve(process.cwd(), "public");
const appRoot = path.resolve(process.cwd(), "src/app");
const supportedLocales = new Set(["fr", "en"]);

function fail(article, message) {
  throw new Error(
    "[blog] " + path.relative(process.cwd(), article.filePath) + ": " + message,
  );
}

function removeCodeExamples(source) {
  const lines = source.split(/\r?\n/);
  const content = [];
  let activeFence;

  for (const line of lines) {
    const fence = line.match(/^[ \t]{0,3}(`{3,}|~{3,})/);
    if (!activeFence && fence) {
      activeFence = { character: fence[1][0], length: fence[1].length };
      continue;
    }
    if (activeFence) {
      if (
        fence &&
        fence[1][0] === activeFence.character &&
        fence[1].length >= activeFence.length
      ) {
        activeFence = undefined;
      }
      continue;
    }
    content.push(line);
  }

  return content
    .join("\n")
    .replace(/<!--([\s\S]*?)-->/g, " ")
    .replace(/(`+)[^`\n]*\1/g, " ");
}

function listAppRoutePatterns(directory = appRoot, parentSegments = []) {
  const patterns = [];
  const entries = readdirSync(directory, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      const isRouteGroup =
        (entry.name.startsWith("(") && entry.name.endsWith(")")) ||
        entry.name.startsWith("@");
      patterns.push(
        ...listAppRoutePatterns(
          entryPath,
          isRouteGroup ? parentSegments : [...parentSegments, entry.name],
        ),
      );
      continue;
    }

    if (/^(page|route)\.(js|jsx|ts|tsx|md|mdx)$/.test(entry.name)) {
      patterns.push(parentSegments);
    }
  }

  return patterns;
}

function routePatternMatches(pathname, pattern) {
  const requestedSegments = pathname.split("/").filter(Boolean);
  const routeSegments =
    requestedSegments[0] && supportedLocales.has(requestedSegments[0])
      ? ["[locale]", ...requestedSegments.slice(1)]
      : requestedSegments;
  let requestedIndex = 0;

  for (const segment of pattern) {
    if (segment.startsWith("[[...") && segment.endsWith("]]")) return true;
    if (segment.startsWith("[...") && segment.endsWith("]")) {
      return requestedIndex < routeSegments.length;
    }
    if (segment.startsWith("[") && segment.endsWith("]")) {
      if (!routeSegments[requestedIndex]) return false;
      requestedIndex += 1;
      continue;
    }
    if (segment !== routeSegments[requestedIndex]) return false;
    requestedIndex += 1;
  }

  return requestedIndex === routeSegments.length;
}

function extractDestinations(source) {
  const content = removeCodeExamples(source);
  return [
    ...Array.from(
      content.matchAll(
        /\[[^\]]+\]\(\s*(?:<([^>]+)>|([^\s)]+))(?:\s+[^)]*)?\)/g,
      ),
      (match) => match[1] ?? match[2],
    ),
    ...Array.from(
      content.matchAll(/\bhref\s*=\s*(["'])(.*?)\1/gs),
      (match) => match[2],
    ),
  ];
}

export function validateBlogLinks(articles) {
  const published = articles.filter(
    (article) => article.metadata.status === "published",
  );
  const publishedRoutes = new Set(
    published.map(
      (article) => article.metadata.locale + "/" + article.metadata.slug,
    ),
  );
  const publishedLocales = new Set(
    published.map((article) => article.metadata.locale),
  );
  publishedLocales.add("fr");
  const routePatterns = listAppRoutePatterns();

  for (const article of articles) {
    if (article.metadata.renderer === "guide") continue;

    for (const destination of new Set(extractDestinations(article.body))) {
      const value = destination.trim();
      if (!value || value.startsWith("#") || value.startsWith("?")) continue;

      let url;
      try {
        url = new URL(value, "https://blog.local");
      } catch {
        fail(article, "le lien « " + value + " » n'est pas une URL valide.");
      }
      if (url.origin !== "https://blog.local") {
        if (["http:", "https:", "mailto:", "tel:"].includes(url.protocol)) {
          continue;
        }
        fail(
          article,
          "le protocole du lien « " + value + " » n'est pas accepté.",
        );
      }
      if (!value.startsWith("/")) {
        fail(
          article,
          "le lien local « " + value + " » doit commencer par « / » ou « # ».",
        );
      }

      let decodedPath;
      try {
        decodedPath = decodeURIComponent(url.pathname);
      } catch {
        fail(article, "le chemin du lien « " + value + " » est mal encodé.");
      }
      if (decodedPath.includes("..") || decodedPath.includes("\\")) {
        fail(
          article,
          "le chemin du lien « " + value + " » n'est pas autorisé.",
        );
      }

      const normalizedPath =
        decodedPath.length > 1 ? decodedPath.replace(/\/+$/, "") : decodedPath;
      const blogPath = normalizedPath.match(/^\/(fr|en)\/blog(?:\/([^/]+))?$/);
      if (blogPath) {
        const [, locale, slug] = blogPath;
        if (!slug && !publishedLocales.has(locale)) {
          fail(
            article,
            "la page blog « " + normalizedPath + " » n'existe pas.",
          );
        }
        if (
          slug &&
          slug !== "blog-index-image.png" &&
          !publishedRoutes.has(locale + "/" + slug)
        ) {
          fail(
            article,
            "l'article « " +
              normalizedPath +
              " » n'est pas publié ou n'existe pas.",
          );
        }
      }

      if (
        routePatterns.some((pattern) =>
          routePatternMatches(normalizedPath, pattern),
        )
      ) {
        continue;
      }

      const assetPath = path.resolve(publicRoot, decodedPath.slice(1));
      const assetStat = statSync(assetPath, { throwIfNoEntry: false });
      if (assetPath.startsWith(publicRoot + path.sep) && assetStat?.isFile()) {
        continue;
      }
      fail(
        article,
        "la page ou la ressource locale « " + value + " » n'existe pas.",
      );
    }
  }
}
