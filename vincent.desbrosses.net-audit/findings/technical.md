# Technical SEO Findings — vincent.desbrosses.net

Audited 2026-09-09. Live domain: `vincent.desbrosses.net` (Vercel). Canonical domain per owner: **vincent.desbrosses.net**.

## CRITICAL — Site-wide dead-domain references
`NEXT_PUBLIC_SITE_URL` is unset in Vercel production, so three files fall back to the
hardcoded default `https://vincent-desbrosses.com`, which **does not resolve** (NXDOMAIN,
confirmed via `dig +short` → empty).

| Source | Line | Emits |
|---|---|---|
| `src/app/[locale]/layout.tsx` | 30 | canonical, hreflang (en/fr/x-default), og:url, og:image, twitter:image, JSON-LD `url`/`image` |
| `src/app/sitemap.ts` | 5 | all 4 sitemap URLs |
| `src/app/robots.ts` | 5 | the `Sitemap:` directive |

Live evidence on `/en`:
```
<link rel="canonical" href="https://vincent-desbrosses.com/en"/>
<link rel="alternate" hrefLang="en"  href="https://vincent-desbrosses.com/en"/>
<link rel="alternate" hrefLang="fr"  href="https://vincent-desbrosses.com/fr"/>
<link rel="alternate" hrefLang="x-default" href="https://vincent-desbrosses.com/en"/>
<meta property="og:image" content="https://vincent-desbrosses.com/pp.jpg"/>
```
**Impact:** a canonical pointing at an unresolvable host tells Google the authoritative
copy lives elsewhere. This is the single most likely reason the site is not ranking for
its own brand terms. Social previews (LinkedIn/X/Slack) are also broken because og:image
404s at DNS level.

**Fix:** set `NEXT_PUBLIC_SITE_URL=https://vincent.desbrosses.net` in Vercel (all
environments) and redeploy. Then update the three hardcoded fallbacks to the same value
so a future missing env var fails safe.

**Falsifiability:** after deploy, `curl -s https://vincent.desbrosses.net/en | grep canonical`
must return the .net host. In Search Console, "Alternate page with proper canonical tag"
exclusions should drain within 2–4 weeks.

## CRITICAL — Every sub-page canonicalises to the locale homepage
`generateMetadata` is defined **only** in `src/app/[locale]/layout.tsx`, setting
`canonical: ${baseUrl}/${locale}`. Layout metadata is inherited by every child route, so:

- `/en/integration` → `<link rel="canonical" href="https://vincent-desbrosses.com/en">`

The integration page declares itself a duplicate of the homepage. Even after the domain is
fixed, this bug alone keeps every present and future sub-page out of the index.

**Fix:** remove `canonical` from the layout; set it per-route via a `generateMetadata` in
each `page.tsx` (or compute from the actual pathname).

## CRITICAL — HTTP 500 on unmatched single-segment dotted paths
Confirmed: `/llms.txt`, `/foo.txt`, `/ads.txt`, `/favicon.png`, `/sitemap.xml.gz` all return
**500** with `x-matched-path: /[locale]`. Controls: `/.well-known/security.txt` (two
segments) → 404 correctly; `/this-page-does-not-exist-xyz` (no dot) → 307 → locale 404;
`/favicon.ico` (real file) → 200.

**Root cause (confirmed in source):** `middleware.ts` matcher excludes any path containing a
dot (`.*\..*`). Such a path skips next-intl middleware and is matched by the App Router
against the `[locale]` dynamic segment. Then `src/app/[locale]/layout.tsx:113`:
```ts
const messages = (await import(`../../i18n/${locale}.json`)).default;
```
throws MODULE_NOT_FOUND for `locale="llms.txt"`. There is **no locale allowlist guard and
no `notFound()`** on this path. Note `i18n.ts` *does* validate correctly — line 113 bypasses
it, and the imported `getMessages` is never used for messages.

**Fix:**
```ts
import { notFound } from "next/navigation";
import { locales } from "../../../i18n.config";
if (!locales.includes(locale as (typeof locales)[number])) notFound();
```
before the import. Also add `src/app/not-found.tsx` — none exists (no `not-found.tsx`,
`error.tsx` or `global-error.tsx` anywhere in `src/`).

**Falsifiability:** `/llms.txt` must return 404, not 500. Watch Search Console
→ Crawl stats → server errors (5xx) fall to zero.

## HIGH — robots.txt Disallow rule matches nothing
```
Disallow: /integration
```
The real URLs are `/en/integration` and `/fr/integration` (both HTTP 200, no `noindex`
meta — verified absent). robots.txt uses **prefix** matching, so `/integration` does not
match a path starting `/en/`. The rule is inert and the pages are fully indexable —
the opposite of the apparent intent, and they are simultaneously listed in the sitemap.

**Fix — decide the intent, then do one of:**
- Keep them out of the index: add `robots: { index: false }` via route metadata (a
  `noindex` meta is authoritative; robots.txt only blocks crawling, not indexing), and
  drop them from `sitemap.ts`.
- Or index them: remove the Disallow line, give the page its own title/description/H1
  and self-canonical.

Do not leave the current contradictory state (sitemap says index, robots says crawl-block, meta says nothing).

## HIGH — Security headers largely absent
On `https://vincent.desbrosses.net/en`:

| Header | Status |
|---|---|
| `strict-transport-security` | present — `max-age=63072000`, but no `includeSubDomains`, no `preload` |
| `x-content-type-options` | **absent** |
| `x-frame-options` | **absent** |
| `content-security-policy` | **absent** |
| `referrer-policy` | **absent** |
| `permissions-policy` | **absent** |

Add a `headers()` block to **`next.config.mjs`** (note: this project uses `.mjs`; there is
no `next.config.js`). Not a direct ranking factor, but a trust/quality signal and cheap.

## PASS — verified correct, no action
- **Redirects:** all single-hop. `/` → 307 `/en`; `/en/` → 308 `/en`; http → 308 https. No chains.
- **Caching:** HTML `private, no-cache` (correct — locale cookie); `/_next/static/*`
  `public, max-age=31536000, immutable` with ETag and Vercel cache HIT.
- **Compression:** Brotli (`content-encoding: br`).
- **Viewport:** `width=device-width, initial-scale=1` present. Charset via HTTP header (valid).
- **HTTPS:** enforced, valid cert.

## INFO
- Root `/` uses **307** (temporary) rather than 308. Standard next-intl behaviour and
  acceptable, but it is not a permanent consolidation signal toward `/en`.
- No `generateStaticParams` in `[locale]/layout.tsx`, so locale routes are not statically
  pre-rendered. Adding it would improve TTFB.
- `viewport` is set inside the `metadata` object (`layout.tsx:38`). Next.js 14+ expects a
  separate `export const viewport`; the current form is deprecated and may warn on build.
