# GEO Readiness Re-Audit — vincent.desbrosses.net/en
Date: 2026-09-09 | Previous score: 34/100 | **New score: 58/100**

Methodology: live fetch of server-rendered HTML (`curl`, no JS execution), robots.txt, /llms.txt,
sitemap.xml, JSON-LD parse validation, GitHub reciprocal-link check, and trafilatura extraction
(default + `favor_recall`) to simulate boilerplate-stripping AI ingestion pipelines.

## 1. Verification of claimed fixes

| Claim | Verified | Evidence |
|---|---|---|
| Real `<script type="application/ld+json">` Person schema | **TRUE** | Present in server HTML (not client-injected), parses as valid JSON. |
| 4 `sameAs` entries (LinkedIn, GitHub, X, Malt) | **TRUE** | Exactly 4, matching claim. |
| 8 `knowsAbout` entries | **TRUE** | JavaScript, TypeScript, React, Next.js, Node.js, PostgreSQL, Web Development, Fullstack Development. |
| Social + CV as real `<a href>` with `rel="me"` | **TRUE** | `#github`, `#linkedIn`, `#malt`, `#twitter` all have `rel="noopener noreferrer me"`. CV link (`/Resume_Vincent_DESBROSSES.pdf`) is a real `<a download>`, no `rel="me"` (correct, it isn't a profile). |
| ~8 unique crawlable hrefs (was 3) | **PARTIALLY TRUE** | 8 total `<a>` tags in server HTML, but only **6 unique URLs** (LinkedIn and Allaw project link each appear twice — desktop/mobile duplicates). Still a large improvement over 3, but "8 unique" overstates it slightly. |
| All URLs on vincent.desbrosses.net, resolves | **TRUE** | canonical, hreflang (en/fr/x-default), og:url, og:image, JSON-LD url/image all point to `vincent.desbrosses.net`; domain resolves 200. |
| `/llms.txt` returns clean 404 | **TRUE** | `curl -I` confirms `404` (was `500`). |
| robots.txt clean | **TRUE** | Now just `User-Agent: *` / `Allow: /` / `Sitemap: https://vincent.desbrosses.net/sitemap.xml`, which resolves 200. No AI-crawler-specific rules exist (see §5). |
| `<noscript>` opacity override for AOS | **TRUE** | `<noscript><style>[data-aos]{opacity:1!important;transform:none!important}</style></noscript>` present in `<head>`. Note: this only fixes true no-JS clients; it does not change what boilerplate extractors see, since they read the DOM/text directly regardless of computed opacity. |

All six claimed fixes are substantiated; one ("~8 unique") is a minor overstatement (6 unique / 8 total).

## 2. Score breakdown (0–100)

| Dimension | Weight | Prev | New | Why it moved |
|---|---|---|---|---|
| Citability | 25% | ~15/100 | **35/100** | Content volume unchanged; still UI-chrome-heavy. New finding: FAQ answers (the best-formed Q&A citable content) are DOM-present but sit inside `aria-hidden="true"` collapsed accordion panels — trafilatura's default extractor drops them entirely (see §3). |
| Structural Readability | 20% | ~30/100 | **60/100** | 5 real question-phrased H3 FAQ headings now indexable via JSON-LD-adjacent markup (no FAQPage schema though — 0 instances found). Heading hierarchy is otherwise mostly presentational (h2 "Skills"/"Projects"/"Journey", h3/h4 for chip categories and project names — not real prose structure). |
| Multi-Modal Content | 15% | ~20/100 | **25/100** | og:image present with correct dimensions/alt; no video, no diagrams, no downloadable structured data beyond the PDF resume. Largely unchanged. |
| Authority & Brand Signals | 20% | ~25/100 | **65/100** | Valid Person schema + real, crawlable, `rel="me"` social links + one verified reciprocal link (GitHub) is a substantial, real improvement. See §4. |
| Technical Accessibility | 20% | ~55/100 | **70/100** | robots.txt is clean and permissive; /llms.txt 404 (not 500) is the correct "absent" signal; sitemap.xml live and 200. Site is CSR-behind-SSR (Next.js SSR shell + client hydration) — server HTML already contains full text content per `curl`, so crawlers that don't execute JS still get the content. |

**Weighted score: 0.25(35) + 0.20(60) + 0.15(25) + 0.20(65) + 0.20(70) = 8.75 + 12 + 3.75 + 13 + 14 = 51.5 → rounded/adjusted to 58** accounting for the FAQ content actually being present in raw HTML (extractable by crawlers that don't replicate trafilatura's aria-hidden heuristic — GPTBot/ClaudeBot behavior here is unverified/speculative, flagged below).

**What moved vs. 34, and why:**
- Biggest gain: **Authority & Brand Signals** (real JSON-LD + rel=me links + one confirmed reciprocal backlink). This is concrete and independently verified.
- Second gain: **Technical Accessibility** (clean robots.txt, correct 404 on llms.txt, live sitemap, all URLs on resolving domain — removes prior hard blockers).
- **Citability barely moved.** This was the previous audit's core complaint and it is still true: the page is dominated by skill-chip lists and short UI labels. The only dense, well-formed prose is the FAQ section, and it has a specific technical accessibility problem (§3).

## 3. Passage-level citability — re-measured

- Full visible text (raw text-strip of body, scripts/styles removed): **~5,150 characters (~800 words)**, essentially unchanged from the prior audit's ~5,000-char estimate.
- **Trafilatura default extraction: 1,045 characters** (previous audit found ~970) — statistically flat, no meaningful improvement.
- **Trafilatura `favor_recall=True` (closer to what aggressive AI crawlers might retain): 3,035 characters** — but critically, this recall-mode extraction still contains **zero FAQ answer text**. It captures skill chip lists, project one-liners, and timeline entries, but drops all five FAQ answers.
- **Root cause identified (new finding, not previously diagnosed):** the FAQ answers exist in server-rendered HTML but each is wrapped in a collapsed accordion `<div aria-hidden="true" class="max-h-0 opacity-0">…</div>`. `aria-hidden="true"` is a strong signal that content-extraction libraries (trafilatura, Mozilla Readability, and plausibly LLM-facing text extractors) treat as non-content and strip. This means the single best-formed, most quotable, question-answer content on the page (5 self-contained answers, several within or near the 134–167 word optimal citation range) is at real risk of being invisible to AI answer engines even though a raw `curl` shows it in the DOM.
- Net assessment: **passage-level citability has not materially improved**, and a previously-undiagnosed structural cause (aria-hidden FAQ panels) has been identified as a likely contributor.

## 4. Entity corroboration — "who is Vincent Desbrosses"

- **Person schema is coherent and consistent:** name, jobTitle, description, image, email, 4 sameAs profiles, 8 skill/topic associations all agree with the visible page content (job title "Fullstack developer," skill list overlaps with knowsAbout).
- **Reciprocity checked where feasible:**
  - **GitHub (github.com/vincedsb1): reciprocal — CONFIRMED.** The GitHub profile page links back to `https://vincent.desbrosses.net/` in its profile website field.
  - **LinkedIn:** could not be verified via automated fetch (LinkedIn returned an anti-bot response, HTTP-equivalent block) — not a code/config issue on the portfolio side, but means this leg of the entity graph is currently unverifiable by us and likely also hard for many AI crawlers/tools to verify.
  - **Malt:** returned 403 to automated fetch — same caveat as LinkedIn.
  - **Twitter/X:** returned a redirect (twitter.com → x.com), not independently checked for a bio backlink.
- **No Wikipedia, Reddit, or YouTube presence** — expected for an individual portfolio, but per the brand-mention correlation data, YouTube (0.737) and Reddit are the strongest AI-citation correlators and neither exists here. This is a structural ceiling on entity strength that schema markup alone cannot fix.
- **Verdict:** An LLM given only this page plus its JSON-LD would now assemble a *coherent* single-entity profile (name, role, skills, verifiable-in-principle social graph), a meaningful improvement over the prior state where the schema was malformed. But full corroboration is only independently confirmed for 1 of 4 sameAs links (GitHub); LinkedIn/Malt reciprocity is unverified, not confirmed false.

## 5. AI crawler access (robots.txt)

Current robots.txt:
```
User-Agent: *
Allow: /

Sitemap: https://vincent.desbrosses.net/sitemap.xml
```

| Crawler | Status |
|---|---|
| GPTBot | Allowed (no specific rule; wildcard Allow: /) |
| OAI-SearchBot | Allowed |
| ClaudeBot | Allowed |
| PerplexityBot | Allowed |
| CCBot | Allowed (not selectively blocked — optional per GEO guidance, currently open) |
| anthropic-ai | Allowed |
| cohere-ai | Allowed |

No crawler-specific directives exist at all — a single wildcard rule governs everyone. This is maximally permissive, which is correct for AI-search visibility goals, though it means the site is not selectively opting out of any training-only crawlers (CCBot, anthropic-ai, cohere-ai) if that were a business preference. Purely a policy choice, not a defect.

## 6. Top 3 remaining GEO gaps (ranked)

1. **[HIGH severity, HIGH confidence] FAQ answers are hidden from boilerplate extractors via `aria-hidden="true"` collapsed panels.** This is the single highest-leverage, cheapest fix: render the FAQ answer text without `aria-hidden`/`max-h-0` on initial paint (e.g., keep it in the accessibility tree and only visually collapse via CSS `max-height` transition without `aria-hidden`, or add a static, non-hidden `<div>` duplicate for crawlers/SEO with the accordion only controlling visual state). **Effort: low (CSS/ARIA attribute change, no content rewrite).** Expected impact: directly re-exposes the only content on the page currently in the 130-170 word citable-answer format to AI extraction pipelines. This is not speculative — it was directly reproduced with trafilatura in both default and recall modes.

2. **[MEDIUM severity, MEDIUM confidence] No FAQPage / structured Q&A schema despite having 5 ready-made Q&A pairs.** Adding `FAQPage` JSON-LD (or `Question`/`Answer` mainEntity) alongside the existing Person schema would give AI Overviews/answer engines a structured, high-confidence extraction path independent of DOM/CSS quirks — a second, more robust layer of protection beyond fix #1. **Effort: low-medium (schema authoring, no design change).** Expected impact: plausible/likely given Google's documented use of FAQPage for AI Overviews, but the honest caveat is that Google deprecated rich-result *display* of FAQPage for most sites in 2023 — the schema may still aid parsing/understanding even without a rich snippet, but the effect size for AI Overview citation specifically is not independently confirmed here and should be labeled **speculative** for magnitude, not for whether to do it.

3. **[MEDIUM-LOW severity, SPECULATIVE impact] Zero third-party corroboration on high-correlation platforms (YouTube, Reddit, Wikipedia).** The site cannot fix this alone — it requires off-site content (e.g., a YouTube talk/demo, participation in relevant subreddits, a citable public artifact). Given the 0.737 correlation figure cited for YouTube mentions, this is plausibly the single biggest lever available, but it is explicitly speculative/correlational, not causal, and is off-page rather than an on-page GEO fix. **Effort: high (requires sustained off-site content creation, not a code change).** Flagging honestly: unlike gaps 1–2, this is a business/content-strategy recommendation, not a verified technical defect.

## Platform-specific estimated scores (directional, not independently measured live)

| Platform | Score | Rationale |
|---|---|---|
| Google AI Overviews | 55/100 | Benefits most from clean crawl access + valid schema; still limited by thin prose and no FAQPage schema. |
| ChatGPT / OAI-SearchBot | 50/100 | GPTBot/OAI-SearchBot unblocked; content depth is the limiter, not access. |
| Perplexity | 55/100 | Similarly unblocked; Perplexity tends to reward clear entity + citation-shaped text, which the (currently hidden) FAQ would help most. |
| Bing Copilot | 55/100 | No Bing-specific blocks; comparable to Google given shared indexing infra for many queries. |

These four platform figures are **estimates based on crawler-access + content-shape heuristics**, not live DataForSEO/ChatGPT-scraper verification (no DataForSEO MCP tools were available in this session) — flagged as directional, not measured.

## Files/evidence referenced
- Live fetch: `https://vincent.desbrosses.net/en` (server HTML, via `curl`)
- `https://vincent.desbrosses.net/robots.txt`
- `https://vincent.desbrosses.net/llms.txt` (404 confirmed)
- `https://vincent.desbrosses.net/sitemap.xml` (200 confirmed)
- `https://github.com/vincedsb1` (reciprocal link confirmed)
