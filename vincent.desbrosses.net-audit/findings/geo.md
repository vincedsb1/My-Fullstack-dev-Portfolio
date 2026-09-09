# GEO / AI Search Readiness Audit — vincent.desbrosses.net/en

Date: 2026-09-09
Auditor: Claude (GEO agent)

## GEO Readiness Score: 34 / 100

| Dimension | Weight | Score | Notes |
|---|---|---|---|
| Citability | 25% | 30/100 | Content exists in raw HTML but is list-like (skills chips, project cards), not self-contained prose passages; trafilatura extraction keeps only 970 of ~5,000 chars of visible text |
| Structural Readability | 20% | 55/100 | Real `<h1>/<h2>/<h3>` hierarchy present in raw HTML (good), including 5 FAQ-style `<h3>` questions ("What inspired you to work in web development?" etc.) — a strong asset, but no answer text visible in raw extraction and no FAQPage schema |
| Multi-Modal Content | 15% | 20/100 | Profile photo only; no video, no diagrams, no downloadable structured data (CV is a PDF link only) |
| Authority & Brand Signals | 20% | 15/100 | JSON-LD Person schema is malformed (emitted as `<meta name="application/ld+json">` instead of `<script type="application/ld+json">`, so zero parsers will read it); the only sameAs data exists inside that broken tag; **no actual crawlable `<a href>` links to LinkedIn/GitHub/X/Malt exist anywhere in the raw HTML** — they are JS-only |
| Technical Accessibility | 20% | 40/100 | Raw (no-JS) fetch DOES return substantial content (name, skills, journey, project list) — better than assumed — but canonical URL, hreflang alternates, og:url, og:image, and the JSON-LD `url` field all point to `vincent-desbrosses.com`, a domain that does not resolve (curl connect failure) |

Weighted score: 0.25×30 + 0.20×55 + 0.15×20 + 0.20×15 + 0.20×40 = **33.5 ≈ 34/100**

---

## 1. AI Crawler Accessibility (robots.txt)

```
User-Agent: *
Allow: /
Disallow: /integration
Sitemap: https://vincent-desbrosses.com/sitemap.xml
```

Precise per-bot interpretation — there are no bot-specific rules, so **every crawler is governed by the wildcard `User-Agent: *` block**:

| Crawler | Status | Notes |
|---|---|---|
| GPTBot (OpenAI) | **Allowed** (site-wide except `/integration`) | Good for ChatGPT browsing/citation |
| OAI-SearchBot | **Allowed** | |
| ClaudeBot | **Allowed** | |
| PerplexityBot | **Allowed** | |
| Google-Extended | **Allowed** | Governs Gemini/AI Overviews training+grounding use of content |
| Bingbot | **Allowed** | Feeds Bing/Copilot |
| CCBot | **Allowed** (not blocked) | Common Crawl feeds many downstream LLM training sets; site does not opt out even though the CLAUDE.md-adjacent GEO guidance recommends blocking training-only bots if desired — this is a policy choice, not a bug |
| anthropic-ai | **Allowed** (not blocked) | Same as above |

**Severity: Low.** Crawler access itself is fine — nothing is blocked that shouldn't be. The real problem is the **Sitemap directive points to a dead domain** (`vincent-desbrosses.com`), so crawlers that rely on robots.txt to discover the sitemap for URL enumeration get a dangling reference. **Severity: Medium** (discovery, not access, is impaired).

---

## 2. Raw HTML vs. Rendered Content (SSR verification)

Used `claude-seo run render_page.py https://vincent.desbrosses.net/en --mode auto --json`.

- `is_spa: false`, `mode_used: raw` — the tool determined a raw fetch was sufficient (no SPA shell detected), meaning **Next.js is server-rendering the page**, not shipping an empty `<div id="root">`.
- Raw HTML (`raw_content`, no JS execution) is 115,948 bytes and, after stripping scripts/styles, contains **~5,000 characters of real visible text**: full name, tagline, all skill categories (Design/Front-end/Back-end/Other with every listed technology), all 9 projects with descriptions and tech stacks, and the full career journey (7 roles with dates and descriptions), plus 5 FAQ-style headings.
- **Correction to the initial assumption**: this is not "heavily client-rendered" in the sense of hiding content from non-JS crawlers — the substantive text is present without JS. The `"use client"` directives affect interactivity/hydration, not initial HTML payload, because Next.js still performs server rendering for the initial response.
- **However**, `extracted_text` (trafilatura, boilerplate-stripped) captured only **970 characters** — just the project list — dropping the name, tagline, skills, and journey entirely. This means content-extraction pipelines that lean on readability/boilerplate-removal heuristics (which many AI answer engines and third-party crawlers use to avoid ingesting nav/chrome) may see **only ~20% of the real content**, because the bio/skills/journey sections aren't wrapped in semantics (e.g., `<article>`, `<p>` prose) that these heuristics reward — they're short label/chip fragments in `<span>`/`<div>` structures.
- **Severity: Medium.** Raw access is fine; extractability by real-world boilerplate-stripping pipelines is not.

---

## 3. Passage-Level Citability

Score: **30/100**.

- No section reads as a self-contained, quotable answer. Content is decorative marketing copy and UI labels ("Let's talk about your next project", "A diverse set of strong skills for your projects") rather than direct, factual statements an LLM could lift verbatim.
- Skills are single-word chips (e.g., "NextJS ReactJS Tailwind Javascript") with no connecting prose — not a 134–167 word citable passage, just a tag cloud. An LLM cannot cite "Vincent Desbrosses is proficient in X because Y" — there is no Y.
- Project descriptions (e.g., Allaw: "Allaw is a web platform for legal professionals, unifying visibility, scheduling, appointments and essential office data within a clean and modern interface.") are close to the 134–167 word optimal range in *spirit* but each is only ~1–2 sentences (~25–40 words) — too short to be a self-standing citable block, and there's no attribution (dates, client name, measurable outcome) that would make it a fact an AI Overview would prefer to quote over a generic description.
- **Strongest existing asset, underused**: the 5 FAQ-style `<h3>` headings ("What inspired you to work in web development?", "What role do AI tools play in how you work today?", etc.) are exactly the question-based heading format GEO rewards — but the raw extraction didn't surface visible answer text under them, and there's no FAQPage schema to reinforce the Q&A structure for AI Overviews / Perplexity.
- No statistics, no dated claims tied to sources, no "self-contained answer block" anywhere on the page.

---

## 4. Brand / Entity Signals — "Who is Vincent Desbrosses?"

An LLM querying this today would find a **weak, uncorroborated entity**. Findings:

- **JSON-LD Person schema exists but is broken.** It's emitted as:
  ```html
  <meta name="application/ld+json" content="{&quot;@context&quot;:&quot;https://schema.org&quot;,&quot;@type&quot;:&quot;Person&quot;,&quot;name&quot;:&quot;Vincent DESBROSSES&quot;, ... }"/>
  ```
  instead of `<script type="application/ld+json">{...}</script>`. **Zero** structured-data parsers (Google Rich Results, Bing, schema.org validators, or LLM structured-data ingestion) will read this — confirmed via the render tool's own `structured_data` extraction, which found **0 JSON-LD blocks** on the page despite this meta tag existing.
- The broken JSON-LD, if it worked, would provide `sameAs`: LinkedIn (`linkedin.com/in/vincent-desbrosses`), GitHub (`github.com/vincedsb1`), X (`twitter.com/vincedsb`) — **but Malt is missing even from this broken block**, despite Malt being called out as a real social/professional presence in the portfolio.
- **Critically, none of these profile links exist as real, crawlable `<a href="...">` tags anywhere in the raw HTML.** A full href scan of the raw page found zero anchors to linkedin.com, github.com, twitter.com/x.com, or malt.fr — the social icons are rendered client-side only (JS-bound), meaning any AI crawler that doesn't execute JavaScript sees **no corroborating links at all**, only decorative icon placeholders. This directly undermines sameAs corroboration, which is the mechanism by which LLMs and knowledge panels validate "this website and this LinkedIn/GitHub profile describe the same person."
- No Wikipedia entity (expected — not a public figure), no visible Reddit or YouTube mentions detectable from this page (out of scope to verify off-site, but nothing on-page references them either).
- Name appears once as `<h1>Vincent DESBROSSES</h1>` — good, single clear entity anchor — but with no supporting bio paragraph nearby that an LLM could quote to describe who he is beyond "Fullstack developer."

**Severity: High.** This is the single biggest gap: even if crawlers reach the page, they cannot connect "Vincent Desbrosses the website" to "Vincent Desbrosses the LinkedIn/GitHub profile" through parseable markup.

---

## 5. llms.txt Status

- `/llms.txt` returns **HTTP 500**, not a 404. This is worse than simply missing a file — it signals a server-side error (likely a misconfigured route or middleware handling an unmatched path incorrectly, possibly related to the `[locale]` routing catching `/llms.txt` and failing rather than falling through to a static 404/asset).
- **Recommendation**: add a static `public/llms.txt` file (plain markdown, per the emerging llms.txt convention: title, short summary, links to key pages/CV with 1-line descriptions) so the route resolves as a static asset and returns 200 instead of erroring.
- **Accuracy caveat, not to overstate this**: llms.txt is **not** consumed by Google Search / Google AI Overviews, and adoption by OpenAI/Anthropic/Perplexity crawlers for retrieval is **not confirmed/standardized** as of this writing — it is a voluntary, low-cost convention with unproven ROI, not a ranking or citation lever. Fixing the 500 is worth doing because a server error is a legitimate technical defect regardless (and cheap to fix), but it should not be prioritized above the higher-impact fixes below.
- **Severity: Low** (as an AI-visibility lever) / **Low-Medium** (as a bug — a 500 on any path is generally bad hygiene and could affect crawler trust signals more broadly).

---

## Top 5 Prioritized Fixes

1. **Fix the malformed JSON-LD Person schema** — change `<meta name="application/ld+json" content="...">` to a real `<script type="application/ld+json">{...}</script>` block, and add Malt to `sameAs`. *Impact: High (enables entity corroboration for every AI/search consumer). Effort: Low (single component change, likely in `layout.tsx` or a `<Head>`/metadata export).*

2. **Fix the domain mismatch across canonical, hreflang, og:url, og:image, JSON-LD url, and robots.txt Sitemap** — all currently point to `vincent-desbrosses.com`, which does not resolve. Replace every reference with `vincent.desbrosses.net`. *Impact: High (broken canonical/hreflang can cause indexing and duplicate-content confusion; broken sitemap URL blocks discovery). Effort: Low (likely one env var or constant to fix site-wide).*

3. **Add real, crawlable `<a href>` links (not JS-only handlers) to LinkedIn, GitHub, X, and Malt** in the markup, ideally near the `<h1>` name, so non-JS crawlers see them directly (in addition to fixing them in JSON-LD). *Impact: High (this is the actual sameAs corroboration mechanism most crawlers rely on). Effort: Low.*

4. **Add a short bio paragraph (~120-160 words) under the `<h1>`** with concrete, attributable facts (years of experience, location/France, freelance status, notable stack, notable client e.g. Allaw) written as direct, self-contained prose — not marketing copy — so it falls within the 134–167 word optimal citation range and survives boilerplate-stripping extraction (wrap in `<article>`/`<p>` semantics). Also surface visible answer text under the existing 5 FAQ `<h3>` headings and mark them up with FAQPage schema. *Impact: Medium-High (directly improves citability score and gives AI Overviews/Perplexity an extractable quote). Effort: Medium (content writing + component change).*

5. **Fix `/llms.txt` 500 and publish a static file**, and separately verify the `/integration` `Disallow` isn't unintentionally blocking indexable content (confirm it's genuinely non-public before excluding it from all crawlers). *Impact: Low-Medium. Effort: Low.*

---

## Platform-Specific Scores (estimated, qualitative)

| Platform | Score /100 | Rationale |
|---|---|---|
| Google AI Overviews | 30 | Broken canonical/hreflang to a dead domain is a meaningful risk signal; thin extractable prose limits quotability |
| ChatGPT (GPTBot/OAI-SearchBot) | 35 | Crawler access is open and raw HTML has real content, but no corroborated entity data and no citable passages limit confident answers |
| Perplexity | 35 | Same access profile as ChatGPT; the existing FAQ-style headings are a good latent asset for Perplexity's Q&A style if answer text and schema are added |
| Bing Copilot | 30 | Bingbot is allowed, but Bing places heavy weight on structured data (which is broken here) and sitemap validity (also broken) |

All four platform scores are currently capped well below potential primarily by the same two root causes: (1) broken/malformed structured data and (2) content that exists but isn't written or marked up as citable, corroborated fact.
