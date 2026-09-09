# Full SEO Audit — vincent.desbrosses.net
**Date:** 2026-09-09 · **Business type:** Personal brand / freelance developer portfolio
**Stack:** Next.js 16 App Router · next-intl (en/fr) · Vercel
**Canonical domain (owner-confirmed):** https://vincent.desbrosses.net

## SEO Health Score: 40 / 100

| Category | Weight | Score | Weighted |
|---|---|---|---|
| Technical SEO | 22% | 25 | 5.5 |
| Content Quality | 23% | 58 | 13.3 |
| On-Page SEO | 20% | 30 | 6.0 |
| Schema / Structured Data | 10% | 5 | 0.5 |
| Performance (CWV) | 10% | 78 | 7.8 |
| AI Search Readiness | 10% | 35 | 3.5 |
| Images | 5% | 62 | 3.1 |
| **Total** | | | **39.7 → 40** |

The score is dragged down by a small number of configuration faults, not by weak work.
The underlying site is well built: the content is real, the French localisation is
genuine and complete, performance is good, and accessibility of images is handled. Almost
the entire deficit traces to **one unset environment variable** and **two API-misuse bugs**.

---

## Executive summary

### Top 5 critical issues
1. **Every canonical, hreflang and og:url points to a domain that does not exist.**
   `vincent-desbrosses.com` returns NXDOMAIN; `NEXT_PUBLIC_SITE_URL` is unset in production
   so three files fall back to it. This is the most likely reason the site does not rank
   for its own name.
2. **Every sub-page canonicalises to the locale homepage.** `generateMetadata` lives in the
   layout, so `/en/integration` declares `/en` as canonical and removes itself from the index.
3. **No valid structured data exists.** The Person schema is emitted via Next's metadata
   `other` field, producing `<meta name="application/ld+json">` instead of a `<script>` tag.
   Live page contains zero parseable JSON-LD.
4. **HTTP 500 on unmatched dotted paths.** `/llms.txt`, `/ads.txt`, `/favicon.png` all
   return 500 because an unvalidated `[locale]` param is used in a dynamic import.
5. **The site has three crawlable links in total.** All social profiles and the CV are
   `<button onClick={window.open()}>`, so nothing links the site to its owner's identity.

### Top 5 quick wins
1. Set `NEXT_PUBLIC_SITE_URL` in Vercel — **5 minutes**, fixes issue #1 site-wide.
2. Use the French metadata that **already exists** in `src/i18n/fr.json` but is never read.
3. Add a locale allowlist + `notFound()` guard — 3 lines, kills all the 500s.
4. Convert nav buttons to `<a href>` — fixes SEO entity signals and WCAG together.
5. Wrap the FAQ in its own `H2` — surfaces the site's best content from under "Journey".

---

## Technical SEO — 25/100
Three Critical faults (dead-domain canonicals, layout-level canonical, 500s on unmatched
paths) and two High (inert robots.txt rule, missing security headers). Redirects, caching,
Brotli compression, HTTPS and viewport are all correct. → `findings/technical.md`

Notable: `robots.txt` contains `Disallow: /integration`, but the real URLs are
`/en/integration` and `/fr/integration`. robots.txt matches by prefix, so the rule blocks
nothing — the pages are fully indexable while simultaneously being listed in the sitemap.

## Content Quality — 58/100
E-E-A-T composite **54/100**. Real substance: 732 words (`/en`) and 844 (`/fr`), a genuine
2007–2026 career timeline, ten named projects with stack tags, and five first-person FAQ
answers. Weakest axis is Authoritativeness (8/25) — no testimonials, no client references,
no external citations. → `findings/content.md`

Localisation is a genuine strength: 64/64 translation keys present in both locales, zero
missing keys, zero untranslated values. The gap is confined to the metadata layer.

## On-Page SEO — 30/100
All three pages share one generic title and one English description; `/en/integration` has
**no H1**. The heading hierarchy is otherwise clean (H1→H2→H3→H4, single H1, no skips), but
the FAQ block is mis-nested under "Journey" and "Allaw" appears as an H3 three times.
→ `findings/onpage.md`

## Schema — 5/100
Zero machine-readable structured data. The intent is right — a well-formed Person object
with `jobTitle`, `knowsAbout` and `sameAs` exists in source — but it never reaches the page
as JSON-LD. Corrected Person / WebSite / ProfilePage payloads are in `findings/schema.md`.

## Performance — 78/100  *(lab data only)*
Lighthouse 13.4.1, mobile, simulated throttling, single run. **No field data** — no Google
API key configured, so CrUX is unavailable.

| Metric | Measured | Threshold | Verdict |
|---|---|---|---|
| LCP | 2.53 s | ≤ 2.5 s | marginally over |
| CLS | 0 | ≤ 0.1 | pass |
| INP | not measurable in lab | ≤ 200 ms | TBT proxy 70 ms — good |

340 KB / 20 requests total; JS 216 KB (64%); zero third-party requests. The hero image is
correctly preloaded with `priority`. LCP subparts and the LCP element could not be
attributed — Lighthouse returned null for those audits. → `findings/performance.md`

## AI Search Readiness — 35/100
All major AI crawlers are permitted. Importantly, **732 words of real content are present
in the raw server HTML** — a non-rendering crawler does see the substance. What is missing
is machine-readable identity: no valid JSON-LD, no crawlable `sameAs` links, and a sitemap
pointing at a dead host. → `findings/geo.md`

## Images — 62/100
All 11 `<Image>` instances have alt text, `sizes` is set on all responsive images,
`priority` on the hero, AVIF/WebP enabled, and measured CLS is 0. Deductions: `public/`
holds 25 MB of unoptimised sources (largest 3.8 MB), and the OG image is 819×823 for a
`summary_large_image` card that expects 1200×630.

## Visual / rendering
Above-the-fold on mobile is strong — photo, name, role, value proposition and all six CTAs
visible without scrolling. Dark mode has good contrast, no horizontal overflow at any
viewport. Hero CTA buttons are 40 px tall, under the 48 px touch-target guideline.

**No-JS behaviour — reconciled.** Two specialists appeared to disagree here, so it was
verified directly. Both are right about different things:
- The **text is in the HTML** (732 words confirmed by parsing raw markup) — so crawlers
  that parse HTML without executing JS *do* read the content.
- The **page renders visually blank** without JS, because AOS ships
  `[data-aos^=fade][data-aos^=fade]{opacity:0}` and only reveals content when JS adds
  `.aos-animate`.

So this is **not** an indexing emergency — Google executes JS and the text is in the source
either way. It is a real **UX and resilience** risk: if AOS fails to initialise (JS error,
slow network, blocked script), a visitor sees an empty page. Consider a `<noscript>` style
override setting `[data-aos]{opacity:1}`.

*Not verified:* whether the theme/language menu opens on click — scripted clicks produced
no visible change across two attempts, which may be a harness hit-testing artefact rather
than a real defect. Worth a manual check.

---

## Coverage and limitations
- **Crawled:** 3 unique URLs (`/en`, `/fr`, `/en/integration`) — that is the entire site.
- **No field data.** No Google API key, so all performance numbers are lab, and no GSC
  indexation or impression data was available. This is the single biggest gap in the audit;
  it means the report cannot say whether the site is *currently* indexed, only that its
  configuration actively prevents correct indexing.
- **Backlinks not analysed.** Only Common Crawl tier available (0 cached domains) — it
  would have returned nothing meaningful for a personal domain.
- Local SEO, e-commerce and drift agents were not run: not a local business, not
  e-commerce, and no prior baseline exists.
