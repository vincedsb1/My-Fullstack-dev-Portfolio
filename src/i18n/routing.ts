import { defineRouting } from "next-intl/routing";
export const locales = ["en", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale = "en";
export const routing = defineRouting({
  alternateLinks: false,
  locales,
  defaultLocale,
  localePrefix: "always",
  localeCookie: { name: "NEXT_LOCALE", maxAge: 31536000 },
  pathnames: {
    "/": "/",
    "/blog": "/blog",
    "/blog/[slug]": "/blog/[slug]",
    "/projects": { en: "/projects", fr: "/projets" },
    "/projects/[slug]/social-image": {
      en: "/projects/[slug]/social-image",
      fr: "/projets/[slug]/social-image",
    },
    "/projects/[slug]": { en: "/projects/[slug]", fr: "/projets/[slug]" },
    "/projects/archive": { en: "/projects/archive", fr: "/projets/archives" },
    "/projects/preview/[variant]": {
      en: "/projects/preview/[variant]",
      fr: "/projets/preview/[variant]",
    },
    "/preview/ui": "/preview/ui",
  },
});
