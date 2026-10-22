import { createBlogSocialImage } from "../../../../../features/blog/BlogSocialImage";
import { getPublishedArticles, type BlogLocale } from "@/lib/blog/articles";
import { getBlogIndexSeo } from "@/lib/blog/index-metadata";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  const locales: BlogLocale[] = ["fr", "en"];

  return locales.map((locale) => ({ locale }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale: rawLocale } = await params;
  if (rawLocale !== "fr" && rawLocale !== "en") {
    return new Response("Not found", { status: 404 });
  }

  const locale = rawLocale as BlogLocale;
  const articles = getPublishedArticles(locale);

  const seo = getBlogIndexSeo(articles, locale);
  return createBlogSocialImage({
    category:
      locale === "fr" ? "Blog de développement web" : "Web development blog",
    title: seo.heading,
    excerpt: seo.socialExcerpt,
  });
}
