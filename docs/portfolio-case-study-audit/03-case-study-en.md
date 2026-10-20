# Iconise — case study candidate (EN)

**DRAFT — NOT REVIEWED — NOT APPROVED FOR PUBLICATION**

> Source: private GitHub repository `vincedsb1/Iconise`, `main` at `b43adaf`, audited on 20 October 2026. Code and documentation were inspected read-only. Tests and the live deployment were not run or verified. Evidence IDs map to `01-project-audit.json`.

## 1. Editorial positioning

**Core angle:** building a creative SaaS that keeps icon-design decisions, iterations and handoffs connected. The interesting engineering work goes beyond an image-generation API: it is about keeping context consistent when people change their minds.

**Secondary angles:** reliable generation and credits; a progressive decision-making UX; Next.js/PostgreSQL architecture. **Recommended format: STANDARD for now; RICH once fresh authenticated product screenshots are available.**

## 2. Proposed hero

**Iconise — From idea to icon: a structured creative workflow**

A web application designed to turn an initial idea into visual directions, compare alternatives, keep track of decisions and export usable icon assets. The same workflow supports external prompt-based generation and integrated generation, when enabled.

**Hero stack:** Next.js · React · TypeScript · PostgreSQL · Stripe. **Personal role, dates and live product CTA: to be confirmed.** The existing reference visual is not a current production screenshot.

## 3. Project overview

An application icon involves a sequence of choices: purpose, visual direction, exploration, selection, geometry, optical refinement, background and final output. When prompts and images live in different tools, revisiting an early decision can invalidate later steps.

Iconise makes that process explicit with eight numbered steps and one final, unnumbered screen. Project data and iterations are stored server-side, away from browser access to database credentials or provider keys.

## 4. User problem

**How do you explore without losing the thread?** A promising board is of little use if the original prompt, selected reference and downstream consequences are lost. The product emphasizes decision traceability rather than isolated, one-off generations.

The documented initial target persona is **a market hypothesis**, not a validated segment: independent developers launching or redesigning an application without a dedicated identity designer.

## 5. Significant features

- Project management, guided questionnaire, creative preferences and visual direction selection.
- A stateful workflow with dependencies, validation and optional refinement steps.
- Nine-option (3×3, A–I) boards, image import and selection; read support for older 4×2 iterations.
- Compiled prompts for external image tools, plus optional server-side Gemini image generation.
- Iteration history and explicit downstream `stale` states when an earlier choice is reopened.
- Final master, derived SVG and downloadable favicon pack.
- Better Auth accounts, workspace-scoped PostgreSQL persistence, Stripe subscriptions and generation credits.
- Six-language UI, localized landing pages, SES email integration, waitlist and referral modules, subject to runtime configuration.

**Present in source does not mean publicly enabled or commercially adopted.**

## 6. Candidate visual workflow — “From intent to master”

1. **Frame:** describe the project and answer the guided questions. *Visual: setup screen.*
2. **Direct:** set preferences and compare visual directions. *Visual: direction selector.*
3. **Explore:** generate or import a board with nine alternatives. *Visual: A–I board.*
4. **Refine:** adjust geometry, optics and background when necessary. *Visual: before/after flow.*
5. **Deliver:** get the master, derived SVG and favicon assets. *Visual: final output screen.*

Alternative flows in the JSON: **One board, two ways to generate** and **Revise without deleting**.

## 7. Architecture

React components and Next.js App Router endpoints call independent TypeScript application services. Protected requests resolve a Better Auth session and server-side workspace before accessing Drizzle/PostgreSQL repositories. Runtime connections use Postgres.js; PgBouncer and distinct migration connections are documented.

Adapters handle **Gemini** image generation, **OpenAI** text-based creative directions, **Stripe** billing and **Amazon SES** email. Whether these integrations are enabled publicly depends on external configuration not inspected here.

Representative flow: UI → generation API → server-side prompt compilation → operation reservation → HTTP 202 → `after()` execution → provider → image validation → client status polling. Stripe events take a separate signed-webhook path. A simplified **eight-node, eight-edge** graph is included in the JSON.

## 8. Engineering challenges

### Making revision safe

Reopening a decision cannot silently reuse dependent refinements. The workflow service transitions later steps to `stale` while preserving previous iterations. **Evidence: EV-005.**

### Keeping paid generation idempotent

Long-running provider calls and lost HTTP responses require server-controlled retries. A generation uses an idempotency key, HTTP 202 and `after()`; credits rely on validated billing state and signed Stripe events. **Evidence: EV-008, EV-007, EV-015, EV-016.**

### Validating imperfect image outputs

Generated boards may violate the intended grid or crop symbols. Image checks cover 3×3 geometry, ratios, minimum dimensions and edge markings. **Evidence: EV-009.** No measured success rate is claimed.

### Protecting account boundaries

The client cannot assert workspace ownership with a project ID. Verified sessions, server-side workspace resolution and database constraints provide protection layers. **Evidence: EV-017 to EV-020.** This is not a full security assessment.

### Exporting usable artwork

SVG output is a **derived trace of a raster master**, not a native vector source. Favicon exports use successive downscaling to serve small formats. **Evidence: EV-038, EV-037, EV-036.**

## 9. Engineering decisions

- A single Next.js application with separated business-domain code and persistence layers (ADR-001).
- One workflow shared by manual and integrated generation (ADR-002).
- Signed, idempotent billing events and credit assignment based on paid invoices.
- Replaceable image/text provider ports and simulated providers for controlled testing.
- Separate interface language and project content language (ADR-003).

**Documentation caveat:** ADR-002 includes an older 4×2 board format and an amendment; current code uses 3×3 boards with a 4:3 generation target.

## 10. UX/UI

The interface implements guided questions, keyboard navigation for visual directions, stable loading/result frames, clipboard/file/drag-and-drop image import, debounced autosave and dedicated final-output states. Several components include `aria-live` feedback and accessibility attributes. These are implementation choices, not verified WCAG conformance or measured UX outcomes.

## 11. Tech stack

**Core:** Next.js 16 App Router, React 19, TypeScript, Node.js, PostgreSQL, Drizzle ORM and Better Auth.

**Integrations:** Google Gemini for images, OpenAI for text-based directions, Stripe, Amazon SES and next-intl.

**Assets:** Sharp, `@neplex/vectorizer`, browser canvas and ZIP favicon exports.

**Tooling:** Node test runner, Playwright and TypeScript checks; Vercel is the documented deployment target, not a verified runtime status.

## 12. Quality and security

The repository contains **204 tracked files under `tests/`**. Type-checking and test scripts cover areas including workflow, billing, localization, security, HTTP interactions and SVG operations. **Tests were not run during this audit, so no green-build or numeric coverage claim is made.**

The source shows authentication gates, origin checks, signed webhooks, generation limits and a Content Security Policy builder. The CSP still permits some `unsafe-inline` content; static evidence alone does not prove runtime security.

## 13. Verifiable results

Implemented deliverables include the revisable workflow, image and text adapters, workspace persistence, a billing/credits system, derived SVG and favicon exports, and six-language infrastructure. **There is no audited evidence for customers, revenue, uptime, conversions or measured performance.**

The code currently defines Free, Studio (€10/month, 25 generations) and Pro (€30/month, 80 generations), with configurable quotas. Launch documents still treat commercial pricing as **unvalidated**, so these figures must not be presented as a live offer without confirmation.

## 14. Candidate lessons

1. In a creative tool, tracking choices is as important as rendering visuals.
2. Costs and failures of AI providers belong in business logic, not merely in the generate button.
3. Real deliverables need format validation and exports designed for their eventual use.

These lessons are editorial interpretations to confirm against personal experience.

## 15. Limitations

The repository is private. The public access mode, enabled integrations and business performance are unknown. The visual acceptance screenshots and marketing explorations are historic. The README mentions `/registry`, but that page was not found in the current protected-route inventory; it should not be advertised as active without further proof. Older runbooks also mention export/import screens that the current README says were removed.

## 16. Media recommendations

Use the product reference visual for context **with an explicit reference label**, and historical UX screenshots only if dated and approved. Current brand assets are under `public/`. Landing screenshots and motion-design exploration assets are not substitutes for authenticated current-product screenshots.

Capture fresh desktop screens for project setup, preferences, direction comparison, the nine-option board and final export, plus selected mobile views. See `04-media-inventory.md`.

## 17. Sections to hide

**Video: OMIT** (no tracked video). **Gallery: OPTIONAL** (fresh images needed). **Public GitHub CTA: OMIT** (private repository). A quality section can remain, but without implying a current passing CI run.

## 18. Approval checklist

Confirm the personal role, project dates, actual release mode, media rights, measurable outcomes, operational product URL and whether a repository link may be shared. Questions and source discrepancies are prioritized in `05-evidence-and-gaps.md`.
