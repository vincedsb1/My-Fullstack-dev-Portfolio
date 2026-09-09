# Performance Re-Audit — https://vincent.desbrosses.net/en

Date: 2026-09-09
Context: Re-measurement after deploy that moved `/en` and `/fr` from dynamic (ƒ) to SSG (●) via `generateStaticParams`, added security headers, added a `<noscript><style>` block, rewrote the Skills section, and added `SmartFlowIllustration` (SVG).

## Tooling status (important caveat)

- **PSI API**: quota exhausted for the day (`Queries per day` limit hit) — both the wrapped tool and a direct unauthenticated call to `pagespeedonline.googleapis.com` returned HTTP 429. **No PSI/Lighthouse lab run was obtainable.**
- **Lighthouse CLI (13.4.1)**: Chrome could not launch inside this sandboxed environment (`Unable to connect to Chrome`, `path_service.cc:264 Failed to get the path`), with and without `--no-sandbox`. **No local Lighthouse run was obtainable.**
- **CrUX field data**: unavailable, no Google API key configured (per task brief), consistent with prior audits.

As a result, **the browser-rendered metrics that require an actual Lighthouse/Chrome trace (LCP timing, LCP subparts, CLS score, TBT/main-thread work, render-blocking classification) could NOT be re-measured this session** and must be re-run once Lighthouse/PSI access is available (quota resets daily; retry in a non-sandboxed shell or via `npx lighthouse` on a machine with a launchable Chrome). Everything below is what could be independently verified via raw HTTP (curl) against the live production URL, which is a legitimate but partial substitute for items 5 (TTFB) and 4/6 (byte weight, render-blocking classification of the noscript block).

## 1. LCP + subparts + LCP element

**Not measured this session** (no Lighthouse/PSI run available). Cannot confirm whether the previous 2.53s lab LCP has changed, and cannot confirm the LCP element or its render-delay/load-time subparts.

Indirect signal only: response headers confirm the SSG change is live in production —
```
x-nextjs-prerender: 1
x-vercel-cache: HIT
age: 292
```
This means `/en` is now served as a prerendered static page from Vercel's edge cache rather than rendered on demand, which is consistent with (but not proof of) an improved TTFB feeding into LCP. **Re-run Lighthouse to confirm actual LCP delta.**

## 2. CLS

**Not measured this session** (requires a real paint/layout trace). Cannot confirm whether the Skills rewrite or `SmartFlowIllustration` introduced any shift.

Static-analysis check only: the profile `<img>` in the HTML has explicit `width="1084" height="1084"` attributes, so it is dimensioned (good practice, low shift risk). The one inline `<svg>` found in the shipped HTML was not individually inspected for explicit width/height/viewBox sizing — recommend confirming `SmartFlowIllustration`'s root SVG has explicit dimensions or a fixed-aspect-ratio wrapper before trusting CLS stayed at 0. **Re-run Lighthouse to get an actual CLS score.**

## 3. TBT / main-thread work (INP proxy)

**Not measured this session** (requires a Lighthouse trace; no substitute available via curl). Cannot state whether the previous 70ms TBT changed. Note per skill guidance: INP, not FID, is the correct field metric; TBT here is used only as a lab proxy.

## 4. Page weight vs previous 340KB / 20 requests / 216KB JS

Measured via direct curl against production (brotli-compressed wire size, matching what a browser would actually transfer):

| Asset | Wire size (br) |
|---|---|
| HTML (`/en`) | 18.8 KB |
| CSS × 3 chunks | 2.7 + 7.0 + 2.4 = 12.1 KB |
| JS — 14 chunks referenced in the document | 254.4 KB total |
| Font (woff2, preloaded) | 48.4 KB (uncompressed; woff2 is already compressed, no br applied) |
| Profile image (`w=1200` variant) | 76.7 KB |

- JS wire total (**254 KB**) is **+38 KB (~+18%)** vs the previous lab figure of 216 KB. This is directionally consistent with "Skills section substantially rewritten with more content" and the new `SmartFlowIllustration` component both shipping additional client-side code/markup.
- Caveat: this JS total sums **every** `<script src>` chunk referenced in the delivered HTML, which can include chunks not strictly required for first paint (e.g., low-`fetchPriority` or route-prefetch chunks such as the one explicitly marked `fetchPriority="low"`). Lighthouse's "216KB JS" figure was scoped to what its trace recorded as loaded during the run, so this is not a strict apples-to-apples comparison — flagging as directional evidence, not a confirmed regression amount.
- Total page weight and request count (340KB/20 requests baseline) **not measured** this session — that requires a full network waterfall from a real browser load, which curl cannot reconstruct (no CSS-referenced fonts/images, no lazy-loaded below-fold images, no client-navigation prefetches). **Re-run Lighthouse/PSI for an authoritative weight and request-count comparison.**

## 5. TTFB

Measured directly against production with `curl -w` (3 runs, cold DNS/TLS then warm keep-alive was not reused — each run is a fresh connection):

| Run | TTFB (time_starttransfer) |
|---|---|
| 1 | 306 ms |
| 2 | 155 ms |
| 3 | 147 ms |

Response headers confirm the page is being served from Vercel's edge cache as a static prerender:
```
x-vercel-cache: HIT
x-nextjs-prerender: 1
age: 292
cache-control: public, max-age=0, must-revalidate
```
This is a curl-measured TTFB, not a Lighthouse lab TTFB, so it is **not directly comparable** to the earlier Lighthouse-reported TTFB subpart, but it is strong direct evidence the SSG change is deployed and being served from cache with sub-350ms response times. **Severity: informational/positive** — re-run Lighthouse to get the officially comparable TTFB subpart number, but the underlying architecture change (dynamic → SSG) is confirmed live.

## 6. `<noscript><style>` block — render-blocking check

Verified in the shipped HTML:
```html
<noscript><style>[data-aos]{opacity:1!important;transform:none!important}</style></noscript>
```
This is **not render-blocking**. Content inside `<noscript>` is only parsed/applied by the browser when scripting is disabled; with JavaScript enabled (the case for virtually all Lighthouse/CrUX/real-user sessions), the browser skips this block entirely — it adds no CSSOM work, no extra request, and no parser-blocking behavior. **Severity: none / no action needed.**

## Summary of what changed vs. what's confirmed

| Item | Status |
|---|---|
| SSG deploy live in production | **Confirmed** via `x-nextjs-prerender: 1` / `x-vercel-cache: HIT` headers |
| TTFB (curl, informal) | 147–306ms, cache HIT — looks healthy, but not a Lighthouse-comparable number |
| LCP value/subparts/element | **Not measured** — needs Lighthouse/PSI re-run |
| CLS score | **Not measured** — needs Lighthouse/PSI re-run |
| TBT / main-thread work | **Not measured** — needs Lighthouse/PSI re-run |
| Total page weight / request count | **Not measured** — needs Lighthouse/PSI re-run |
| JS wire weight (proxy via curl) | 254 KB, up ~38 KB vs previous 216 KB (directional only, not authoritative) |
| noscript style block render-blocking risk | **None** — confirmed inert unless JS disabled |

## Recommendations (priority order)

1. **[HIGH] Re-run Lighthouse/PSI as soon as quota/API access allows.** This audit could not obtain LCP, CLS, or TBT — the three metrics the task specifically asked to re-verify against the previous run. Nothing in this report should be treated as confirming or refuting the previous 2.53s LCP / 0 CLS / 70ms TBT numbers.
2. **[MEDIUM] Verify the JS growth is intentional and tree-shaken.** The +~38KB wire-size JS increase lines up with the Skills rewrite and the new SVG illustration component; confirm `SmartFlowIllustration` doesn't pull in unnecessary dependencies and that the Skills section content isn't duplicated across locale bundles.
3. **[LOW] Confirm `SmartFlowIllustration`'s SVG has explicit width/height (or a CSS aspect-ratio box)** before assuming CLS remains at 0, since it's new below-the-fold/inline content.
4. **[INFO] No action needed on the `<noscript>` block** — it's a false-positive risk, not an actual regression.
5. **[INFO] SSG migration is confirmed deployed and serving from edge cache**, which is the expected win for TTFB; get it validated in the next successful Lighthouse run.
