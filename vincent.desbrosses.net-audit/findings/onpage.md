# On-Page SEO Findings — vincent.desbrosses.net

## CRITICAL — Duplicate title/description across every page
`generateMetadata` in `src/app/[locale]/layout.tsx` hardcodes:
- title: `"Vincent's portfolio"`
- description: `"Dive into my world of creativity, experience, and digital connections."`

Because it lives in the **layout**, all routes inherit it. Verified live:

| URL | Title | Description |
|---|---|---|
| `/en` | Vincent's portfolio | Dive into my world… |
| `/fr` | Vincent's portfolio | Dive into my world… |
| `/en/integration` | Vincent's portfolio | Dive into my world… |

Three problems at once: the title carries no ranking signal (no name-as-keyword, no
stack, no role), `/fr` serves **English** metadata, and sub-pages are exact duplicates.

**The FR translations already exist and are simply unused** — `src/i18n/fr.json`:
```json
"metadata": {
  "title": "Portfolio de Vincent",
  "description": "Plongez dans mon monde de créativité, d'expérience et de connexions numériques."
}
```
`generateMetadata` never reads this namespace. Note `CLAUDE.md` documents
"Dynamic Metadata — Page title and description update based on locale" — that behaviour
is documented but not implemented.

**Recommended titles** (name first — brand search is the highest-intent query for a freelancer):

| Locale | Title | Chars |
|---|---|---|
| EN | `Vincent Desbrosses — Freelance Fullstack Developer (React, Next.js, Node.js)` | 76 |
| EN (short) | `Vincent Desbrosses — Freelance Fullstack Developer` | 50 |
| FR | `Vincent Desbrosses — Développeur Fullstack Freelance (React, Next.js)` | 69 |

Descriptions should state service + stack + availability, ~150 chars, and differ per locale.

## CRITICAL — No crawlable links anywhere on the site
The raw server HTML for `/en` contains exactly **three** `href` attributes: two hreflang
alternates (pointing at the dead domain) and one external link to `allaw.fr`.

Every navigation control is a `<button onClick={() => window.open(...)}>`:
`src/app/components/Header.tsx:128-175` (LinkedIn, GitHub, X, Malt) and the same pattern
in `Footer.tsx`. The CV button synthesises an `<a>` in JavaScript at click time:
```ts
const link = document.createElement("a");
link.href = `/${encodeURIComponent(fileName)}`;
link.download = fileName;
```

Consequences:
- **Zero outbound entity corroboration.** Nothing links the site to the LinkedIn, GitHub,
  Malt or X profiles in a form any crawler can follow. This is the main signal Google and
  LLMs use to confirm "this site is this person".
- **The CV/resume PDF is unreachable** — `grep '\.pdf'` on the server HTML returns 0. Both
  `public/Resume_Vincent_DESBROSSES.pdf` and `public/CV Vincent DESBROSSES.pdf` are
  effectively orphaned and cannot be indexed.
- **No `mailto:`** — the Email button copies to clipboard only.
- **Accessibility:** a control that navigates should be a link, not a button
  (WCAG 4.1.2 / 2.1.1). Screen-reader users get no link semantics, and `window.open`
  is popup-blocker sensitive.

**Fix:** replace with real anchors keeping identical Tailwind classes:
```tsx
<a href="https://github.com/vincedsb1" target="_blank" rel="noopener noreferrer me"
   className="…same classes…">
  <Github className="mr-2" /> {tc("github")}
</a>
```
Use `rel="me"` on identity profiles, and a plain `<a href="/Resume_Vincent_DESBROSSES.pdf" download>`
for the CV.

## HIGH — /en/integration has no H1
Verified: `grep -c '<h1'` on `/en/integration` returns **0**. It also inherits the
homepage title, description and canonical. The page is currently indexable
(the robots.txt Disallow does not match it — see technical.md) yet gives Google
nothing to rank and declares itself a duplicate of the homepage.

## MEDIUM — FAQ block is mis-nested in the heading outline
The five FAQ questions render as `H3` with no wrapping `H2`, so they are absorbed into
the preceding `H2: Journey` section:

```
H2: Journey
  H3: Independent … H3: Town Hall of Thorigny      ← real journey entries
  H3: What inspired you to work in web development? ← FAQ, wrongly nested here
  H3: What do you look for in a professional environment…
  … (5 total)
```

These five answers are the site's strongest first-person Experience content (the "E" in
E-E-A-T) and the most quotable passages for AI answer engines — but the outline hides
them under an unrelated heading. Wrap the block in its own `H2` (e.g. "About my work" /
"À propos de ma façon de travailler") using the existing `faq.title` translation key.

## MEDIUM — Duplicate H3 text
"Allaw" appears as an `H3` **three** times (twice consecutively under Projects, once
under Journey). Disambiguate, e.g. "Allaw — Legal directory platform" vs
"Allaw — Lead developer (2023–2026)".

## PASS
- Exactly one `H1` per page on `/en` and `/fr` ("Vincent DESBROSSES").
- Heading hierarchy is otherwise well formed: H1 → H2 → H3 → H4, no skipped levels.
- `<html lang>` is correct and locale-aware (`lang="en"` / `lang="fr"`).
- EN/FR body content is fully and idiomatically translated — 64/64 keys present in both
  files, zero missing keys, zero untranslated long values. The localisation work itself
  is genuinely good; only the metadata layer misses it.
