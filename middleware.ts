import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n.config";

const intlMiddleware = createMiddleware(routing);

// Google indexed the Vercel-generated production alias instead of the custom
// domain. Consolidate it with a permanent redirect. Matching on this exact
// host leaves preview deployments (which are served from distinct
// `…-git-<branch>-…vercel.app` hostnames) untouched.
const LEGACY_HOST = "portfolio-ten-chi-89.vercel.app";
const CANONICAL_ORIGIN = "https://vincent.desbrosses.net";

export default function middleware(request: NextRequest) {
  const host = request.headers.get("host");

  if (host === LEGACY_HOST) {
    const { pathname, search } = request.nextUrl;
    return NextResponse.redirect(
      `${CANONICAL_ORIGIN}${pathname}${search}`,
      308,
    );
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/", "/(en|fr)/:path*", "/((?!_next|_vercel|.*\\..*).*)"],
};
