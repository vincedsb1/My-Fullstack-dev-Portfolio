export const locales = ['en', 'fr'] as const;
export const defaultLocale = 'en' as const;

export type Locale = (typeof locales)[number];

export const routing = {
  locales: locales,
  defaultLocale: defaultLocale,
  localePrefix: 'always',
} as const;
