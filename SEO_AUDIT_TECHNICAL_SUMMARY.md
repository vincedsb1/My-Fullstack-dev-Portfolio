# SEO Audit - Technical Summary & File Locations

## File Analysis Summary

### Architecture Overview

```
/Users/vincentdesbrosses/Documents/Projects/Test-po/portfolio/
├── src/app/
│   ├── layout.tsx                      # Root layout (minimal)
│   ├── page.tsx                        # Root redirect to /en
│   ├── [locale]/
│   │   ├── layout.tsx                  # Locale layout (HAS metadata)
│   │   ├── page.tsx                    # Home page (client-side)
│   │   ├── integration/
│   │   │   └── page.tsx                # Integration page (NO metadata)
│   │   └── components/
│   │       ├── Header.tsx              # Profile + CTA buttons (NO H1!)
│   │       ├── Skills.tsx              # Skills section (div headings)
│   │       ├── Projects.tsx            # Project cards (div headings)
│   │       ├── Timeline.tsx            # Experience timeline (div headings)
│   │       ├── FAQ.tsx                 # FAQ section (H3 in custom accordion)
│   │       ├── Footer.tsx              # Footer CTA (good)
│   │       ├── MenuButton.tsx          # Menu toggle (accessibility issue)
│   │       ├── CustomAccordion.tsx     # Accordion (H3 tags - good!)
│   ├── components/                     # Top-level components
│   │   ├── LanguageSwitcher.tsx       # i18n toggle (no aria-label)
│   │   ├── ThemeSwitcher.tsx          # Dark mode toggle
│   │   ├── Providers.tsx              # Theme provider
│   ├── globals.css                     # Tailwind + base styles
│   └── Google Search.html              # Verification file
├── public/
│   ├── pp.jpg                          # Profile picture (162 KB)
│   ├── project*.png                    # Project images (171-401 KB each)
│   ├── CV*.pdf                         # Localized CVs
│   └── next.svg, vercel.svg
├── i18n/
│   ├── en.json                         # English translations (135 lines)
│   ├── fr.json                         # French translations (complete)
│   ├── i18n.config.ts                  # Config: locales = [en, fr]
│   └── i18n.ts                         # next-intl config
├── middleware.ts                       # Locale detection & routing
├── next.config.mjs                     # Minimal config (only i18n)
├── tailwind.config.ts                  # Tailwind with custom breakpoints
├── tsconfig.json                       # TypeScript strict mode
├── package.json                        # Dependencies
├── .eslintrc.json                      # ESLint config
└── CLAUDE.md                           # Project documentation

Missing Files:
├── robots.ts                           # MISSING - Critical!
├── sitemap.ts                          # MISSING - Critical!
└── public/robots.txt                   # MISSING - Alternative
```

---

## Metadata Implementation Details

### Current Metadata Configuration

**File:** `/src/app/[locale]/layout.tsx` (Lines 23-34)

```typescript
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Vincent's portfolio",
    description:
      "Dive into my world of creativity, experience, and digital connections.",
  };
}
```

**Actual HTML Output:**

```html
<meta
  name="google-site-verification"
  content="PW82MjVgB5OXOfa6RcjIX06LfN3lZ1arROcD41Ao1z4"
/>
<html lang="en">
  <!-- Dynamic locale -->
  <head>
    <!-- Missing: OG tags, canonical, hreflang, robots, etc. -->
  </head>
</html>
```

### Translation Metadata (Unused)

**Files:** `/src/i18n/en.json` & `/src/i18n/fr.json` (Lines 135-138)

```json
{
  "metadata": {
    "title": "Vincent's portfolio",
    "description": "Dive into my world of creativity, experience, and digital connections."
  }
}
```

**Status:** Defined but not used in generateMetadata()

---

## Heading Structure Analysis

### By Component

**Header.tsx (Lines 42-196)**

```typescript
// Line 57-60: Greeting (DIV instead of H1 intro)
<div id="headerHi" className="...text-xl...font-bold...">
  {t("greeting")}  // "Hi there! I'm"
</div>

// Line 63-68: NAME (DIV instead of H1 - CRITICAL!)
<div id="headerName" className="...text-4xl...3xs:text-5xl...font-bold...">
  {t("name")}  // "Vincent DESBROSSES"
</div>

// Line 70-75: Job Title (DIV instead of H2)
<div id="headerJob" className="...text-xl...font-bold...">
  {t("jobTitle")}  // "Fullstack developer"
</div>

// Line 77-82: Description (should be P tag)
<div id="headerPresentation" className="...text-xl...">
  {t("description")}  // "From ideation to completion..."
</div>
```

**Skills.tsx (Lines 36-50)**

```typescript
// DIV heading structure
<div id="skillsTitleTopContainer" className="...text-2xl...font-bold...">
  <div id="skillsIcon" className="...">
    <Code2 size={32} className="mr-6 text-5xl" />
  </div>
  <div id="skillsTitle" className="...text-2xl...3xs:text-3xl">
    {t("title")}  // "Skills"
  </div>
</div>

// Subsections: Design, Frontend, Backend, Other (all DIVs)
// Should be H3 tags
```

**Projects.tsx (Lines 19-34)**

```typescript
// DIV heading (should be H2)
<div id="projectsTitle" className="...text-2xl...3xs:text-3xl">
  {t("title")}  // "Projects"
</div>

// Project cards have titles (should be H3)
<div id="project5Title" className="...text-2xl...">
  {t("project5.name")}
</div>
```

**Timeline.tsx (Lines 27-42)**

```typescript
// DIV heading (should be H2)
<div id="timelineTitle" className="...text-2xl...3xs:text-3xl">
  {t("title")}  // "Journey"
</div>

// Experience entries (should be H3)
<div id="timelineCompagnyNameJob" className="...font-bold...">
  <div id={`timelineCompagny${...}`} className="...text-md...3xs:text-xl">
    {experience.company}  // Company names
  </div>
  <div id={`timelineJob${...}`} className="...text-md">
    {experience.position}  // Job titles
  </div>
</div>
```

**FAQ.tsx (Lines 59-82) & CustomAccordion.tsx (Lines 13-45)**

```typescript
// FAQ section heading (DIV)
<div id="faqTitle" className="...text-2xl...3xs:text-3xl">
  {t("title")}  // "Do you have any questions?"
</div>

// FAQ items - THIS ONE IS GOOD!
// AccordionItemComponent (Line 25)
<h3 className="...text-base...3xs:text-lg...font-semibold...">
  {question}  // Proper H3 tag!
</h3>
```

**Summary of Heading Issues:**

- 0 H1 tags found (CRITICAL)
- H2 equivalent: 5 sections (all as DIVs)
- H3 equivalent: ~20 items (19 as DIVs, 1 as H3 in FAQ)

---

## Image Optimization Data

### Image Files in /public

| File                          | Size       | Format | Type                 |
| ----------------------------- | ---------- | ------ | -------------------- |
| pp.jpg                        | 162 KB     | JPEG   | Profile picture      |
| project1.png                  | 194 KB     | PNG    | Card image           |
| project2.png                  | 252 KB     | PNG    | Card image           |
| project3.png                  | 401 KB     | PNG    | Card image (largest) |
| project4.png                  | 317 KB     | PNG    | Card image           |
| project5.png                  | 171 KB     | PNG    | Card image           |
| project6-2.png                | 262 KB     | PNG    | Card image           |
| Resume_Vincent_DESBROSSES.pdf | 138 KB     | PDF    | EN CV                |
| CV Vincent DESBROSSES.pdf     | 141 KB     | PDF    | FR CV                |
| **TOTAL IMAGES**              | **2.1 MB** | -      | -                    |

### Image Implementation

**Header.tsx (Lines 93-98)**

```typescript
<Image
  src={pp}
  alt="Vincent DESBROSSES"
  quality={100}
  className="rounded-full ring-4 ring-red-500 p-2"
/>
```

**Projects.tsx - Examples**

```typescript
// Project 5 (Lines 90-96)
<Image
  src="/project5.png"
  width={815}
  height={730}
  alt="Décor Nature"  // Minimal description
/>

// Project 4 (Lines 389-394) - HAS DUPLICATE ALT TEXT!
<Image
  src="/project4.png"
  width={615}
  height={730}
  alt="QuickFlow"  // Should be unique, not duplicate of project6
/>
```

**Issues:**

- Quality set to 100 (unnecessary for web)
- No `sizes` attribute for responsive images
- No format configuration (no AVIF/WebP fallback)
- Project4 has same alt as project6
- Large image file sizes (up to 401 KB for project3.png)

---

## Accessibility Issues Detail

### Missing ARIA Labels

**MenuButton.tsx (Lines 8-28)**

```typescript
<div
  id="buttonMenuBg"
  onClick={onMenuClick}
  onKeyDown={handleKeyDown}
  role="button"
  tabIndex={0}
  // MISSING: aria-label="Open menu"
  // MISSING: aria-expanded={isOpen} (if tracking state)
  // MISSING: aria-controls="menu-container"
  className="..."
>
  <MoreHorizontal className="mb-1" />
</div>
```

**LanguageSwitcher.tsx (Lines 47-73)**

```typescript
<div className="...">
  <div className="...font-bold...">
    <Globe className="mr-2" size={18} />
    Language  <!-- Not labeled for screen readers -->
    <!-- MISSING: <label for="language-select"> -->
  </div>
  <div onClick={() => handleLanguageChange("en")} role="button">
    <!-- MISSING: aria-label="Select English" -->
    <!-- MISSING: aria-current="page" (if selected) -->
    🇬🇧 English
  </div>
  <!-- MISSING: aria-live="polite" for language change feedback -->
</div>
```

**Header.tsx - Email Copy Button (Lines 107-123)**

```typescript
<button
  id="email"
  type="button"
  onClick={handleCopyEmail}
  // MISSING: aria-label="Copy email to clipboard"
  // MISSING: aria-live="polite" for feedback
  tabIndex={0}
>
  {isCopied ? (
    <span>{tc("copied")}</span>  // No announcement!
  ) : (
    <>
      <Mail className="mr-2" /> {tc("email")}
    </>
  )}
</button>
```

**FAQ CustomAccordion.tsx (Lines 20-44)**

```typescript
<button
  onClick={onToggle}
  className="..."
  // GOOD: H3 tag is semantic
  // MISSING: aria-expanded={isOpen}
  // MISSING: aria-controls="faq-item-1"
>
  <h3>{question}</h3>
  <ChevronDown
    className={`${isOpen ? "rotate-180" : ""}`}
    // Icon rotation is visual only - needs aria-expanded on button
  />
</button>
<div
  className={`${isOpen ? "..." : "...max-h-0 opacity-0"}`}
  // MISSING: aria-hidden={!isOpen}
>
  {answer}
</div>
```

---

## i18n & Localization Status

### Translation Files

**en.json (140 lines)**

```json
{
  "common": {
    /* 9 keys */
  },
  "header": {
    /* 4 keys */
  },
  "footer": {
    /* 2 keys */
  },
  "skills": {
    /* 6 keys */
  },
  "projects": {
    /* 6 projects with 2 keys each = 12 keys */
  },
  "timeline": {
    /* 1 key + 7 experiences with 4 keys each */
  },
  "faq": {
    /* 1 key + 6 items with 2 keys each */
  },
  "metadata": {
    /* 2 keys (unused!) */
  }
}
```

**fr.json (complete with all translations)**

### i18n Configuration

**middleware.ts (Lines 1-38)**

```typescript
// Locale detection chain:
// 1. URL pathname (already localized)
// 2. Cookie 'NEXT_LOCALE' (persistent)
// 3. Accept-Language header
// 4. Default: 'en'

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico)(?:.*))''],
};
```

**i18n.config.ts**

```typescript
export const locales = ["en", "fr"] as const;
export const defaultLocale = "en" as const;
```

**i18n.ts**

```typescript
return {
  locale: validLocale,
  messages: (await import(`./src/i18n/${validLocale}.json`)).default,
};
```

### Hreflang Missing

**No alternate language links implemented:**

```html
<!-- MISSING from <head> -->
<link rel="alternate" hreflang="en" href="https://yoursite.com/en" />
<link rel="alternate" hreflang="fr" href="https://yoursite.com/fr" />
<link rel="alternate" hreflang="x-default" href="https://yoursite.com/en" />
```

**Not in metadata:**

```typescript
// MISSING from generateMetadata()
alternates: {
  languages: {
    'en': 'https://yoursite.com/en',
    'fr': 'https://yoursite.com/fr',
    'x-default': 'https://yoursite.com/en',
  },
}
```

---

## Performance Configuration

### Next.js Defaults Being Used

- ✅ Image optimization (via Image component)
- ✅ Code splitting (App Router)
- ✅ Font optimization (Inter)
- ✅ Minification (Tailwind)
- ✅ Compression (handled by Vercel)

### next.config.mjs (Minimal)

```javascript
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n.ts");

const nextConfig = {}; // Empty config!

export default withNextIntl(nextConfig);
```

**What's Missing:**

```javascript
// Could add:
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000, // 1 year
  },
  compress: true,
  poweredByHeader: false,
  // ... other optimizations
};
```

---

## External Dependencies Impact on SEO

### Loaded Resources

1. **FontAwesome** (6.4.2)

   - Used in Projects, Timeline components
   - File: @fortawesome/fontawesome-svg-core/styles.css
   - Issue: Unused icons (migration started to lucide-react)

2. **lucide-react** (0.291.0)

   - Primary icon library
   - No SEO impact

3. **next-intl** (4.5.3)

   - i18n handling
   - Good for SEO with locale routing

4. **next-themes** (0.2.1)

   - Dark mode support
   - No SEO impact

5. **AOS** (2.3.4)
   - Animate on Scroll
   - Good for user engagement, no SEO penalty

---

## Performance Metrics Baseline

### Estimated Scores (Before Fixes)

**Google Lighthouse:**

- SEO Score: ~60/100
  - Missing: H1, meta tags, schema, alt text quality
  - Deductions: ~40 points
- Performance Score: ~78/100

  - Large images (project3.png: 401 KB)
  - Quality: 100 for images unnecessary
  - Potential: 85-90 with optimization

- Accessibility Score: ~82/100
  - Good: Semantic HTML, dark mode, responsive
  - Missing: ARIA labels, color contrast check
  - Potential: 90+ with aria fixes

**Web Core Vitals (estimated):**

- LCP: ~2.5s (acceptable)
- FID: <100ms (good)
- CLS: ~0.1 (good)

---

## CSS & Styling Analysis

### Tailwind Config (tailwind.config.ts)

```typescript
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "...",
        "gradient-conic": "...",
      },
      screens: {
        xs: "320px",
        "2xs": "390px",
        "3xs": "480px",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
```

**Custom Breakpoints:**

- xs: 320px (mobile)
- 2xs: 390px (mobile)
- 3xs: 480px (mobile)
- sm, md, lg, xl, 2xl (Tailwind defaults)

**SEO Impact:**

- ✅ Responsive design (mobile-first)
- ✅ Dark mode doesn't impact SEO
- ⚠️ All styling via Tailwind (no accessibility issues, but check contrast)

---

## Summary: Critical Findings

### Must Fix (SEO Impact)

1. **Add H1 tag** - Search engines expect H1
2. **Add Schema markup** - No structured data at all
3. **Add meta tags** - OG, Twitter, canonical
4. **Add hreflang** - i18n URLs need alternates
5. **Add robots.txt & sitemap** - Enable indexing

### Should Fix (Accessibility)

6. **Add ARIA labels** - Screen reader support
7. **Add aria-expanded** - Accordion/menu state
8. **Improve alt text** - More descriptive

### Nice to Have (Performance)

9. **Optimize images** - AVIF/WebP, compression
10. **Add analytics** - Track user behavior

---

## Verification

All file paths confirmed in:

- `/Users/vincentdesbrosses/Documents/Projects/Test-po/portfolio/`
- Git branch: main
- Status: M package-lock.json (modified dependencies only)
