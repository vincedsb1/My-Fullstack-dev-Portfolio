# Content Quality / E-E-A-T Re-Audit — vincent.desbrosses.net (/en, /fr)
Date: 2026-09-09 · Previous score: 54/100

## 1. Word Count (given by coordinator, raw server HTML)
- /en: 752 words / 5,110 chars
- /fr: 840 words / 5,738 chars

## 2. Heading Outline (/en) — confirmed
1 H1, 4 H2, no skipped levels. FAQ H2 fix has landed ("Do you have any questions?" is now its own H2 with 5 H3 children — the previous "nested under Journey" issue is resolved).

**[MEDIUM] Duplicate heading text persists:** "Allaw" still appears as H3 three times (Projects section ×2 — a featured-project H3 plus presumably a duplicate/near-duplicate card, and Journey section ×1). This was flagged in the prior audit and has **not** been fixed. It's not a hard error, but it weakens the semantic uniqueness of the outline for both users skimming headings and for AI systems trying to disambiguate "Allaw" as employer history vs. Allaw as case-study project — a screen-reader/AI-parser user landing on heading #2 "Allaw" can't tell which is which without reading body text.

## 3. E-E-A-T Re-Score: 68/100 (was 54/100, +14)

| Axis | Weight | Prev (est.) | New | Change | Why |
|---|---|---|---|---|---|
| Experience | 20% | ~11/20 | 15/20 | +4 | Skills section now shows granular, specific tooling (Swift/SwiftUI/Xcode under "Desktop," Jenkins/AWS under "DevOps," Claude Code/Codex/Cursor/RAG under "AI-assisted Development") rather than generic buzzwords — this reads as first-hand, current practice rather than a template. Journey section (8 employers, named) and Projects section (9 named projects with specific outcomes, e.g. Allaw design-system/SEO work) reinforce this. Not verified: whether project descriptions include quantified outcomes (metrics, dates) beyond what was extracted — the extraction only captured summary text, not full expanded case-study copy if any exists behind interaction. |
| Expertise | 25% | ~13/25 | 17/25 | +4 | New skill taxonomy (Design & Product / Front-end / Back-end / Desktop / DevOps / AI-assisted Development) demonstrates full-stack + product + ops breadth, which is a stronger expertise signal than a flat skills list. Valid JSON-LD Person schema (fixed since last audit) also strengthens machine-readable expertise signals. Held back from full marks: no visible credentials, certifications, or years-of-experience markers in the extracted content, and no author bio/about paragraph establishing depth beyond a list of tools and job history. |
| Authoritativeness | 25% | ~11/25 | 13/25 | +2 | Marginal improvement only. Correct canonical/hreflang/og tags (fixed) mean authority signals are now at least attributed to the right domain instead of leaking to a wrong one, which indirectly protects whatever authority the site has. No new external validation (no testimonials, no press mentions, no backlinks-visible signals, no client logos) was added. This is the weakest-moving axis. |
| Trustworthiness | 30% | ~14/30 | 18/30 | +4 | Valid JSON-LD Person schema, correct canonical/hreflang consistency, and a real FAQ with substantive first-person answers ("What role do AI tools play in how you work today?") are meaningful trust upgrades — they reduce ambiguity about who this site represents and give both users and crawlers a coherent, verifiable identity. Still generic page titles/descriptions ("Vincent's portfolio" / "Portfolio de Vincent") slightly undercut trust/clarity at the SERP-snippet level (known/deferred, not re-scored heavily here). No visible contact info, security/privacy signals, or "last updated" date were confirmed in this pass — not verified either way from the extracted content.

**Net read:** the technical fixes (canonicals, hreflang, schema, FAQ heading) and the Skills rewrite meaningfully improved Expertise and Trustworthiness, which are the two heaviest-weighted axes (25% and 30%), so the composite score moved a full 14 points. Authoritativeness is the drag — nothing in this round added third-party validation, and that axis is also 25% weighted, so it's the best next lever after the item in section 5.

## 4. EN/FR Parity on the Rewritten Skills Section — **FAIL, confirmed**

Checked both rendered pages: the skill *items* (tool names — Figma, Next.js, Swift, Docker, Claude Code, etc.) are identical in both locales, which is expected and fine (proper nouns/tool names). But the **category labels themselves are not translated**:

Confirmed directly in `src/i18n/fr.json`:
```
"designProduct": "Design & Product",
"frontend": "Front-end",
"backend": "Back-end",
"desktop": "Desktop",
"devops": "DevOps",
"aiAssistedDevelopment": "AI-assisted Development"
```

All six category strings are hardcoded in English inside the French translation file. On the rendered /fr page, "Skills" correctly becomes "Compétences" (H2), and "Projects"/"Journey" correctly become "Projets"/"Parcours," but every H3 category header under Skills — Design & Product, Front-end, Back-end, Desktop, DevOps, AI-assisted Development — renders in English on the French page. This is the newest content in the site and it shipped without translation.

**[HIGH] EN/FR parity gap:** the entire Skills-section rewrite (the material change this re-audit was asked to measure) missed localization. For a French-market freelance developer this is a real, immediately fixable trust and quality gap.

## 5. Thin Content Verdict

No official Google page-type minimum applies cleanly here (this is a single-page personal portfolio, not a blog/service/product page per the standard taxonomy), but using the closest analogue — **homepage (500-word floor)** — both locales clear it comfortably: /en at 752 words and /fr at 840 words are 50–68% above the 500-word homepage floor. Using the stricter **service-page analogue (800-word floor)**, given the site functions as a freelance-services pitch, /en (752) sits just under and /fr (840) clears it.

**Verdict: not thin.** Word count is not the binding constraint here — Google explicitly does not treat word count as a ranking factor, and 752–840 words carrying a real skills taxonomy, 9 named projects, 8-employer work history, and a substantive 5-question FAQ represents genuine topical coverage for a single-page portfolio, not thin/templated filler. The binding quality constraints are the FR translation gap (§4) and the generic title/description (known, deferred), not raw length.

## 6. Highest-Leverage Next Content Change

**Translate the six Skills category labels in `src/i18n/fr.json`** (`designProduct`, `frontend`, `backend`, `desktop`, `devops`, `aiAssistedDevelopment`).

Reasoning: this is the single fix with the best effort-to-impact ratio available right now.
- It's the exact content that was just rewritten and is therefore fresh/prioritized by the owner's own recent work — finishing it is low-effort (six string edits in one JSON file, no design/dev work).
- It directly closes a hard EN/FR parity defect on the newest section of the site, which both a French-speaking human visitor and any locale-aware crawler/AI system will notice immediately as inconsistent/unfinished.
- It disproportionately benefits the Trustworthiness axis (30% weight, the heaviest) by removing a visible "half-finished" signal, and secondarily Expertise (25%) by making the full-stack/product breadth legible in French, not just English.
- It's cheaper and faster than the alternative "biggest lever" candidates (rewriting titles/descriptions — deferred by owner; adding third-party validation/testimonials to lift Authoritativeness — requires external assets/outreach, not just a content edit).

Everything else in this section (thin-content status, title/description impact) is qualitative context already noted; the FR skills-label translation is the concrete, shippable next action.

---
*Not verified in this pass (out of scope / not extractable from rendered HTML alone): whether project case-study copy contains quantified outcomes beyond summary text; presence/absence of a visible "last updated" date or contact/security trust signals on-page; backlink or third-party mention data for Authoritativeness.*
