import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { parse as parseYaml } from "yaml";

const contentRoot = path.resolve(process.cwd(), "src/content/blog");
const publicRoot = path.resolve(process.cwd(), "public");
const supportedLocales = new Set(["fr", "en"]);
const allowedFields = new Set([
  "title",
  "description",
  "excerpt",
  "slug",
  "locale",
  "category",
  "publishedAt",
  "updatedAt",
  "cover",
  "coverAlt",
  "status",
  "translationKey",
  "renderer",
]);

function fail(filePath, message) {
  throw new Error(
    `[blog] ${path.relative(process.cwd(), filePath)}: ${message}`,
  );
}

function requiredText(value, field, filePath) {
  if (typeof value !== "string" || value.trim().length === 0) {
    fail(
      filePath,
      `le champ « ${field} » est obligatoire et doit être du texte.`,
    );
  }

  return value.trim();
}

function normalizeDate(value, field, filePath) {
  let date;

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      fail(filePath, `la date « ${field} » est invalide.`);
    }
    date = value.toISOString().slice(0, 10);
  } else if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    date = value;
  } else {
    fail(filePath, `la date « ${field} » doit respecter le format AAAA-MM-JJ.`);
  }

  const [year, month, day] = date.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    fail(filePath, `la date « ${field} » n'existe pas dans le calendrier.`);
  }

  return date;
}

function parseFrontmatter(source, filePath) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) {
    fail(filePath, "frontmatter YAML manquant (délimiteurs --- requis).");
  }

  let data;
  try {
    data = parseYaml(match[1]);
  } catch (error) {
    fail(
      filePath,
      `frontmatter YAML invalide (${
        error instanceof Error ? error.message : "erreur inconnue"
      }).`,
    );
  }

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    fail(filePath, "le frontmatter doit contenir des champs YAML.");
  }

  return { data, content: source.slice(match[0].length) };
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

function validateBodyImages(source, filePath) {
  const content = removeCodeExamples(source);
  const images = [
    ...Array.from(
      content.matchAll(/!\[[^\]]*\]\(\s*(?:<([^>\s]+)>|([^\s)]+))/g),
      (match) => match[1] ?? match[2],
    ),
    ...Array.from(
      content.matchAll(/\bsrc\s*=\s*(["'])(.*?)\1/gs),
      (match) => match[2],
    ),
  ];

  for (const image of images) {
    const imagePath = image.split(/[?#]/, 1)[0];
    let decodedPath;
    try {
      decodedPath = decodeURIComponent(imagePath);
    } catch {
      fail(filePath, `le chemin d'image « ${image} » est mal encodé.`);
    }

    if (
      !decodedPath.startsWith("/blog/") ||
      decodedPath.includes("..") ||
      decodedPath.includes("\\")
    ) {
      fail(
        filePath,
        `l'image « ${image} » doit être un fichier local sous /blog/<slug>/.`,
      );
    }

    const assetPath = path.resolve(publicRoot, decodedPath.slice(1));
    const assetStat = statSync(assetPath, { throwIfNoEntry: false });
    if (
      !assetPath.startsWith(`${publicRoot}${path.sep}`) ||
      !assetStat?.isFile()
    ) {
      fail(filePath, `l'image « ${image} » n'existe pas dans public/.`);
    }
    if (!/\.(avif|gif|jpe?g|png|svg|webp)$/i.test(decodedPath)) {
      fail(
        filePath,
        `le fichier « ${image} » n'est pas un format d'image pris en charge.`,
      );
    }
  }
}

function validateBodyHeading(source, filePath) {
  const content = removeCodeExamples(source);
  const markdownH1 = /^[ \t]{0,3}(?:>\s*)*#\s+.+$/m.test(content);
  const htmlH1 = /<\s*h1(?:\s|>)/i.test(content);
  if (markdownH1 || htmlH1) {
    fail(
      filePath,
      "le H1 est généré depuis title ; commencez le corps de l'article au niveau H2.",
    );
  }
}

function parseArticle(filePath, locale) {
  let source;

  try {
    source = readFileSync(filePath, "utf8");
  } catch (error) {
    fail(
      filePath,
      `impossible de lire le MDX (${
        error instanceof Error ? error.message : "erreur inconnue"
      }).`,
    );
  }

  const parsed = parseFrontmatter(source, filePath);
  const data = parsed.data;
  const unknownFields = Object.keys(data).filter(
    (field) => !allowedFields.has(field),
  );
  if (unknownFields.length > 0) {
    fail(
      filePath,
      `champs de métadonnées inconnus : ${unknownFields.join(", ")}.`,
    );
  }

  const filenameSlug = path.basename(filePath, ".mdx");
  const metadata = {
    title: requiredText(data.title, "title", filePath),
    description: requiredText(data.description, "description", filePath),
    excerpt: requiredText(data.excerpt, "excerpt", filePath),
    slug: requiredText(data.slug, "slug", filePath),
    locale: requiredText(data.locale, "locale", filePath),
    category: requiredText(data.category, "category", filePath),
    publishedAt: normalizeDate(data.publishedAt, "publishedAt", filePath),
    status: requiredText(data.status, "status", filePath),
  };

  if (metadata.slug !== filenameSlug) {
    fail(
      filePath,
      `slug « ${metadata.slug} » différent du nom de fichier « ${filenameSlug} ».`,
    );
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(metadata.slug)) {
    fail(
      filePath,
      "le slug doit contenir uniquement des minuscules, chiffres et tirets.",
    );
  }
  if (metadata.locale !== locale || !supportedLocales.has(metadata.locale)) {
    fail(
      filePath,
      `la locale « ${metadata.locale} » doit correspondre au dossier « ${locale} » (fr ou en).`,
    );
  }
  if (metadata.status !== "published" && metadata.status !== "draft") {
    fail(filePath, "status doit valoir « published » ou « draft ».");
  }

  const updatedAt = data.updatedAt
    ? normalizeDate(data.updatedAt, "updatedAt", filePath)
    : undefined;
  if (updatedAt && updatedAt < metadata.publishedAt) {
    fail(filePath, "updatedAt ne peut pas précéder publishedAt.");
  }

  let cover;
  let coverAlt;
  if (data.cover !== undefined) {
    cover = requiredText(data.cover, "cover", filePath);
    if (!cover.startsWith("/blog/") || cover.includes("..")) {
      fail(filePath, "cover doit pointer vers une image locale sous /blog/.");
    }
    const coverPath = path.resolve(publicRoot, cover.slice(1));
    const coverStat = statSync(coverPath, { throwIfNoEntry: false });
    if (
      !coverPath.startsWith(`${publicRoot}${path.sep}`) ||
      !coverStat?.isFile()
    ) {
      fail(
        filePath,
        `l'image de couverture « ${cover} » n'existe pas dans public/.`,
      );
    }
    if (!/\.(avif|gif|jpe?g|png|svg|webp)$/i.test(cover)) {
      fail(
        filePath,
        "cover doit cibler une image SVG, PNG, JPEG, WebP, AVIF ou GIF.",
      );
    }
    coverAlt = requiredText(data.coverAlt, "coverAlt", filePath);
  } else if (data.coverAlt !== undefined) {
    fail(filePath, "coverAlt nécessite une image cover.");
  }

  const translationKey = data.translationKey
    ? requiredText(data.translationKey, "translationKey", filePath)
    : undefined;
  if (translationKey && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(translationKey)) {
    fail(
      filePath,
      "translationKey doit contenir uniquement des minuscules, chiffres et tirets.",
    );
  }

  const renderer = data.renderer
    ? requiredText(data.renderer, "renderer", filePath)
    : undefined;
  if (renderer && renderer !== "guide") {
    fail(filePath, `renderer « ${renderer} » n'est pas enregistré.`);
  }
  if (
    renderer === "guide" &&
    metadata.slug !== "guide-premier-emploi-developpeur"
  ) {
    fail(
      filePath,
      "le renderer guide est réservé à l'article du premier emploi de développeur.",
    );
  }
  if (!renderer && parsed.content.trim().length === 0) {
    fail(filePath, "un article MDX ordinaire doit contenir du texte.");
  }
  if (!renderer) {
    validateBodyHeading(parsed.content, filePath);
    validateBodyImages(parsed.content, filePath);
  }

  return {
    metadata: {
      ...metadata,
      ...(updatedAt ? { updatedAt } : {}),
      ...(cover ? { cover, coverAlt } : {}),
      ...(translationKey ? { translationKey } : {}),
      ...(renderer ? { renderer } : {}),
    },
    body: parsed.content.trim(),
    filePath,
  };
}

export function readAllBlogArticles() {
  if (!statSync(contentRoot, { throwIfNoEntry: false })) {
    throw new Error(
      `[blog] dossier manquant : ${path.relative(process.cwd(), contentRoot)}.`,
    );
  }

  const entries = readdirSync(contentRoot, { withFileTypes: true });
  const rootFiles = entries.filter((entry) => entry.isFile());
  if (rootFiles.length > 0) {
    throw new Error(
      `[blog] placez les articles dans un dossier de langue, pas à la racine : ${rootFiles
        .map((entry) => entry.name)
        .join(", ")}.`,
    );
  }

  const localeDirs = entries.filter((entry) => entry.isDirectory());
  const articles = [];

  for (const localeDir of localeDirs) {
    if (!supportedLocales.has(localeDir.name)) {
      throw new Error(
        `[blog] locale « ${localeDir.name} » inconnue sous ${path.relative(
          process.cwd(),
          contentRoot,
        )}.`,
      );
    }

    const localePath = path.join(contentRoot, localeDir.name);
    const localeEntries = readdirSync(localePath, { withFileTypes: true });
    const nestedDirs = localeEntries.filter((entry) => entry.isDirectory());
    if (nestedDirs.length > 0) {
      throw new Error(
        `[blog] les fichiers MDX doivent être directement dans ${path.relative(
          process.cwd(),
          localePath,
        )}.`,
      );
    }

    for (const entry of localeEntries) {
      if (!entry.name.endsWith(".mdx")) {
        throw new Error(
          `[blog] fichier inattendu : ${path.relative(
            process.cwd(),
            path.join(localePath, entry.name),
          )}; seuls les fichiers .mdx sont acceptés.`,
        );
      }
      articles.push(
        parseArticle(path.join(localePath, entry.name), localeDir.name),
      );
    }
  }

  const routes = new Set();
  const translations = new Map();
  const publishedTitles = new Map();
  const publishedDescriptions = new Map();
  for (const article of articles) {
    const routeKey = `${article.metadata.locale}/${article.metadata.slug}`;
    if (routes.has(routeKey)) {
      fail(article.filePath, `collision de route « /${routeKey} ».`);
    }
    routes.add(routeKey);

    if (article.metadata.status === "published") {
      for (const [field, value, seen] of [
        ["title", article.metadata.title, publishedTitles],
        ["description", article.metadata.description, publishedDescriptions],
      ]) {
        const normalized = value.trim().toLocaleLowerCase();
        if (seen.has(normalized)) {
          fail(
            article.filePath,
            `le champ « ${field} » doit être unique parmi les articles publiés.`,
          );
        }
        seen.set(normalized, article.filePath);
      }
    }

    if (article.metadata.translationKey) {
      const localeSet =
        translations.get(article.metadata.translationKey) ?? new Set();
      if (localeSet.has(article.metadata.locale)) {
        fail(
          article.filePath,
          `plusieurs articles partagent la traduction « ${article.metadata.translationKey} » en ${article.metadata.locale}.`,
        );
      }
      localeSet.add(article.metadata.locale);
      translations.set(article.metadata.translationKey, localeSet);
    }
  }

  for (const article of articles) {
    if (
      article.metadata.status !== "published" ||
      article.metadata.locale !== "en"
    ) {
      continue;
    }

    const translationKey = article.metadata.translationKey;
    if (!translationKey) {
      fail(
        article.filePath,
        "un article anglais publié doit référencer une traduction française avec translationKey.",
      );
    }

    const hasPublishedFrenchSource = articles.some(
      (candidate) =>
        candidate.metadata.status === "published" &&
        candidate.metadata.locale === "fr" &&
        candidate.metadata.translationKey === translationKey,
    );
    if (!hasPublishedFrenchSource) {
      fail(
        article.filePath,
        `aucun article français publié ne partage translationKey « ${translationKey} » avec cet article anglais.`,
      );
    }
  }

  return articles;
}
