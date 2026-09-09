# Content Quality & E-E-A-T Audit — vincent.desbrosses.net

Pages assessed: `/en` (home), `/fr` (home). `/integration` not fetched in this pass (out of scope per task, referenced only where relevant).

---

## 1. Word count

| Page | trafilatura `extracted_text` | Full rendered `<body>` text (script/style stripped) |
|---|---|---|
| `/en` | 135 words (trafilatura under-extracts — misses skills chips, project cards, timeline, FAQ) | **738 words** |
| `/fr` | not separately run (same extraction issue expected) | **844 words** |

**Assessment against Homepage minimum (500 words):** Both pages clear the 500-word homepage floor on actual rendered content (738/844). However, this is a single-page portfolio functioning as a full "About + Portfolio + CV" page, not a pure homepage — realistically it's closer to a **service/personal-brand page**, where 800+ words is the relevant floor. `/en` at 738 words sits just under that; `/fr` at 844 clears it. Not thin content, but EN content is noticeably lighter than FR (FR intro paragraph is more substantive — see §6).

Severity: **Low** — word count is adequate, not a blocker.

---

## 2. Heading hierarchy

Identical structure on both locales (translated labels):

- H1 (×1): "Vincent DESBROSSES" ✓ correct, single H1 confirmed
- H2 (×3): Skills / Projects / Journey (Compétences / Projets / Parcours)
- H3 (×20): skill category labels (Design, Front-end, Back-end, Other), project names (Allaw ×2, Other Projects, employer names in timeline: Independent, Allaw, Twenty Soft, Jurisoft, Alpha Web, Hair Net system, Bolloré Ports, Town Hall of Thorigny), and all 5 FAQ questions
- H4 (×9): individual "Other Projects" card titles (AiSystem, CodeMaster, Décor Nature, Is Tesla Worth It?, LIIC, Wilder Game, Quickflow, Légal Constat, Emmaüs Connect)

**Logic check:** H1 → H2 → H3 → H4 with no level skips. Structurally sound and semantically appropriate — this is a well-formed outline.

**Issues found:**
- The FAQ questions are marked up as **H3**, same level as project/employer names, rather than **H2** (a dedicated FAQ section) with questions as H3, or kept as H3 under an H2 "FAQ" — but there is **no H2 heading for the FAQ section itself** ("Do you have any questions?" / "Vous avez des questions ?" is not tagged as a heading at all, based on the H2 list). This flattens an entire content block (5 substantial Q&A pairs — genuinely good first-hand-experience content) out of the document outline.
- Two H3s are literally both "Allaw" (once as project-list H3, once again in the featured-project card, and again as a timeline employer H3) — duplicate heading text across the page dilutes topical signal per heading and could confuse AI extraction/citation of "which Allaw is which."

Severity: **Medium** — add an H2 for the FAQ block; it currently contains the site's best original, first-person insight content but is under-signaled in the outline.

---

## 3. E-E-A-T assessment (personal/freelance brand)

### Experience — Weight 20% | Score: 14/20 (Moderate)
Present:
- Detailed work timeline (2007–2026) with named employers, roles, dates, and specific project descriptions in first person ("I implemented a strong design system...", "I offer my freelance services...").
- 10 real, named, described projects with live links ("View Project"/"Voir le projet") and tech-stack tags per project — strong concrete-experience signal.
- FAQ section written in first person answering genuinely personal questions (what motivated the career, working style, AI tool usage) — this is exactly the kind of first-hand, non-generic signal Sept-2025 QRG rewards.

Missing:
- No case-study depth (metrics, screenshots, before/after, client outcomes) beyond one paragraph for Allaw — the flagship project. No dates on most "Other Projects."
- No visible testimonials/client quotes despite freelance-via-Malt positioning (Malt itself hosts ratings that aren't surfaced here).

### Expertise — Weight 25% | Score: 17/25 (Moderate-good)
Present:
- Skills section is granular and technically specific (framework/tool-level: Next.js, Prisma, Docker, Jenkins, Swift/Xcode — unusually broad for a "fullstack" label, spans front-end, back-end, DevOps, mobile).
- Timeline demonstrates escalating responsibility (System Admin → Support Manager → Product Owner → Fullstack Dev → Independent) which is a credible expertise-progression narrative.

Missing:
- No credentials, certifications, degree, or formal qualifications mentioned anywhere.
- No links to code samples beyond project "View Project" buttons (no visible GitHub repo links per-project, only a global GitHub profile link in the header).
- No blog/technical-writing output to demonstrate depth of expertise (common trust-builder for freelance devs).

### Authoritativeness — Weight 25% | Score: 8/25 (Weak)
Present:
- Social/professional links: LinkedIn, GitHub, X, Malt (in header) — these are the right channels for third-party verifiability.

Missing:
- No client testimonials, no LinkedIn recommendation excerpts, no Malt review count/rating surfaced on-page.
- No external citations, press mentions, guest posts, conference talks, or open-source contribution stats.
- No `Person` schema (JSON-LD) actually populated — see §5 technical note: an `application/ld+json` tag exists in the HTML but no parseable structured-data payload was extracted, meaning search engines/AI crawlers likely see **no structured entity data** for "Vincent Desbrosses." This is the single biggest missed authoritativeness lever for a personal-brand page — a `Person`/`ProfilePage` schema with `sameAs` linking LinkedIn/GitHub/Malt would directly support Knowledge Panel and AI citation eligibility.

### Trustworthiness — Weight 30% | Score: 15/30 (Moderate)
Present:
- Real name used consistently as H1 and throughout.
- Contact CTA present ("Interested in working together?" / "Envie de travailler ensemble ?") with Email and LinkedIn/Phone links.
- Consistent identity across both locales (same name, same timeline, same projects — no fabricated inconsistency).

Missing/concerning:
- **Canonical tag mismatch**: `/en` page's `<link rel="canonical">` points to `https://vincent-desbrosses.com/en` — a **different domain** than the one actually served (`vincent.desbrosses.net`). This is a serious trust/indexing red flag: it tells Google the canonical version lives elsewhere, potentially causing the live site to be deduplicated out of the index in favor of a domain that may not even resolve. Verify `vincent-desbrosses.com` is a real, owned, live domain; if not, this is actively harming trust/indexability. **This needs escalation regardless of which skill "owns" it, since it undermines every other E-E-A-T signal on the page.**
- No visible privacy policy / legal notice (mentions légales — legally expected for a French freelancer's professional site under French law) — trust and compliance gap for FR audience specifically.
- No `mailto:` or `tel:` href scheme found in rendered HTML despite "Email"/"Phone" link labels — links may resolve via JS-injected handlers, but if they're not real `mailto:`/`tel:` hrefs, this both hurts UX (can't right-click "copy email") and denies crawlers a parseable direct-contact signal.
- CV/resume: header lists "Resume"/"CV" link text but no `.pdf` href was found in the rendered HTML (`resume/cv links: []`). If this is JS-only (e.g., anchor built client-side without a static href attribute), it's invisible to non-JS crawlers and to any tool that doesn't execute the click handler.

### Composite E-E-A-T score: **54/100** (weighted: 14+17+8+15 = 54)
Reasonable Experience/Expertise; Authoritativeness and structured-data-driven Trust are the weak points.

Severity: Authoritativeness gap — **High**. Canonical domain mismatch — **Critical** (flag to technical-SEO skill immediately). Missing schema — **High**. Missing legal notice — **Medium**.

---

## 4. Thin content assessment

Neither page is thin by word count (738/844 words, well-organized, topically complete: identity, skills, 10 projects, 8-entry career timeline, 5-question FAQ, contact CTA). This is **comprehensive, non-generic, first-person content** — it does not read as templated or AI-boilerplate. No quality-gate violation on depth/thinness.

The one structural thinness concern: the flagship case study (Allaw) gets one paragraph of substantive detail; the other 9 projects get a single-sentence description each with no outcomes/metrics. For a freelance-conversion page, prospects and AI answer engines alike would benefit from at least 2–3 sentences of "what problem, what I did, what changed" per project, not just a stack tag list.

Severity: **Low-Medium** (not a QRG violation, but a conversion/citation-readiness gap).

---

## 5. Title & meta description rewrite recommendations

Current (identical on both locales, FR serves English strings):
- Title: "Vincent's portfolio" (20 chars)
- Description: "Dive into my world of creativity, experience, and digital connections." (73 chars)

Both are generic, contain no target keywords, no location, no service, and are duplicated across locales — a missed opportunity given the actual on-page content is keyword-rich (Next.js, React, Node.js, freelance, fullstack).

### Recommended EN
- **Title:** `Vincent Desbrosses — Freelance Fullstack Developer (React, Next.js, Node.js)` — 77 chars
  - *Shorter alt (fits ~60px SERP truncation):* `Vincent Desbrosses | Freelance Fullstack Developer` — 52 chars
- **Meta description:** `Vincent Desbrosses is a freelance fullstack developer building fast, SEO-friendly web apps with React, Next.js and Node.js. View projects, skills and experience.` — 165 chars

### Recommended FR
- **Title:** `Vincent Desbrosses — Développeur Fullstack Freelance (React, Next.js, Node.js)` — 80 chars
  - *Shorter alt:* `Vincent Desbrosses | Développeur Fullstack Freelance` — 54 chars
- **Meta description:** `Vincent Desbrosses, développeur fullstack freelance, conçoit des applications web rapides et optimisées SEO avec React, Next.js et Node.js. Projets, compétences, parcours.` — 175 chars (trim to ~160 for safety: `Vincent Desbrosses, développeur fullstack freelance (React, Next.js, Node.js). Découvrez mes projets, compétences et parcours.` — 129 chars)

Rationale: targets his name (branded query), his primary service + core stack (non-branded intent: "freelance fullstack developer react next.js"), matches what's actually on the page (verifiable, no promise-content mismatch), and differentiates EN/FR rather than duplicating.

If location/remote-availability targeting matters (e.g., "France" or a specific city for local freelance search), add it: `Vincent Desbrosses — Freelance Fullstack Developer, France` — worth testing given no location signal currently exists anywhere in the audited content.

Severity: **High** — generic, duplicated, English-on-FR titles are actively suppressing brand-query and service-intent rankings on a page that otherwise has the substance to support them.

---

## 6. EN/FR content parity

**Overall: translation is essentially complete and high quality**, not a literal string-for-string port — the FR intro paragraph is meaningfully rewritten/expanded ("Je conçois et développe des applications web modernes et performantes, optimisées SEO, avec un vrai souci d'UX/UI et de maintenabilité") versus the shorter EN intro, and the FR closing CTA is similarly rewritten rather than translated word-for-word. This is good localization practice, not machine-translation artifacts.

Untranslated / leaked English strings found on the **FR** rendered page:
1. **Title tag**: "Vincent's portfolio" — English, already flagged as established, confirmed present in rendered HTML (`<title>Vincent&#x27;s portfolio</title>`) on `/fr`.
2. **Meta description**: fully English on `/fr`, confirmed via rendered HTML.
3. **`og:title`**: also serves the English "Vincent&#x27;s portfolio" on `/fr` — OpenGraph/social-share previews for French visitors will show English branding.
4. **Footer/closing brand string**: literal text `"Vincent s portfolio"` appears at the very end of the rendered body text on **both** `/en` and `/fr` (likely an apostrophe-encoding artifact of "Vincent's portfolio" rendered as plain text, possibly a hidden/visually-hidden footer or `<title>`-adjacent string picked up by the body scrape) — worth checking in DOM inspector whether this is visible to French users, since it's untranslated and duplicates the generic title string in the page body itself.
5. Headings, skills, project descriptions, timeline entries, and all 5 FAQ Q&As are **fully and distinctly translated** — no leakage found in the primary content blocks.

Severity: **Medium** — the parity gap is narrow but concentrated exactly in the highest-leverage fields (title, description, OG title) for a French-market audience, undermining an otherwise solid i18n implementation.

---

## Summary table

| Finding | Severity |
|---|---|
| Canonical tag points to different domain (`vincent-desbrosses.com`) than served domain | **Critical** |
| Title/description generic, duplicated EN=FR, FR serves English strings, OG title also English on FR | **High** |
| No parseable JSON-LD structured data (Person/ProfilePage) despite ld+json tag present | **High** |
| Weak Authoritativeness signal — no testimonials, no Malt rating surfaced, no external citations | **High** |
| No `mailto:`/`tel:` hrefs found; CV/resume `.pdf` link not present in rendered HTML | **Medium-High** |
| FAQ block (best first-person content) has no H2, flattening it out of the outline | **Medium** |
| No visible mentions légales / privacy policy for FR freelance site | **Medium** |
| EN/FR parity gap concentrated in title/meta/OG fields | **Medium** |
| Duplicate "Allaw" H3 text across 3 separate contexts | **Low-Medium** |
| Project descriptions (9 of 10) are single-sentence, no outcomes/metrics | **Low-Medium** |
| Word count adequate (738 EN / 844 FR) but EN lighter than FR | **Low** |
