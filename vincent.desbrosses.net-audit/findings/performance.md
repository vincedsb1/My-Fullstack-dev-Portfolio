# Performance Audit — https://vincent.desbrosses.net/en

**Data source: LAB DATA ONLY.** No Google API key is configured in this environment, so CrUX/PSI field data (75th-percentile real-user metrics) is unavailable. All numbers below come from a local Lighthouse 13.4.1 run (Chromium, mobile emulation, simulated throttling, single run) and a Playwright-rendered fetch of the response HTML. Lab data reflects one synthetic run under controlled conditions — it can differ meaningfully from real-world field data, especially for INP (which has no reliable lab proxy) and CLS. FID is not referenced anywhere (removed metric).

Lighthouse Performance score: **96/100** (lab, mobile, simulated throttling)

## 1. LCP

| Metric | Value | Threshold | Status |
|---|---|---|---|
| LCP | **2.53 s** (2533.9 ms) | ≤2.5s good | **Borderline / Needs Improvement** (0.03s over "good") |

- LCP subparts (TTFB / load delay / load time / render delay breakdown): **not measured**. The Lighthouse `lcp-breakdown-insight` and `lcp-discovery-insight` audits returned `null` and the CrUX-based `lcp_subparts.py` tool requires a Google API key (unavailable — errored with "Google API key not configured"). CrUX field-based LCP subparts are also unavailable for the same reason.
- **LCP element**: `largest-contentful-paint-element` audit returned `null` in this run, so the exact LCP node could not be confirmed by Lighthouse. Given the page structure, the hero profile image (`pp.jpg`, 819x823) is the most likely LCP candidate — it is preloaded (see #5) — but this is inferred, not directly measured.
- TTFB proxy: `server-response-time` audit shows the root document responded in **33 ms** (well under 200ms) — server/TTFB is not a bottleneck.
- FCP (lab): **1.07 s**. Speed Index (lab): **2.89 s**.
- Severity: **Medium**. LCP is right at the edge of the "good" threshold (2.53s vs 2.5s cutoff) in a single lab run; real-world field 75th-percentile figures (unmeasured) could plausibly land in "Needs Improvement" given typical variance above lab conditions.

## 2. CLS

| Metric | Value | Threshold | Status |
|---|---|---|---|
| CLS | **0** | ≤0.1 good | **Pass** |

- `cumulative-layout-shift` audit: 0.
- `unsized-images` audit: 0 items flagged — images observed (e.g. `allaw.jpg` via `next/image` with `data-nimg="fill"`) use proper `sizes`/responsive `srcset` and are contained in explicitly-dimensioned wrapper elements, so no unsized-image shift risk was detected in this run.
- AOS scroll animations did not register as layout shifts in this run (they typically animate opacity/transform, which don't affect CLS).
- Severity: **None / Pass**, based on this lab run. Note CLS in lab can miss shifts that only occur after user interaction or on slower real devices — field data is not available to cross-check.

## 3. INP proxy (TBT / main-thread work)

There is no lab metric for INP itself; Lighthouse's Total Blocking Time (TBT) is the standard lab proxy.

| Metric | Value | Threshold (informal proxy) | Status |
|---|---|---|---|
| TBT | **70 ms** | Lab TBT <200ms generally correlates with good INP | **Good (proxy)** |
| Main-thread work | **0.8 s** total | — | Low |
| Long tasks | 2 tasks found: 120ms (chunk `32d99f15292dc322.js`, starting at ~2062ms) and 50ms (main document, at ~1063ms) | tasks >50ms are candidates for INP risk | Minor |

- Real INP (field, 75th percentile): **not measured** — requires CrUX, unavailable.
- Severity: **Low**, based on lab proxy. Two long tasks exist but are short/isolated (120ms max), not the "excessive main-thread blocking" pattern typically seen with INP failures. FontAwesome/AOS did not show up as major script-execution offenders in this run.

## 4. Page weight breakdown (lab, mobile, this page only)

| Resource type | Requests | Transfer size |
|---|---|---|
| Total | 20 | **340,203 bytes (~332 KiB)** |
| Script (JS) | 11 | 216,275 bytes (~211 KiB) — 64% of total |
| Font | 1 | 48,718 bytes (~48 KiB) |
| Image | 4 | 42,765 bytes (~42 KiB) |
| Document (HTML) | 1 | 18,282 bytes |
| Stylesheet (CSS) | 2 | 10,940 bytes (~11 KiB) |
| Other | 1 | 3,223 bytes |
| Third-party | 0 | 0 bytes |

- JS dominates the payload (11 requests, ~211 KiB) — expected for a heavily client-rendered Next.js/AOS/FontAwesome bundle, but worth reviewing for code-splitting/tree-shaking opportunities (FontAwesome icon sets in particular are a common source of avoidable JS weight if the full icon package is imported instead of individual icons).
- Only 1 font file loaded (48 KiB) — consistent with `next/font` (Inter) self-hosting and subsetting; no separate Google Fonts network request, good.
- Two render-blocking CSS files identified: `0a6ff56d9459c219.css` (1.8 KB) and `3622b0fbb34f538d.css` (9.1 KB) — combined ~11 KB blocking initial render.

## 5. Hero image preload (pp.jpg, 819x823)

**Confirmed via direct HTML inspection of the rendered `<head>`:**

```html
<link rel="preload" as="image"
  imageSrcSet="/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fpp.dc4f0378.jpg&w=32&q=75 32w, ... &w=3840&q=75 3840w"
  imageSizes="(max-width: 640px) 192px, 240px"/>
```

- The hero profile image is correctly preloaded with a full responsive `imageSrcSet`/`imageSizes` pair, consistent with Next.js `<Image priority />` behavior. This is a **best-practice pass** — the browser can discover and start fetching the correct hero image variant early without waiting for main-thread JS execution.
- Caveat: the Lighthouse `preload_check.py` companion tool separately reported `lcp_resource_hints.preload_lcp_candidate: false` and `fetchpriority_high: 0`, and gave this page a resource-hints score of 25/100 — meaning Lighthouse's own LCP-candidate detection did not tie this preload to the LCP element in its trace (consistent with the `largest-contentful-paint-element` audit returning `null` above). This may be a lab-run/tooling limitation rather than a real regression, but it means **the LCP-preload linkage could not be independently confirmed by Lighthouse's trace analysis** — flagging as a verification gap, not a confirmed defect.
- Severity: **Low** — the preload markup itself is correct and present; the only issue is that automated LCP-element attribution didn't fire cleanly in this run.

## 6. Third-party scripts

- `resource-summary` and `third-parties-insight` audits both report **0 third-party requests and 0 bytes** on this page. No third-party script cost was detected in this lab run (this differs from the `/integration` page, which is known to load an external Allaw embed script — not tested here since only `/en` was in scope).
- Severity: **None** for this URL.

## Threshold comparison summary

| Metric | Lab value (this run) | "Good" threshold | Status |
|---|---|---|---|
| LCP | 2.53 s | ≤2.5 s | Borderline / Needs Improvement (Medium severity) |
| INP (proxy: TBT) | 70 ms TBT | proxy only; real INP ≤200ms | Good (proxy), real INP not measured |
| CLS | 0 | ≤0.1 | Pass |

## Not measured (requires Google API key / CrUX access)

- Field CrUX 75th-percentile LCP, INP, CLS for this URL.
- LCP subparts breakdown (TTFB / load delay / load time / render delay) — both the CrUX-based and Lighthouse-trace-based sources failed for this run.
- Confirmed LCP DOM element identity (Lighthouse trace attribution returned null this run).
- Performance of the `/fr` locale and `/integration` subpage (out of scope for this run; `/integration`'s known third-party Allaw embed was not measured here).

## Prioritized recommendations

1. **(Medium)** Re-run Lighthouse trace analysis (or obtain a PSI/CrUX API key) to confirm the true LCP element and get real LCP subpart timings — current 2.53s figure is a single lab sample right at the pass/fail boundary and needs corroboration before concluding pass or fail.
2. **(Medium)** Reduce render-blocking CSS: two stylesheets (1.8 KB + 9.1 KB) currently block first paint; consider inlining critical CSS or using `next/head` priority hints.
3. **(Low-Medium)** Audit JS bundle composition (11 requests, ~211 KiB) — verify FontAwesome is imported per-icon rather than as a full icon package, and check AOS is not duplicated/bundled unnecessarily with other animation code.
4. **(Low)** Compress `allaw.jpg` project screenshot — Lighthouse flagged 13.6 KB of wasted bytes because the delivered image (709x533) is oversized for its rendered dimensions (325x231).
5. **(Low)** Obtain Google API credentials to enable CrUX field-data validation — lab data alone (especially at a 2.53s LCP borderline case) is insufficient to confirm real-user pass/fail against the 75th-percentile Core Web Vitals thresholds.
