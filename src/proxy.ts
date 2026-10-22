import { SITE_URL } from "@/lib/site";
import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

// Google indexed the Vercel-generated production alias instead of the custom
// domain. Consolidate it with a permanent redirect. Matching on this exact
// host leaves preview deployments (which are served from distinct
// `…-git-<branch>-…vercel.app` hostnames) untouched.
const LEGACY_HOST = "portfolio-ten-chi-89.vercel.app";
const CANONICAL_ORIGIN = SITE_URL;

function protectRootLocaleRedirect(response: NextResponse) {
  response.headers.set("Cache-Control", "private, no-store");

  const vary = new Set(
    (response.headers.get("Vary") ?? "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
  );
  vary.add("Accept-Language");
  vary.add("Cookie");
  response.headers.set("Vary", Array.from(vary).join(", "));

  return response;
}

export default function proxy(request: NextRequest) {
  const host = request.headers.get("host");

  if (host === LEGACY_HOST) {
    const { pathname, search } = request.nextUrl;
    return NextResponse.redirect(
      `${CANONICAL_ORIGIN}${pathname}${search}`,
      308,
    );
  }

  // This landing page and its download endpoint are intentionally unlocalized.
  // Let them reach the root App Router instead of next-intl prefixing them.
  const pathname = request.nextUrl.pathname;
  if (
    pathname === "/juliedieris" ||
    pathname === "/juliedieris/" ||
    pathname === "/api/juliedieris/download"
  ) {
    return NextResponse.next();
  }

  const localeSegment = pathname.split("/")[1] ?? "";
  if (
    /^[a-z]{2}$/.test(localeSegment) &&
    !routing.locales.some((locale) => locale === localeSegment)
  )
    return NextResponse.next();

  const response = intlMiddleware(request);
  // NextURL normalizes loopback IPs to localhost. Preserve the incoming origin
  // so a localized rewrite stays internal on an IP-bound preview server too.
  const rewrite = response.headers.get("x-middleware-rewrite");
  if (rewrite && host) {
    const target = new URL(rewrite);
    target.host = host;
    response.headers.set("x-middleware-rewrite", target.href);
  }

  if (pathname === "/" && response.status >= 300 && response.status < 400) {
    return protectRootLocaleRedirect(response);
  }

  return response;
}

export const config = {
  matcher: ["/", "/(en|fr)/:path*", "/((?!_next|_vercel|.*\\..*).*)"],
};
