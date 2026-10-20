export const locales = ["en", "fr"] as const;
export const defaultLocale = "en" as const;

export type Locale = (typeof locales)[number];

export const routing = {
  locales: locales,
  defaultLocale: defaultLocale,
  localePrefix: "always",
  localeDetection: true,
  localeCookie: {
    name: "NEXT_LOCALE",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
  },
} as const;
