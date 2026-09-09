# Action Plan — vincent.desbrosses.net

Canonical domain confirmed by owner: **https://vincent.desbrosses.net**

Ordered by dependency, not just severity. Phase 1 items unblock everything else — the
content and schema work is wasted effort until the canonical points at a domain that exists.

---

## Phase 1 — Critical (do first, in this order)

### 1.1 Point the site at its own domain  ⏱ 5 min
The single highest-impact change in this audit.

1. Vercel → Project → Settings → Environment Variables → add for **all** environments:
   ```
   NEXT_PUBLIC_SITE_URL = https://vincent.desbrosses.net
   ```
2. Redeploy.
3. Change the three hardcoded fallbacks so a missing env var fails safe:
   - `src/app/robots.ts:5`
   - `src/app/sitemap.ts:5`
   - `src/app/[locale]/layout.tsx:30`

   ```ts
   const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vincent.desbrosses.net";
   ```

**Why:** every canonical, hreflang, og:url and sitemap URL currently names
`vincent-desbrosses.com`, which does not resolve. A canonical pointing at a dead host tells
Google the real page lives somewhere that cannot be fetched.

**Did it fail?** `curl -s https://vincent.desbrosses.net/en | grep canonical` must show the
.net host. If GSC still reports "Alternate page with proper canonical tag" after 4 weeks, it failed.

**Leading indicator:** GSC → Pages → indexed count rises above 0 for `/en` and `/fr`.

---

### 1.2 Move canonical out of the layout  ⏱ 20 min
`generateMetadata` sits only in `src/app/[locale]/layout.tsx`, so `canonical: ${baseUrl}/${locale}`
is inherited by every child route. `/en/integration` currently declares `/en` as its canonical —
it self-deindexes.

Remove `alternates.canonical` from the layout and set it per route, e.g. in
`src/app/[locale]/integration/page.tsx`:
```ts
export async function generateMetadata({ params }): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vincent.desbrosses.net";
  return { alternates: { canonical: `${baseUrl}/${locale}/integration` } };
}
```

**Did it fail?** Each URL's canonical must equal its own address. Check both pages, both locales.

---

### 1.3 Stop returning HTTP 500 on unmatched paths  ⏱ 15 min
`/llms.txt`, `/ads.txt`, `/foo.txt`, `/favicon.png` all return **500** (verified).
`src/app/[locale]/layout.tsx:113` imports `../../i18n/${locale}.json` using the raw,
unvalidated param, so a path like `/llms.txt` is matched as `[locale]` and throws
MODULE_NOT_FOUND.

```ts
import { notFound } from "next/navigation";
import { locales } from "../../../i18n.config";

const { locale } = await params;
if (!locales.includes(locale as (typeof locales)[number])) notFound();
setRequestLocale(locale);
```
Also add `src/app/not-found.tsx` (none exists today — no `not-found.tsx`, `error.tsx` or
`global-error.tsx` anywhere in `src/`). It must render its own `<html>`/`<body>`, because
the root `layout.tsx` returns bare `children`.

**Did it fail?** `curl -o /dev/null -w "%{http_code}" https://vincent.desbrosses.net/llms.txt`
must print `404`.

**Leading indicator:** GSC → Settings → Crawl stats → 5xx responses fall to zero.

---

### 1.4 Emit real structured data  ⏱ 30 min
The Person schema is passed through Next Metadata's `other` field, which renders a
**`<meta name="application/ld+json">` tag**. Verified: the live page has
`0` occurrences of `<script type="application/ld+json">`. No parser reads it.

Delete the `other` block from `generateMetadata` and render a real script tag in the
component tree (a server component is fine — see `findings/schema.md` for the full
validated Person + WebSite + ProfilePage payloads):

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
/>
```
Add Malt to `sameAs` (currently missing) alongside LinkedIn, GitHub and X.

**Did it fail?** Google Rich Results Test must detect a Person entity. `curl … | grep -c
'<script type="application/ld+json"'` must be ≥ 1.

---

## Phase 2 — High impact (week 1)

### 2.1 Real titles and descriptions, per locale  ⏱ 30 min
Currently all three pages share `"Vincent's portfolio"` and an English description —
including `/fr`. **The French strings already exist** in `src/i18n/fr.json` under
`metadata.*` and are simply never read.

```ts
const t = await getTranslations({ locale, namespace: "metadata" });
const title = t("title");
```
Then improve the source strings to carry actual search intent:

| Locale | Title (chars) |
|---|---|
| EN | `Vincent Desbrosses — Freelance Fullstack Developer (React, Next.js, Node.js)` (76) |
| FR | `Vincent Desbrosses — Développeur Fullstack Freelance (React, Next.js)` (69) |

**Did it fail?** `/fr` must return a French `<title>`. If GSC impressions for the brand
query "vincent desbrosses" don't rise within 6 weeks of indexing, revisit.

### 2.2 Convert navigation buttons to real links  ⏱ 45 min
The server HTML has **3 `href`s in total**. LinkedIn, GitHub, X, Malt and the CV are all
`<button onClick={window.open(...)}>` (`Header.tsx:128-175`, `Footer.tsx`). Nothing
crawlable connects the site to the person's other profiles, and neither CV PDF is linked
at all.

Swap to `<a href … target="_blank" rel="noopener noreferrer me">` with the same classes;
link the CV as `<a href="/Resume_Vincent_DESBROSSES.pdf" download>`. Fixes SEO entity
corroboration **and** WCAG 4.1.2 link semantics in one change.

**Did it fail?** `curl -s … | grep -c 'href="https://github.com'` must be ≥ 1.

### 2.3 Resolve the /integration contradiction  ⏱ 15 min
Today: sitemap lists it, robots.txt tries to block it with `Disallow: /integration` (which
does **not** match `/en/integration` — prefix mismatch), and the page has no `noindex`,
no H1, and the homepage's title. Pick one:
- **Exclude:** add `robots: { index: false }` to the route's metadata and remove it from `sitemap.ts`.
- **Include:** drop the Disallow line, give it a unique H1/title/description and self-canonical.

### 2.4 Fix the OG image  ⏱ 15 min
`pp.jpg` is 819×823 (near-square) served for `summary_large_image`, which expects **1200×630**
— it will be centre-cropped on LinkedIn and X. It also currently 404s at DNS level (fixed by 1.1).
Export a 1200×630 card with name + role, and consider `opengraph-image.tsx` for per-locale cards.

---

## Phase 3 — Content & authority (month 2)

### 3.1 Give the FAQ its own section  ⏱ 10 min
The five FAQ `H3`s have no wrapping `H2`, so they nest under `H2: Journey`. These are the
strongest Experience signals on the site and the most citable passages for AI answer
engines. Wrap them in an `H2` using the existing `faq.title` key.
> Do **not** add FAQPage schema — Google retired FAQ rich results for all sites on
> 7 May 2026, so there is no SERP benefit. This is a heading-structure fix only.

### 3.2 Lift authority signals  (E-E-A-T scored 54/100)
Authoritativeness is the weakest axis (8/25): no testimonials, no client references, no
Malt rating surfaced, no external citations. Highest-value additions, in order:
client testimonials with names/companies → the Malt profile rating → a short factual
bio paragraph naming years of experience and location.

### 3.3 De-duplicate "Allaw" headings  ⏱ 10 min
Appears as an `H3` three times. Qualify each with its context.

### 3.4 Serve a real /llms.txt  ⏱ 10 min
Once 1.3 makes it 404, add `public/llms.txt`. Low priority and low certainty of payoff —
llms.txt is **not** consumed by Google Search and adoption elsewhere is unproven. Do it
because it is cheap, not because it is expected to move rankings.

---

## Phase 4 — Monitoring (ongoing)

1. **Verify the property in Search Console for `vincent.desbrosses.net`.**
   A verification file for `google122ff5c15e271084.html` and a `google-site-verification`
   meta tag are already present — confirm they are attached to the **.net** property.
2. **Submit the sitemap** at `https://vincent.desbrosses.net/sitemap.xml` after Phase 1.
3. **Capture an SEO baseline** so regressions are caught on deploy:
   ```
   claude-seo run drift_baseline.py https://vincent.desbrosses.net/en
   ```
   Re-run `drift_compare.py` after each deploy — it would have caught the dead-domain
   canonical immediately.
4. **Add a Google API key** to unlock real field data (CrUX/GSC) instead of lab-only
   numbers: `claude-seo run google_auth.py --setup`.
5. **Watch monthly:** brand-query impressions, indexed page count, 5xx crawl responses.

---

## Effort summary

| Phase | Items | Effort | Expected effect |
|---|---|---|---|
| 1 — Critical | 4 | ~1h10 | Makes the site indexable at all |
| 2 — High | 4 | ~1h45 | Makes it rankable and shareable |
| 3 — Content | 4 | ~variable | Builds authority and AI citability |
| 4 — Monitoring | 5 | ~30 min setup | Prevents recurrence |

Phases 1 and 2 together are roughly **three hours of work** and address every Critical and
High finding.
