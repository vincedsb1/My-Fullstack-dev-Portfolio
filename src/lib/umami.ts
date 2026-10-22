import { SITE_URL } from "./site";

export function getUmamiConfig() {
  if (
    process.env.NODE_ENV !== "production" ||
    process.env.VERCEL_ENV !== "production"
  ) {
    return null;
  }

  const hostUrl = process.env.NEXT_PUBLIC_UMAMI_HOST_URL?.trim();
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID?.trim();

  if (!hostUrl || !websiteId) {
    return null;
  }

  try {
    const umamiUrl = new URL(hostUrl);
    const siteUrl = new URL(SITE_URL);

    if (
      umamiUrl.protocol !== "https:" ||
      umamiUrl.pathname !== "/" ||
      umamiUrl.search ||
      umamiUrl.hash ||
      umamiUrl.username ||
      umamiUrl.password ||
      siteUrl.protocol !== "https:"
    ) {
      return null;
    }

    return {
      scriptUrl: `${umamiUrl.origin}/x.js`,
      websiteId,
      domain: siteUrl.hostname,
    };
  } catch {
    return null;
  }
}
