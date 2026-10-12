import { readAllBlogArticles } from "../src/lib/blog/article-source.mjs";

const articles = readAllBlogArticles();
const published = articles.filter(
  (article) => article.metadata.status === "published",
);
const drafts = articles.length - published.length;

console.info(
  `[blog] Métadonnées validées : ${published.length} publié(s), ${drafts} brouillon(s).`,
);
