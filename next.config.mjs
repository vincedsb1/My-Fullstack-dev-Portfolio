import createMDX from "@next/mdx";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin(
  // This is the default (also the `src` folder is supported).
  "./i18n.ts",
);

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      "remark-frontmatter",
      "remark-mdx-frontmatter",
      "remark-gfm",
    ],
    rehypePlugins: [
      [
        "rehype-pretty-code",
        {
          theme: { light: "github-light", dark: "github-dark" },
          keepBackground: false,
        },
      ],
    ],
  },
});

// Applied to every response. No CSP here: it needs to be built against the
// real asset origins and verified in preview before being enforced.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  skipTrailingSlashRedirect: true,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000, // 1 year cache for optimized images
  },
  compress: true,
  poweredByHeader: false,
  outputFileTracingIncludes: {
    "/api/juliedieris/download": [
      "./docs/Julie_Dieris-Le_Silence_de_la_Nuit.epub",
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      {
        source: "/guide-premier-emploi-developpeur",
        destination: "/fr/blog/guide-premier-emploi-developpeur",
        permanent: true,
      },
      {
        source: "/guide-premier-emploi-developpeur/opengraph-image",
        destination: "/fr/blog/guide-premier-emploi-developpeur/social-image",
        permanent: true,
      },
      {
        source: "/guide-premier-emploi-developpeur/twitter-image",
        destination: "/fr/blog/guide-premier-emploi-developpeur/social-image",
        permanent: true,
      },
      {
        source: "/:path+/",
        destination: "/:path+",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(withMDX(nextConfig));
