import type { ReactNode } from "react";
import type { BlogArticleRecord } from "@/lib/blog/articles";
import InternationalisationArticle from "./InternationalisationArticle";
import {
  ArticleBreadcrumbs,
  ArticleHeader,
  ArticleFooter,
} from "./BlogComponents";
type Props = {
  article: BlogArticleRecord;
  readingMinutes: number;
  children: ReactNode;
};
function DefaultLayout({ article, readingMinutes, children }: Props) {
  return (
    <main
      id="main"
      className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8 sm:py-16"
    >
      <ArticleBreadcrumbs article={article} />
      <article>
        <ArticleHeader article={article} readingMinutes={readingMinutes} />
        <div className="blog-prose prose-site">{children}</div>
        <ArticleFooter article={article} />
      </article>
    </main>
  );
}
function GuideLayout({ children }: Props) {
  return (
    <div className="guide-page min-h-screen bg-surface text-content">
      {children}
    </div>
  );
}
export const articleLayouts = {
  default: DefaultLayout,
  guide: GuideLayout,
  editorial: InternationalisationArticle,
};
