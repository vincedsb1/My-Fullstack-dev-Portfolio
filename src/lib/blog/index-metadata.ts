import type { BlogArticleRecord, BlogLocale } from "./article-source.mjs";

export interface BlogIndexSeo {
  heading: string;
  title: string;
  description: string;
  introduction: string;
  socialExcerpt: string;
  imageAlt: string;
}

function shorten(value: string, maxLength = 160) {
  if (value.length <= maxLength) return value;

  const boundary = value.lastIndexOf(" ", maxLength - 1);
  return (
    value.slice(0, boundary > 0 ? boundary : maxLength - 1).trimEnd() + "…"
  );
}

export function getBlogIndexSeo(
  articles: BlogArticleRecord[],
  locale: BlogLocale,
): BlogIndexSeo {
  const normalizedWebTopic =
    locale === "fr" ? "développement web" : "web development";
  const categories = Array.from(
    new Set(
      articles
        .map((article) => article.metadata.category.trim())
        .filter(
          (category) =>
            category.toLocaleLowerCase(locale === "fr" ? "fr-FR" : "en-US") !==
            normalizedWebTopic,
        )
        .map((category) =>
          category.toLocaleLowerCase(locale === "fr" ? "fr-FR" : "en-US"),
        ),
    ),
  );
  const displayedCategories = categories.slice(0, 2);
  const categoryList = new Intl.ListFormat(
    locale === "fr" ? "fr-FR" : "en-US",
    { type: "conjunction" },
  ).format(displayedCategories);
  const developmentLabel =
    locale === "fr" ? "Développement web" : "Web development";
  let heading = categoryList
    ? displayedCategories.length === 1
      ? (locale === "fr" ? "Développement web et " : "Web development and ") +
        categoryList
      : developmentLabel + (locale === "fr" ? ", " : ": ") + categoryList
    : developmentLabel;
  if (categories.length > displayedCategories.length) {
    heading += locale === "fr" ? ", entre autres" : ", among others";
  }
  const featuredArticle = articles[0]?.metadata;
  const fallback =
    locale === "fr"
      ? "Articles et conseils autour du développement web."
      : "Articles and practical advice about web development.";
  const title =
    locale === "fr"
      ? "Blog — développement web et produit"
      : "Blog — web development and product";
  const description = shorten(
    heading + ". " + (featuredArticle?.description ?? fallback),
  );
  const introduction =
    featuredArticle?.excerpt ??
    (locale === "fr"
      ? "Les prochains articles paraîtront ici."
      : "New articles will appear here.");
  const socialExcerpt = featuredArticle?.excerpt ?? fallback;
  const imageAlt =
    locale === "fr"
      ? "Image de partage du blog sur " + heading + "."
      : "Blog share image about " + heading + ".";

  return { heading, title, description, introduction, socialExcerpt, imageAlt };
}
