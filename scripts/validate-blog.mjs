import { readAllBlogArticles } from "../src/lib/blog/article-source.mjs";
import { readAllJsonBlogArticles, validateMergedBlogArticles } from "../src/lib/blog/json-source.mjs";
import { validateBlogLinks } from "./validate-blog-links.mjs";

const articles = validateMergedBlogArticles([...readAllBlogArticles(), ...readAllJsonBlogArticles()]);
validateBlogLinks(articles);
const published = articles.filter(
  (article) => article.metadata.status === "published",
);
const drafts = articles.length - published.length;

console.info(
  `[blog] Métadonnées validées : ${published.length} publié(s), ${drafts} brouillon(s), ${articles.filter(a => a.format === "json").length} JSON.`,
);
