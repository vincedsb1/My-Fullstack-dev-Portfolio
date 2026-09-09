# SXO Findings — vincent.desbrosses.net (/en, /fr)

Run: 2026-09-09. First pass — no prior audit to compare against.

## Tooling note (limitation)
The `claude-seo` render/parse toolchain (render_page.py / parse_html.py) is not
installed in this environment. This analysis substitutes WebFetch (rendered
DOM/content) for page capture and Google WebSearch for SERP sampling. Findings
based on the page content itself are evidence-based (directly observed).
Findings about ranking, SERP position, CTR, or "how Google currently treats
this site" are NOT measured — there is no GSC or rank-tracking data available.
These are flagged as HYPOTHESIS below.

---

## 1. Target page — what was actually observed (/en)

- Title: **"Vincent's portfolio"** — generic, contains no keyword, no name-as-brand
  differentiation beyond first name, no role/stack. (/fr equivalent: "Portfolio de Vincent" — same problem, worse: doesn't even include the surname.)
- Meta description: generic/effectively unhelpful for query matching (per project brief; owner has confirmed and deferred fixing).
- H1: "Vincent DESBROSSES - Fullstack developer" — this is good, it's the strongest keyword signal on the page, but it's undermined by the weak `<title>`, which is what actually shows in the SERP snippet and drives CTR.
- Structure: single scrollable page — Hero → Skills → Projects (10 named: Allaw, AiSystem, CodeMaster, Décor Nature, "Is Tesla Worth It?", LIIC, Wilder Game, Quickflow, Légal Constat, Emmaüs Connect) → Journey (2007–2026 timeline) → FAQ (5 first-person Q&As) → Footer.
- Above-the-fold CTAs: Email, LinkedIn, Resume (PDF), GitHub, X/Twitter, Malt.
- No visible pricing, availability status, day rate, location/remote scope, or "available for new missions" signal in the hero.
- FAQ questions are self-reflective / narrative ("What inspired you to work in web development?", "What role do AI tools play in how you work today?") rather than hiring-decision questions a recruiter or CTO would ask (e.g., "What's your day rate?", "Are you available now?", "Do you work under an EI/SASU/portage structure?", "What's your typical contract length?").
- Journey section shows current status: "Independent (Jun. 2026 → now)", prior role "Allaw (Jul. 2024 → Jun. 2026)" — good freshness/authority signal, but it's buried mid-page, not surfaced in the hero.

---

## 2. SERP backwards analysis

### a) His own name — "Vincent Desbrosses developer" (evidence: WebSearch, 10 results sampled)
His own site (vincent.desbrosses.net) **did not appear in the top 10** for this query.
What did appear: his LinkedIn profile ("Vincent DESBROSSES - Développeur NextJS & ReactJS"),
plus multiple unrelated people sharing the surname (Smiths Detection employee, a Rennes
building-sector manager, Wikipedia entries for other "Vincent D—" names).

**This is the single most concrete, checkable finding of this audit**: for a branded/name
query where a personal portfolio should be an easy #1, the LinkedIn profile is winning the
slot the portfolio should own, and the site isn't visible in the sample at all. Because the
title tag is generic ("Vincent's portfolio") rather than "Vincent Desbrosses — Fullstack
Developer," it is competing poorly on the exact string a recruiter would paste into Google
after seeing his name on a CV, LinkedIn comment, or Malt profile.

*(Caveat: WebSearch here is a single-query, single-point-in-time sample, not a verified
rank-tracked position — but the absence from a 10-result sample for one's own full name is
a meaningful, low-ambiguity signal, not a stretch.)*

### b) Commercial hiring queries — "développeur fullstack freelance react France" /
"freelance next.js developer France hire" (evidence: WebSearch, ~8-9 results each sampled)

Dominant page types in the SERP:
- **Directory / marketplace listing pages** (LinkedIn Jobs listing, Indeed job search,
  Free-Work job listings, Malt tag/category page) — aggregators, not individuals.
- **Individual freelancer portfolio/personal-brand sites** that DO rank alongside the
  aggregators: Sofiane Boumedine, Axel Hamilcaro, Johan Lorck, OOEO — i.e., the page TYPE
  "personal portfolio with a services angle" is a legitimate, provable competitor in this
  SERP, not a mismatch in principle.
- No individual-name personal portfolios among the very top listing-heavy results resemble
  Vincent's structure exactly, but the format that *does* win (Johan Lorck, Axel Hamilcaro)
  consistently frames the homepage as a **service/offer page** — headline states the stack
  and service ("Next.js Agency," "freelance web fullstack"), not "portfolio."

**Page-type verdict: MEDIUM mismatch, not critical.** A single-page portfolio is a
defensible format (peers use it), but Vincent's page frames itself as a *portfolio*
("Vincent's portfolio," first line "Hi there!") rather than a *service/hire offer*, which is
the framing the ranking peer sites and the query intent ("freelance ... hire") actually use.
The content exists (skills, projects, availability implied by Journey dates) but it is not
packaged as an answer to "can I hire this person, and for what, right now."

*(Caveat: this is a directional pattern from ~17 sampled URLs across 2 queries, not a
statistically confident SERP consensus — treat page-type read as HYPOTHESIS, moderately
supported.)*

### SERP features observed
- No featured snippets or PAA blocks surfaced in the fetched text summaries (WebSearch tool
  does not reliably expose these — cannot confirm absence, only that none were surfaced).
- Rate/pricing information appears directly in Google's own answer synthesis for the
  commercial query (~€450-700/day range cited from aggregator content) — meaning day-rate
  content is actively being surfaced/valued in this SERP, and Vincent's page has none.

---

## 3. User stories (derived from the two SERP signals above, not invented)

1. **Recruiter/agency sourcer, awareness stage** — signal: LinkedIn profile outranking
   personal site for "Vincent Desbrosses developer." *"I found this person on LinkedIn or a
   CV and I'm Googling the name to sanity-check them before reaching out — I expect the
   portfolio to be the first or second result."* Currently fails: portfolio isn't
   confirmed visible for the exact-name query.

2. **CTO/founder, consideration stage** — signal: peer freelancer sites winning on
   service-framed hero copy + rate/hire signals present in the SERP synthesis for the
   commercial query. *"I'm comparing 3-4 freelance Next.js/React developers in France and
   need to quickly see: stack, day rate or rate range, availability, and how to contact —
   within the first screen."* Currently fails: hero has no rate/availability, FAQ doesn't
   answer contract-mechanics questions.

3. **Peer developer / potential referral source, decision-adjacent stage** — signal: the
   FAQ block itself, which is written in first-person narrative voice ("What inspired you…").
   *"I know Vincent and want to check what he's currently focused on / available for before
   I refer a client to him."* This persona is reasonably well served today — Journey +
   Skills + FAQ narrative tone fits a warm-referral read, not a cold-search read.

(Covers awareness → consideration; story 3 sits at a decision-adjacent/referral stage.)

---

## 4. Persona scoring (25 pts each: Relevance, Clarity, Trust, Action)

### Persona A — Recruiter Googling the name (branded query)
- Relevance: 10/25 — page content is relevant once found, but title tag doesn't reflect
  the query at all ("Vincent's portfolio" vs. "Vincent Desbrosses developer").
- Clarity: 15/25 — H1 is clear once on-page.
- Trust: 15/25 — Journey timeline (2007-2026) and named employer (Allaw) build trust; no
  testimonials/client logos observed.
- Action: 12/25 — Email/LinkedIn/Malt links exist above the fold, good; no explicit
  "available now" or response-time signal.
- **Total: 52/100** — weakest dimension: Relevance (title tag).

### Persona B — CTO/founder comparing freelancers (commercial query)
- Relevance: 8/25 — nothing on the page answers "freelance," "day rate," "available," or
  "remote/on-site" directly; framing is "portfolio," not "hire me."
- Clarity: 12/25 — skills are itemized clearly, but no summary "in one sentence, what do you
  do and for whom."
- Trust: 13/25 — real, named projects with specifics (Allaw, Emmaüs Connect) are credible;
  no client testimonials/logos/case-study depth visible in the fetch.
- Action: 10/25 — Malt link exists (good — matches how French freelance hiring actually
  works) but it's one icon among six, not a primary CTA.
- **Total: 43/100** — weakest dimension: Relevance (no hire-framing/rate signal).

### Persona C — Peer developer / warm referral
- Relevance: 20/25 — FAQ and Journey speak directly to this reader's curiosity.
- Clarity: 20/25 — narrative FAQ is genuinely clear and human.
- Trust: 18/25 — consistent, specific career narrative.
- Action: 15/25 — GitHub/LinkedIn present for a peer to follow up.
- **Total: 73/100** — strongest persona fit on the current page.

Weakest → strongest: **Persona B (43) < Persona A (52) < Persona C (73)**.
Recommendations should prioritize Persona B, then A.

---

## 5. Biggest single search-experience gap (concrete, not generic)

**The homepage is written and framed as a "portfolio" (a showcase for the owner) when the
two search intents that matter most — his own name, and freelance-hiring queries — both
expect a "can I hire this person" answer.** Concretely:
- `<title>` says "Vincent's portfolio" instead of naming him + his role + "freelance" (fixable in ~5 min, directly affects both Persona A's name-search and general keyword relevance).
- The hero has zero mention of "freelance," rate, availability, or service scope — the exact
  terms both his query intent and the ranking peer sites (Johan Lorck, Axel Hamilcaro) use.
- The FAQ, the one place designed to pre-answer visitor questions, answers "why do you like
  this job" instead of "are you available, what's your rate, what's your contract structure
  (EI/SASU/portage), what's your typical engagement length" — the actual questions a
  French freelance-hiring CTO searches for.
- This is a copy/framing problem, not a technical one — the underlying content (real named
  projects, a decade-plus timeline, working contact CTAs including Malt) already supports a
  hire-oriented rewrite; nothing structural needs to be rebuilt.

## 6. What is speculative vs. evidence-based (recap)

**Evidence-based (directly observed via WebFetch/WebSearch today):**
- Current title/meta description text and genericness.
- Page structure, headings, FAQ question wording, project list, CTA set.
- The specific SERP results returned for the 3 sampled queries today, incl. the site's
  absence from the sampled name-query results and the presence of rate figures in Google's
  synthesized answer for the commercial query.

**Hypothesis (informed but not measured):**
- That the site currently ranks poorly/not-at-all for these queries in general (no rank
  tracker, no GSC — the WebSearch sample is a snapshot of one query variant, not a position).
- That fixing title/hero framing would move rankings — plausible given SERP peer patterns,
  but no before/after data exists to confirm impact.
- The "page-type mismatch is MEDIUM not CRITICAL" call — based on ~17 sampled URLs across
  2 queries, not a full 10-result-per-query systematic classification against the taxonomy.

## 7. Not assessed (out of scope / no data)
- /fr page was not separately re-fetched (title alone confirmed via project brief:
  "Portfolio de Vincent" — same generic pattern, worse because it drops the surname).
- No Search Console impressions/clicks, no keyword volume, no backlink/authority data.
- No mobile-render check (WebFetch does not confirm mobile viewport rendering or CLS/LCP).
- No competitor content-depth audit beyond headline/hero framing (didn't fetch full pages of Johan Lorck/Axel Hamilcaro/OOEO).

---
Cross-references: consider `/seo content` for E-E-A-T depth (testimonials/case studies are
absent from what was observed) and `/seo schema` if Person/ProfilePage schema needs
validation against these hiring-intent queries (schema presence was asserted by the project
brief but not independently re-verified in this pass, since parse_html.py was unavailable).

Generate a PDF report? Use `/seo google report`
