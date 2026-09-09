# Visual / Rendering Audit — vincent.desbrosses.net (/en, /fr)

Tested with Playwright + Chromium (headless), viewports 1920x1080 (desktop) and 390x844
(iPhone-class mobile), light and dark (`prefers-color-scheme`) modes, and one run with
JavaScript fully disabled.

## Screenshots saved

All under `/Volumes/Macintosh HD/Users/vincentdesbrosses/Documents/Misc/My-Fullstack-dev-Portfolio/vincent.desbrosses.net-audit/screenshots/`:

- `en_desktop_1920x1080_early.png` / `en_desktop_1920x1080.png` (0.3s vs +2.5s after load)
- `en_mobile_390x844_early.png` / `en_mobile_390x844.png`
- `fr_desktop_1920x1080_early.png` / `fr_desktop_1920x1080.png`
- `fr_mobile_390x844_early.png` / `fr_mobile_390x844.png`
- `en_desktop_dark_1920x1080_early.png` / `en_desktop_dark_1920x1080.png` (dark mode)
- `en_mobile_dark_390x844_early.png` / `en_mobile_dark_390x844.png` (dark mode)
- `en_nojs_1920x1080_early.png` / `en_nojs_1920x1080.png` (JavaScript disabled)
- `en_mobile_menu_open.png`, `en_mobile_menu_open2.png` (menu-open attempts, see below)

Full-page settled screenshots are full-page captures (`full_page=True`), not just viewport;
`_early` variants are viewport-only, taken ~0.3s after `load`.

---

## Findings (severity-tagged)

### 1. CRITICAL — Entire page content is opacity:0 with JavaScript disabled / before AOS initialises
With JS disabled on `/en` (1920x1080), the rendered page is **completely blank** except for
the fixed menu button — confirmed both in the immediate screenshot
(`en_nojs_1920x1080_early.png`) and the fully-settled full-page screenshot
(`en_nojs_1920x1080.png`, 6727px tall, entirely blank white/grey). Programmatic check found
**64/64 `[data-aos]` elements at `opacity: 0`** with JS off, including the H1 name, job title,
tagline, and CTA buttons (Email/LinkedIn/Resume/GitHub/etc.) — i.e. the *entire* hero and every
subsequent section.

This is a genuine indexing/UX risk: any crawler, proxy, reader mode, ad blocker interaction, or
transient JS failure that prevents the AOS init script from running leaves visitors and crawlers
looking at an empty page. AOS.js normally relies on adding an `aos-init`/`aos-animate` class via
JS; there is no `<noscript>` fallback or CSS `@media (prefers-reduced-motion)`/no-JS fallback
forcing `opacity: 1` by default. This should be fixed by defaulting AOS elements to visible
(opacity 1) and only using JS to *add* the fade-in effect progressively, or by adding a
`<noscript>` global style override.

### 2. MEDIUM — Partial AOS opacity:0 state persists on normal (JS-enabled) mobile loads, even after settling
With JS enabled, most above-the-fold content becomes visible almost immediately (see below),
but the settle-state diagnostic (~2.5s after load, no scroll performed) still shows a large
number of below-the-fold AOS elements sitting at `opacity:0`:
- `en_desktop`: 21/64 AOS elements still at opacity 0 (expected — they're below the fold and
  haven't scrolled into view yet, which is normal AOS behavior).
- `en_mobile`: 52/64 at opacity 0
- `fr_mobile`: 54/64 at opacity 0
- `en_mobile_dark`: 52/64 at opacity 0

This is expected AOS scroll-triggered behavior for below-fold content (not a bug per se), but
it means a large fraction of the page's textual content (skills list, projects, FAQ, timeline)
never becomes visible/renders as `opacity:0` until the user scrolls that section into view. If
any crawler evaluates rendered DOM state without scrolling/triggering intersection events (some
headless-rendering-based crawlers snapshot without simulating scroll), a large portion of page
content could be effectively invisible/suppressed in the accessibility tree at opacity 0 while
technically present in the DOM. Recommend confirming Google's renderer (or the actual crawler in
use) triggers AOS scroll events, or reduce reliance on start-hidden animations for primary
content.

### 3. LOW/OK — Mobile above-the-fold value proposition is clear
On mobile (390x844), immediately after load (`en_mobile_390x844_early.png`), the visible
viewport already shows: profile photo, "Hi there! I'm **Vincent DESBROSSES**", role
("Fullstack developer"), a one-line value prop ("From ideation to completion, my skillset
covers the full lifecycle of a web project. Let's talk about your next project."), and 6
CTA buttons (Email, LinkedIn, Resume, GitHub, X, Malt). This answers "who/what/how to
contact" without scrolling. No issues found here — content renders correctly, not blocked by
AOS opacity:0 in the normal JS-enabled case.

### 4. LOW — Some primary CTA tap targets are under the 48px touch-target guideline
Measured button bounding boxes on mobile (390 width viewport):
- Email: 112 × **40**px
- LinkedIn: 136 × **40**px
- Resume: 133 × **40**px
- GitHub: 124 × **40**px
- X: 83 × **40**px
- Malt: 105 × **40**px

All hero CTA buttons are 40px tall, below the commonly recommended 48×48px minimum touch
target (WCAG 2.5.5 / Material guidelines). Width is generally adequate; height is the
constraint. Not a blocking issue but worth a minor bump (e.g. to 44–48px) for touch ergonomics.

Carousel/testimonial dot indicators further down the page are 16×16px — well under target
size, though they are secondary/decorative navigation, not primary CTAs.

### 5. NOT TESTED — Menu (hamburger/theme+language switcher) interactive reachability
I located the menu trigger element (`#buttonMenuContainer` → `#buttonMenuBg`, a 48×44px box
containing an SVG "..." icon, positioned top-right, `mt-5 mr-5`) and confirmed it is present,
visibly rendered, and sized close to a reasonable touch target (48px wide × 44px tall — the
container itself is acceptably sized even though the earlier `#menuContainer` outer div is
full-width/64px tall). However, my scripted click attempts at the computed bounding-box center
did not visibly open a menu panel in the resulting screenshots (`en_mobile_menu_open.png`,
`en_mobile_menu_open2.png` show no visible change vs. baseline). I could not confirm within the
remaining time budget whether this is a real interaction bug, a click-target mismatch (SVG vs.
parent div hit-testing), or a rendering/screenshot-timing issue with the panel opening off-screen
or requiring a different event (e.g., pointerdown vs click). **Menu open/close behavior and
in-menu theme/language switch reachability should be marked NOT CONCLUSIVELY TESTED** — worth a
manual re-check rather than treating my null result as proof of a broken menu.

### 6. LOW/OK — No horizontal overflow detected
`scrollWidth` equals `clientWidth` on both desktop (1920) and mobile (390) for all tested
pages/themes (`horizontalOverflow: false` in every diagnostic run). No evidence of mobile
horizontal scroll/layout overflow.

### 7. OK — Dark mode contrast
Dark mode screenshots (`en_desktop_dark_1920x1080.png`, `en_mobile_dark_390x844.png`,
early variants) show light text on dark background (near-black `#0a0a0a`-ish) with the same
layout as light mode; text, buttons, and the red accent color all remain clearly legible. No
invisible-text or contrast issues observed in the hero/skills sections that were visually
inspected. Below-the-fold sections were not individually eyeballed for contrast — recommend
spot-checking sections like Projects/Timeline/FAQ in dark mode directly if a full color-contrast
audit is required.

### 8. LOW — Minor layout shift between early and settled paint (desktop)
Comparing `_early` (0.3s) vs settled (+2.5s, no scroll) captures: on desktop the header/hero and
"Skills" section are already both visible at 0.3s post-load with no observable shift in
position for that content between the two captures. No CLS-relevant reflow was observed in the
above-the-fold region for desktop or mobile in light or dark mode. (This check only covers the
above-the-fold/early-viewport region, not sections that come into view only after scrolling —
their transition from opacity:0 to opacity:1 does not shift layout since AOS uses opacity/
transform, not display/visibility changes, so no reflow is expected, but this was not
individually confirmed for every section.)

### 9. NOT TESTED — /fr locale-specific layout differences beyond opacity diagnostics
I captured `/fr` desktop and mobile screenshots (light mode only) and confirmed hero H1
("Vincent DESBROSSES") renders and is visible, no horizontal overflow, similar AOS
opacity-at-settle pattern to `/en` mobile (54/64 elements at opacity 0 pre-scroll, consistent
with #2 above). I did not do a full side-by-side text-length/wrapping comparison between French
and English strings (French text is often longer and can cause button/label wrapping) — this
should be checked explicitly against `fr_desktop_1920x1080.png` / `fr_mobile_390x844.png` if
translation-driven layout breakage is a concern.

---

## Summary Table

| # | Finding | Severity |
|---|---|---|
| 1 | Full page content (100% of AOS elements) is invisible with JS disabled / before AOS init — no `<noscript>` or default-visible fallback | **CRITICAL** |
| 2 | Majority of below-fold content sits at opacity:0 until scrolled into view (expected AOS behavior, but risk if crawler doesn't simulate scroll) | MEDIUM |
| 3 | Mobile above-the-fold hero clearly conveys who/what/how-to-contact | OK (no action) |
| 4 | Hero CTA buttons are 40px tall, under 48px touch-target guideline | LOW |
| 5 | Menu (theme/language switcher) interaction could not be confirmed to open via scripted click — inconclusive, needs manual re-test | NOT TESTED / inconclusive |
| 6 | No horizontal overflow on any tested viewport/theme | OK |
| 7 | Dark mode contrast good in hero/skills sections (light-text-on-dark, legible) | OK |
| 8 | No layout shift observed above-the-fold between early and settled paint | LOW / OK |
| 9 | /fr text-wrapping vs /en not exhaustively compared | NOT TESTED |
