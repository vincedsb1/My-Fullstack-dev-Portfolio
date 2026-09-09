# Structured Data Audit — vincent.desbrosses.net (/en, /fr)

Audited: 2026-09-09
Source: `src/app/[locale]/layout.tsx`, `src/app/sitemap.ts`, `src/app/components/FAQ.tsx`, `src/app/components/Projects3.tsx`, live fetch of `https://vincent.desbrosses.net/en`

## 1. Critical Finding — Structured Data Is Invisible to Google (confirmed independently)

**Detection method:** fetched live HTML of `/en` and grepped for JSON-LD script tags vs. the `other` metadata field.

```
grep -c '<script type="application/ld+json"'  → 0
grep -c 'name="application/ld+json"'          → 1
```

Live output:

```html
<meta name="application/ld+json" content="{&quot;@context&quot;:&quot;https://schema.org&quot;,&quot;@type&quot;:&quot;Person&quot;,...}">
```

**Root cause:** `src/app/[locale]/layout.tsx` (`generateMetadata`, lines 75–103) puts the Person schema inside Next.js Metadata's `other` field:

```ts
other: {
  "application/ld+json": JSON.stringify({ ... }),
}
```

Next.js's Metadata API renders arbitrary keys in `other` as `<meta name="..." content="...">` tags — it does **not** special-case `application/ld+json` into a `<script>` tag. The result is a meta tag whose `content` attribute is an HTML-entity-escaped JSON string. This is not parseable structured data by any search engine or rich-result validator. **Google effectively sees zero schema.org markup on this site.**

**Compounding bug — broken domain in the payload itself, confirmed live:**

```
url:   "https://vincent-desbrosses.com"
image: "https://vincent-desbrosses.com/pp.jpg"
```

DNS check:
```
dig +short vincent-desbrosses.com   → (no answer, NXDOMAIN)
dig +short vincent.desbrosses.net   → resolves via Vercel DNS (live site)
```

`vincent-desbrosses.com` (hyphenated .com) does not resolve at all. The real, live domain is `vincent.desbrosses.net`. This comes from the fallback default `process.env.NEXT_PUBLIC_SITE_URL || "https://vincent-desbrosses.com"` used in `layout.tsx` **and** repeated identically in `src/app/sitemap.ts`. If `NEXT_PUBLIC_SITE_URL` isn't set in the Vercel project's env vars, every canonical URL, OG image, hreflang alternate, sitemap entry, and (if fixed) JSON-LD `url`/`image` field silently points at a dead domain. This should be verified/set explicitly regardless of the schema fix.

**Severity: Critical.** Two independent failures stacked: (1) the markup is not machine-readable at all, and (2) even if it were, its `url`/`image` point to a non-resolving domain.

---

## 2. Correct Implementation

Render real `<script type="application/ld+json">` elements in the **component body** (server component), not through `metadata.other`. Recommended pattern: a small reusable `JsonLd` server component, called from `layout.tsx` for site-wide schema (Person, WebSite, ProfilePage) and optionally from `page.tsx` for page-specific schema (ItemList of works).

### `src/app/components/JsonLd.tsx` (new file)

```tsx
// Server component — no "use client" needed, renders a real <script> tag.
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output here is safe: it is not user-controlled HTML,
      // and Next.js does not otherwise escape script children automatically,
      // so we strip "</" sequences to prevent premature script termination.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
```

### `src/app/[locale]/layout.tsx` — remove `other`, add real JSON-LD

Remove the entire `other: { "application/ld+json": ... }` block from `generateMetadata`, and render schema in the component body instead:

```tsx
import JsonLd from "../components/JsonLd.tsx";

// ...generateMetadata stays, MINUS the `other` field entirely...

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = (await import(`../../i18n/${locale}.json`)).default;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vincent.desbrosses.net";
  const pageUrl = `${baseUrl}/${locale}`;

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${baseUrl}/#person`,
    name: "Vincent DESBROSSES",
    url: pageUrl,
    jobTitle: "Fullstack Developer",
    description:
      "From ideation to completion, my skillset covers the full lifecycle of a web project.",
    image: `${baseUrl}/pp.jpg`,
    email: "mailto:vincedsb@gmail.com",
    sameAs: [
      "https://www.linkedin.com/in/vincent-desbrosses/",
      "https://github.com/vincedsb1",
      "https://twitter.com/vincedsb",
    ],
    knowsAbout: [
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "PostgreSQL",
      "Web Development",
      "Fullstack Development",
    ],
    worksFor: {
      "@type": "Organization",
      name: "Vincent DESBROSSES — Freelance",
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    url: baseUrl,
    name: "Vincent's Portfolio",
    description:
      "Dive into my world of creativity, experience, and digital connections.",
    inLanguage: locale === "fr" ? "fr-FR" : "en-US",
    publisher: { "@id": `${baseUrl}/#person` },
  };

  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${pageUrl}/#profilepage`,
    url: pageUrl,
    inLanguage: locale === "fr" ? "fr-FR" : "en-US",
    isPartOf: { "@id": `${baseUrl}/#website` },
    mainEntity: { "@id": `${baseUrl}/#person` },
  };

  return (
    <html lang={locale}>
      <head>
        <meta
          name="google-site-verification"
          content="PW82MjVgB5OXOfa6RcjIX06LfN3lZ1arROcD41Ao1z4"
        />
        <JsonLd data={personSchema} />
        <JsonLd data={websiteSchema} />
        <JsonLd data={profilePageSchema} />
      </head>
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

Note: placing `<script type="application/ld+json">` inside `<head>` via a server component works fine in the App Router (Next hoists/keeps `<head>` children as-is for non-Metadata-API elements); it also renders correctly if moved to the top of `<body>` if preferred — either is valid per Google's guidelines, which only require the script to be present in the rendered HTML.

**Also fix the same broken-domain fallback in `src/app/sitemap.ts`** (`"https://vincent-desbrosses.com"` → `"https://vincent.desbrosses.net"`), and confirm `NEXT_PUBLIC_SITE_URL=https://vincent.desbrosses.net` is actually set in the Vercel project environment variables so the fallback is never exercised in production.

---

## 3. Recommended Schema Types — Justification

| Type | Include? | Why |
|---|---|---|
| **Person** | Yes (primary) | This is fundamentally a personal portfolio for one individual, Vincent DESBROSSES. Person is the correct anchor entity; supports Knowledge Panel eligibility and entity disambiguation for the name. |
| **WebSite** | Yes | Standard site-level entity; ties `ProfilePage` and future pages together via `@id` references, and is a prerequisite for `sameAs`/entity graph coherence. Not used for sitelinks searchbox here since there's no internal site search — omitted `potentialAction`. |
| **ProfilePage** | Yes | Google explicitly supports `ProfilePage` with a `mainEntity` of type `Person`/`Organization` for personal/professional profile pages, which is precisely this page's purpose (`mainEntityOfPage` pattern). Low effort, directly matches page intent. |
| **CreativeWork / SoftwareApplication per project** | Conditional — recommended as an **ItemList of `CreativeWork`**, not `SoftwareApplication` | The projects (Allaw, Truthify, SmartFlow, CodeMaster, etc.) are web apps Vincent built, not apps users install/rate via app-store-style listings — `SoftwareApplication` expects `applicationCategory`/`operatingSystem`/aggregateRating semantics that don't fit and there's no rich-result trigger for it here. `CreativeWork` is the safer, honest fit for "things I built," wrapped in an `ItemList` on the page to associate them with the `Person` as `owns`/`creator`. This does **not** unlock a distinct rich result on its own, so treat it as a nice-to-have for entity/GEO clarity, not a SERP-feature ask. |
| **BreadcrumbList** | Not recommended | Single-page portfolio with only one meaningful secondary route (`/integration`); no deep hierarchy to justify breadcrumbs. |
| **FAQPage** | Not recommended (see §4) | |

### Project ItemList (optional, page-level — `src/app/[locale]/page.tsx`)

Add via the same `JsonLd` component inside the page:

```tsx
const projectsListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": `${pageUrl}/#projects`,
  name: "Projects by Vincent DESBROSSES",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "CreativeWork",
        name: "Allaw",
        url: "https://www.allaw.fr",
        creator: { "@id": `${baseUrl}/#person` },
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "CreativeWork",
        name: "Truthify",
        url: "https://www.truthify.eu/",
        creator: { "@id": `${baseUrl}/#person` },
      },
    },
    {
      "@type": "ListItem",
      position: 3,
      item: {
        "@type": "CreativeWork",
        name: "SmartFlow",
        url: "https://www.smartflow-app.com/",
        creator: { "@id": `${baseUrl}/#person` },
      },
    },
    // ...remaining projects from src/app/components/Projects3.tsx
    // (codeMaster, decorNature, teslaApp, emmausConnect, wilderGame,
    // legalConstat), each with its live `url` field from that file.
    // Skip entries with url: undefined (aiSystem, aimoto currently have
    // no public URL) or link to the GitHub repo instead where available
    // (e.g. aiSystem → https://github.com/vincedsb1/ai-system).
  ],
};
```

Pull `name`/`url` for each item directly from the `projects` array already defined in `src/app/components/Projects3.tsx` (lines ~150–310) rather than hardcoding — that array is the single source of truth and already has `url` per project.

---

## 4. FAQ Component — Info Severity Only

**Live check:** `id="faqGlobalContainer"` and associated FAQ markup **are present and rendered** on the live `/en` page (confirmed via HTML fetch — FAQ heading/intro/accordion all render). `src/app/components/FAQ.tsx` pulls 5 Q&A items from `t("faq.items.0..4")` and renders them through `CustomAccordion`.

**Guidance applied:**
- Google retired FAQ rich results for **all** sites on 7 May 2026 (superseding the 2023 gov/health-only restriction). There is no SERP feature to gain from adding `FAQPage` schema anymore.
- This is marketing/portfolio FAQ content (about working with Vincent, his process, etc.), not genuine user-generated Q&A — so `QAPage` does **not** apply either; `QAPage` is for community Q&A threads with real question-askers and answerers, which this isn't.
- **Recommendation: do not add FAQPage or QAPage schema for this component.** If the team wants to mark it up for AI/GEO purposes, that benefit is unconfirmed and should be treated as optional/experimental, not a checklist item.

**Severity: Info.** No action required; noted for completeness only.

---

## 5. Validation of Generated JSON-LD

All blocks below use `@context: "https://schema.org"` (https, not http), absolute URLs, no placeholder text, and ISO 8601-compatible values (none of these types require explicit dates).

| Block | Required props present | Recommended props present | Notes |
|---|---|---|---|
| **Person** | `name` ✅ | `url` ✅, `image` ✅, `jobTitle` ✅, `sameAs` ✅, `description` ✅, `knowsAbout` ✅, `email` ✅ (as `mailto:` URI, corrected from raw string) | Added `@id` for graph linking. Domain corrected to live host. |
| **WebSite** | `name` ✅, `url` ✅ | `description` ✅, `inLanguage` ✅, `publisher` ✅ (linked via `@id`) | No `potentialAction`/SearchAction included — site has no internal search, so omitting is correct (a fake SearchAction would fail validation intent). |
| **ProfilePage** | `mainEntity` ✅ | `url` ✅, `inLanguage` ✅, `isPartOf` ✅ | `mainEntity` correctly references the `Person` node via `@id` rather than duplicating the object, per Google's linked-data guidance. |
| **ItemList (projects)** | `itemListElement` ✅ with `position` + `item` on each `ListItem` ✅ | `name` ✅ on the list; each nested `CreativeWork` has `name`+`url`+`creator` | Entries with no public URL should be dropped or pointed to the GitHub repo — do not leave `url` empty/placeholder, which would fail the "no placeholder" check. |

One fix applied during validation: the original broken payload used `email: "vincedsb@gmail.com"` as a bare string — schema.org's `email` property expects the value to work as an identifier; Google's own examples and Person guidelines use the `mailto:` URI form, so the corrected version uses `email: "mailto:vincedsb@gmail.com"`.

---

## Summary of Required Actions

1. **Critical:** Move Person (and new WebSite/ProfilePage) schema out of `metadata.other` into a real `<script type="application/ld+json">` via a server component (`JsonLd.tsx`), rendered in `[locale]/layout.tsx`.
2. **Critical:** Fix the broken fallback domain `https://vincent-desbrosses.com` → `https://vincent.desbrosses.net` in both `layout.tsx` and `sitemap.ts`, and confirm `NEXT_PUBLIC_SITE_URL` is set correctly in Vercel.
3. **Recommended:** Add `ItemList` of `CreativeWork` for the projects showcased, sourced from the existing `projects` array in `Projects3.tsx`.
4. **Info only, no action required:** FAQ component is live-rendered but should not receive `FAQPage` or `QAPage` schema — no SERP benefit exists for either as applied to this content.
