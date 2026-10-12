import { ImageResponse } from "next/og";
import type { BlogArticleMetadata } from "@/lib/blog/articles";

export const blogSocialImageSize = { width: 1200, height: 630 };

export function createBlogSocialImage(article: BlogArticleMetadata) {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 68,
          color: "#f5f5f5",
          background: "linear-gradient(135deg, #171717 0%, #292929 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: 7,
              background: "#ef4444",
            }}
          />
          <span
            style={{
              color: "#d4d4d4",
              fontSize: 23,
              fontWeight: 600,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            {article.category} · Vincent DESBROSSES
          </span>
        </div>
        <div
          style={{
            display: "flex",
            maxWidth: 1030,
            color: "#ffffff",
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: -2,
          }}
        >
          {article.title}
        </div>
        <div
          style={{
            display: "flex",
            maxWidth: 960,
            color: "#d4d4d4",
            fontSize: 26,
            lineHeight: 1.35,
          }}
        >
          {article.excerpt}
        </div>
      </div>
    ),
    blogSocialImageSize,
  );
}
