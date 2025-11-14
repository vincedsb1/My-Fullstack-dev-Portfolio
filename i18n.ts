import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale, type Locale } from './i18n.config';

export default getRequestConfig(async ({ locale }) => {
  // Valider que la locale demandée est supportée
  const validLocale: Locale = locales.includes(locale as Locale)
    ? (locale as Locale)
    : defaultLocale;

  return {
    locale: validLocale,
    messages: (await import(`./src/i18n/${validLocale}.json`)).default,
  };
});
