export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://vincent.desbrosses.net"
).replace(/\/$/, "");
export const SITE_NAME = "Vincent DESBROSSES";
export const AUTHOR = {
  name: SITE_NAME,
  email: "vincedsb@gmail.com",
  twitter: "@vincedsb",
  phone: "06 66 14 82 30",
  phoneHref: "tel:+33666148230",
} as const;
export const SOCIAL_LINKS = {
  linkedin: {
    fr: "https://www.linkedin.com/in/vincent-desbrosses/",
    en: "https://www.linkedin.com/in/vincent-desbrosses/?locale=en_US",
  },
  github: "https://github.com/vincedsb1",
  x: "https://twitter.com/vincedsb",
  malt: "https://www.malt.fr/profile/vincentdesbrosses",
} as const;
export const absoluteUrl = (path = "/") => new URL(path, SITE_URL + "/").href;
