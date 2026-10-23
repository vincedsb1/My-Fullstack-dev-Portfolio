import { createBlogSocialImage } from "../../../../../../features/blog/BlogSocialImage";
import { getPublishedArticle, getPublishedArticles } from "@/lib/blog/articles";
import { createGuideSocialImage } from "../../../../../../features/guide/guideSocialImage";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getPublishedArticles().map((article) => ({
    locale: article.metadata.locale,
    slug: article.metadata.slug,
  }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string; slug: string }> },
) {
  const { locale, slug } = await params;
  if (locale !== "fr" && locale !== "en") {
    return new Response("Not found", { status: 404 });
  }

  const article = getPublishedArticle(locale, slug);
  if (!article) return new Response("Not found", { status: 404 });

  // Cette image publique précède le moteur JSON : conserver son rendu à URL constante.
  return locale === "fr" && slug === "guide-premier-emploi-developpeur"
    ? createGuideSocialImage()
    : createBlogSocialImage(article.metadata);
}
