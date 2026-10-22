# Comprehensive SEO Audit Report

## Vincent's Next.js 16 Portfolio

**Date:** November 16, 2025
**Framework:** Next.js 14.0.1 with TypeScript
**Tech Stack:** React 18, Tailwind CSS, next-intl, next-themes
**Internationalization:** English & French (EN/FR)

---

## EXECUTIVE SUMMARY

The portfolio demonstrates **moderate SEO implementation** with several strengths but significant gaps. The site benefits from modern Next.js infrastructure, i18n support, and proper semantic HTML, but lacks critical SEO elements such as Open Graph tags, schema markup, sitemaps, and robots.txt. A structured plan to address these gaps would significantly improve discoverability and social sharing performance.

**Overall SEO Score: 6/10**

---

## 1. METADATA CONFIGURATION

### Current Implementation:

**Root Layout (`src/app/[locale]/layout.tsx`):**

- ✅ Basic metadata in `generateMetadata()`:
  - Title: "Vincent's portfolio"
  - Description: "Dive into my world of creativity, experience, and digital connections."
- ✅ Google Site Verification meta tag present
- ✅ Proper HTML lang attribute set to locale (en/fr)
- ✅ Inter Google Font (Latin subset)

**Issues:**

- ❌ No Open Graph (og:) tags
- ❌ No Twitter Card tags
- ❌ No canonical tags for locale versions
- ❌ No viewport meta tag (handled by Next.js default)
- ❌ No charset meta tag (handled by Next.js default)
- ❌ No robots meta tag
- ❌ Metadata doesn't leverage translations from i18n
- ❌ No alternate link tags for hreflang (critical for i18n SEO)

**Translation Files:**

- ✅ Metadata namespace in `en.json` and `fr.json` contains localized title/description
- Issue: Metadata is not dynamically generated from i18n translations

**Recommendation:**

```typescript
// Should be in [locale]/layout.tsx
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `https://yoursite.com/${locale}`,
      siteName: t("title"),
      images: [
        {
          url: "https://yoursite.com/og-image.png",
          width: 1200,
          height: 630,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      creator: "@vincedsb",
    },
    alternates: {
      languages: {
        en: "https://yoursite.com/en",
        fr: "https://yoursite.com/fr",
      },
    },
  };
}
```

---

## 2. HEADING STRUCTURE (H1, H2, H3)

### Current Usage:

**Header Component:**

- ❌ No H1 tag found (critical SEO element missing!)
- Greeting text: div id="headerHi" (should be part of H1)
- Name: div id="headerName" (should be H1)
- Job title: div id="headerJob" (could be H2)
- Description: div id="headerPresentation" (P tag appropriate)

**Skills Component:**

- ✅ H2 equivalent in div id="skillsTitle"
- H3-equivalent headings: "Design", "Frontend", "Backend", "Other"
  - Issue: Using divs instead of semantic H3 tags

**Projects Component:**

- ✅ H2 equivalent in div id="projectsTitle"
- Project cards have titles (h2 level via div)
- Issue: Not using proper heading hierarchy

**Timeline Component:**

- ✅ H2 equivalent in div id="timelineTitle"
- Experience entries: Company/Position (should be H3)
- Issue: Not semantic heading tags

**FAQ Component:**

- ✅ H2 equivalent in div id="faqTitle"
- ✅ CustomAccordion uses `<h3>` tags for questions (good!)

**Critical Issues:**

- ❌ No H1 tag on entire page (violates basic SEO principle)
- ❌ Inconsistent heading hierarchy
- ❌ Most headings implemented as divs with styling instead of semantic tags

**Recommendation:**
Implement proper H1-H6 hierarchy:

```
H1: Name/Main identity (Header component)
H2: Sections (Skills, Projects, Timeline, FAQ, Footer)
H3: Subsections (Categories, Project names, Experience items)
```

---

## 3. IMAGE TAGS AND ALT TEXT

### Current Implementation:

**Images Found:**

1. **Profile Picture** (`Header.tsx` line 93-98):

   - ✅ Using Next.js Image component
   - ✅ Alt text: "Vincent DESBROSSES"
   - ✅ Quality: 100
   - Issue: Image filename not descriptive (pp.jpg)

2. **Project Images** (`Projects.tsx`):

   - ✅ All project images use Next.js Image component
   - ✅ Alt texts present for all projects:
     - "Décor Nature"
     - "QuickFlow"
     - "Is Tesla Worth It?"
     - "Emmaüs connect"
     - "Wilder Game"
     - "QuickFlow"
   - ✅ Proper width/height attributes set
   - Issue: Last project (project4) has duplicate alt text with project6

3. **Footer Image** (`Footer.tsx` line 58-63):
   - ✅ Using Next.js Image component
   - ✅ Alt text: "Vincent DESBROSSES"
   - ✅ Quality: 100

**Issues:**

- ⚠️ Alt texts are minimal (just project names, not descriptive)
- ⚠️ No image captions
- ❌ Profile image filename (pp.jpg) not SEO-friendly
- ❌ No AVIF/WebP format specification in next.config.js
- ⚠️ Image quality set to 100 (may impact performance)

**Recommendations:**

```typescript
// Better alt text examples:
alt="Vincent DESBROSSES - Fullstack Developer Portfolio"
alt="Décor Nature Website - Painting and Decoration Business"
alt="Is Tesla Worth It - Car Comparison App Interface"

// Add image optimization:
{
  image: {
    formats: ['image/avif', 'image/webp'],
  }
}
```

---

## 4. INTERNAL LINK STRUCTURE

### Current Implementation:

**Navigation:**

- ✅ Locale-prefixed URLs: `/en/`, `/fr/`
- ✅ Middleware redirects unprefixed routes to localized versions
- ✅ Language switcher available globally
- ✅ Root page redirects to `/en`

**Links:**

- ✅ Social media buttons (LinkedIn, GitHub, Twitter, Malt)
- ✅ CV download functionality (locale-aware)
- ✅ Email copy-to-clipboard

**Issues:**

- ❌ No anchor navigation links (jump-to-section) on page
- ❌ No internal cross-links between sections
- ❌ No breadcrumb navigation
- ❌ No "Back to top" button
- ❌ No sitemap (means search engines can't discover all pages)
- ❌ No previous/next navigation for sections

**Page Structure:**

- `/en/` - Home page
- `/fr/` - French home page
- `/en/integration` - Legal directory integration (no metadata/breadcrumb)
- `/fr/integration` - French integration page

**Recommendation:**

```typescript
// Add anchor navigation
<a href="#skills">Jump to Skills</a>
<a href="#projects">Jump to Projects</a>

// Add breadcrumb schema
<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="#skills">Skills</a></li>
  </ol>
</nav>
```

---

## 5. COMPONENT STRUCTURE AND ACCESSIBILITY

### Strengths:

**Semantic HTML:**

- ✅ `<main>` tag used as primary landmark
- ✅ Role attributes used (role="link", role="button")
- ✅ Tab indexes properly managed
- ✅ Keyboard navigation support (Enter/Space)
- ✅ Proper button types (type="button")

**Accessibility Features:**

- ✅ FAQ accordion uses `<h3>` semantic tags
- ✅ Custom accordion component handles focus/keyboard nav
- ✅ Dark mode support via next-themes
- ✅ ID attributes on all major sections
- ✅ Responsive design with multiple breakpoints

**Issues:**

- ❌ Missing ARIA labels on many interactive elements
  - Menu button lacks aria-label
  - Language switcher lacks aria-label
  - Theme switcher lacks aria-label
  - Accordion buttons lack aria-expanded
- ❌ No skip-to-main-content link
- ❌ No aria-live regions for feedback (email copied)
- ❌ Color contrast not explicitly verified
- ❌ No focus indicators for keyboard users
- ❌ No `<nav>` semantic tag for main menu

**Recommendations:**

```typescript
// Add ARIA attributes
<button aria-label="Open menu" role="button">
<button aria-expanded={isOpen} aria-controls="menu">
<div aria-live="polite" aria-atomic="true">Copied!</div>
<nav aria-label="Main navigation">
```

---

## 6. PERFORMANCE-RELATED CONFIGURATIONS

### Implemented:

**Next.js 16 Defaults:**

- ✅ Automatic image optimization via Image component
- ✅ App Router (no legacy Pages Router)
- ✅ Static generation for pages by default
- ✅ Font optimization (Inter from Google Fonts)
- ✅ CSS minification (Tailwind)

**Next Config (`next.config.mjs`):**

- ✅ i18n plugin configured
- ⚠️ Minimal configuration (good for defaults)

**Missing Optimizations:**

- ❌ No explicit image optimization config (formats, sizes)
- ❌ No compression/gzip configuration
- ❌ No caching headers specified
- ❌ No analytics script configured
- ❌ No preload/prefetch hints
- ❌ No performance monitoring (Web Vitals)
- ❌ No Service Worker for offline support

**Font Loading:**

```typescript
// Current: Inter from Google Fonts (good!)
const inter = Inter({ subsets: ["latin"] });

// Missing optimization could add:
const inter = Inter({
  subsets: ["latin"],
  display: "swap", // Ensure text visibility
  fallback: ["system-ui"],
});
```

**Image Optimization Recommendations:**

```javascript
// In next.config.mjs
export default withNextIntl({
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
  },
  compress: true,
  poweredByHeader: false,
});
```

---

## 7. SCHEMA MARKUP (STRUCTURED DATA)

### Current Implementation:

- ❌ **NO SCHEMA MARKUP FOUND** (Critical Missing!)

### Required Schema Types:

**1. Organization Schema** (Missing):

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Vincent DESBROSSES",
  "url": "https://yoursite.com",
  "logo": "https://yoursite.com/logo.png",
  "description": "Fullstack Developer Portfolio",
  "sameAs": [
    "https://www.linkedin.com/in/vincent-desbrosses/",
    "https://github.com/vincedsb1",
    "https://twitter.com/vincedsb"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Support",
    "email": "vincedsb@gmail.com"
  }
}
```

**2. Person Schema** (Missing):

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Vincent DESBROSSES",
  "url": "https://yoursite.com",
  "image": "https://yoursite.com/pp.jpg",
  "jobTitle": "Fullstack Developer",
  "description": "From ideation to completion, my skillset covers the full lifecycle of a web project.",
  "sameAs": [
    "https://www.linkedin.com/in/vincent-desbrosses/",
    "https://github.com/vincedsb1",
    "https://twitter.com/vincedsb"
  ]
}
```

**3. BreadcrumbList Schema** (Missing):

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://yoursite.com/en"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Skills",
      "item": "https://yoursite.com/en#skills"
    }
  ]
}
```

**4. Project/CreativeWork Schema** (Missing):

```json
{
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": "Décor Nature",
  "description": "Painting and decorating company website",
  "url": "https://decor-nature.fr/",
  "image": "https://yoursite.com/project5.png"
}
```

**Recommendation:**
Add structured data via Next.js metadata or JSON-LD scripts:

```typescript
// In layout.tsx
export const metadata: Metadata = {
  // ... other metadata
  other: {
    "application/ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Person",
      // ... schema data
    }),
  },
};
```

---

## 8. ROBOTS.TXT AND SITEMAP

### Current Implementation:

- ❌ **NO robots.txt FOUND**
- ❌ **NO sitemap.xml FOUND**

### Required Files:

**robots.txt** (Missing):

```
User-agent: *
Allow: /
Disallow: /integration

Sitemap: https://yoursite.com/sitemap.xml
```

**sitemap.xml** (Missing - should include):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://yoursite.com/en</loc>
    <xhtml:link rel="alternate" hreflang="fr" href="https://yoursite.com/fr" />
    <lastmod>2025-11-14</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://yoursite.com/fr</loc>
    <xhtml:link rel="alternate" hreflang="en" href="https://yoursite.com/en" />
    <lastmod>2025-11-14</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://yoursite.com/en/integration</loc>
    <lastmod>2025-11-14</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://yoursite.com/fr/integration</loc>
    <lastmod>2025-11-14</lastmod>
    <priority>0.8</priority>
  </url>
</urlset>
```

**Implementation for Next.js:**
Create `/app/robots.ts` and `/app/sitemap.ts` (or `/public/robots.txt`):

```typescript
// app/robots.ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/integration",
      },
    ],
    sitemap: "https://yoursite.com/sitemap.xml",
  };
}
```

```typescript
// app/sitemap.ts
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://yoursite.com/en",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://yoursite.com/fr",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://yoursite.com/en/integration",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://yoursite.com/fr/integration",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}
```

---

## 9. CURRENT META TAGS IN LAYOUT AND PAGE FILES

### Root Layout (`src/app/layout.tsx`):

```typescript
// Minimal - just returns children
// Should include Providers wrapper here or in [locale]/layout.tsx
```

**Issues:**

- ❌ Empty - no metadata
- ❌ No viewport meta tag (handled by Next.js)
- ❌ No base layout structure

### Locale Layout (`src/app/[locale]/layout.tsx`):

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

**Current Meta Tags:**

- ✅ `<meta name="google-site-verification" />`
- ✅ `<html lang={locale}>`
- ✅ Font: Inter from Google Fonts

**Missing Meta Tags:**

- ❌ `<meta name="viewport" />`
- ❌ `<meta charset="utf-8" />`
- ❌ `<meta name="robots" />`
- ❌ `<meta property="og:*" />`
- ❌ `<meta name="twitter:*" />`
- ❌ `<meta name="description" />`
- ❌ `<link rel="canonical" />`
- ❌ `<link rel="alternate" hreflang="*" />`
- ❌ `<meta name="theme-color" />`
- ❌ `<link rel="icon" />`
- ❌ `<link rel="manifest" />`

### Home Page (`src/app/[locale]/page.tsx`):

- ❌ No metadata override
- Issue: Uses layout metadata only

### Integration Page (`src/app/[locale]/integration/page.tsx`):

- ❌ No metadata configuration
- Issue: Uses parent layout metadata (generic)
- Missing: Page-specific title/description

---

## 10. FONT AND IMAGE OPTIMIZATION SETTINGS

### Font Optimization:

**Current Implementation:**

```typescript
const inter = Inter({ subsets: ["latin"] });
```

✅ Using Next.js Font Optimization:

- ✅ Google Fonts (Inter)
- ✅ Subset specified (Latin)
- ✅ Self-hosted by Next.js (no external request)

**Recommendations:**

```typescript
// Better configuration:
const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap', // Ensures text visibility
  weight: ['400', '500', '600', '700', '800'],
});

// In globals.css:
html {
  font-family: var(--font-inter);
}

// Consider adding additional fonts for hierarchy:
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
  variable: '--font-poppins',
  display: 'swap',
});
```

### Image Optimization:

**Current Implementation:**

- ✅ All images use Next.js Image component
- ✅ Width/height specified for project images
- ✅ Quality: 100 for profile pictures
- ⚠️ Responsive sizing via Tailwind classes

**Issues:**

- ⚠️ Quality: 100 may be unnecessary (75-85 usually fine)
- ❌ No srcSet/responsive image sizes specified
- ❌ No lazy loading explicit (Next.js does it by default)
- ❌ No AVIF/WebP format configuration
- ❌ Large image files in /public:
  - project1.png: 194 KB
  - project2.png: 252 KB
  - project3.png: 401 KB (largest)
  - project4.png: 317 KB
  - project5.png: 171 KB
  - project6-2.png: 262 KB
  - pp.jpg: 162 KB

**Recommendations:**

```typescript
// In next.config.mjs
export default withNextIntl({
  images: {
    formats: ['image/avif', 'image/webp'],
    // Enable caching of optimized images
    minimumCacheTTL: 60 * 60 * 24 * 365,
    // Remove hosting of unoptimized images
    unoptimized: false,
  },
});

// In Image components:
<Image
  src="/project1.png"
  alt="Is Tesla Worth It - Car Comparison App"
  width={815}
  height={730}
  quality={80} // Reduce from 100
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  priority={false} // Let Next.js lazy load
/>

// Consider Image compression pre-deployment
// Tools: TinyPNG, ImageOptim, Sharp CLI
```

---

## 11. INTERNATIONALIZATION (i18n) SEO CONSIDERATIONS

### Current Implementation:

✅ **Strong i18n Setup:**

- ✅ URL-based locale prefixing (`/en/`, `/fr/`)
- ✅ Middleware for locale detection
- ✅ Cookie-based preference storage
- ✅ Accept-Language header fallback
- ✅ Complete translations (en.json, fr.json)

**i18n SEO Strengths:**

- ✅ Proper locale routing
- ✅ Browser language auto-detection
- ✅ Persistent user preference

**i18n SEO Issues:**

- ❌ Missing `hreflang` links (critical for multi-language SEO!)
- ❌ No alternate link tags in metadata
- ❌ No x-default locale specified
- ❌ Metadata not leveraging i18n translations
- ❌ Missing canonicals for each locale version

**Hreflang Implementation (Missing):**

```typescript
// Should be in generateMetadata:
alternates: {
  languages: {
    'en': 'https://yoursite.com/en',
    'fr': 'https://yoursite.com/fr',
    'x-default': 'https://yoursite.com/en',
  },
}

// And in HTML head:
<link rel="alternate" hreflang="en" href="https://yoursite.com/en" />
<link rel="alternate" hreflang="fr" href="https://yoursite.com/fr" />
<link rel="alternate" hreflang="x-default" href="https://yoursite.com/en" />
```

---

## SUMMARY OF CRITICAL MISSING ELEMENTS

### High Priority (Critical):

1. ❌ H1 heading (violates basic SEO)
2. ❌ Schema/Structured Data (zero markup)
3. ❌ Open Graph & Twitter tags
4. ❌ Hreflang tags for i18n
5. ❌ Robots.txt and Sitemap.xml
6. ❌ Canonical tags

### Medium Priority (Important):

7. ⚠️ Image alt text improvements
8. ⚠️ Semantic heading hierarchy (H2-H3)
9. ⚠️ ARIA labels for accessibility
10. ⚠️ Integration page metadata

### Low Priority (Enhancement):

11. Image optimization (compression, formats)
12. Performance monitoring setup
13. Anchor navigation/table of contents
14. Breadcrumb navigation

---

## IMPLEMENTATION ROADMAP

### Phase 1 (Week 1-2) - Critical SEO Fixes:

- [ ] Add H1 tag to Header component
- [ ] Create robots.ts and sitemap.ts
- [ ] Add hreflang tags to metadata
- [ ] Implement organization/person schema
- [ ] Add OG and Twitter meta tags
- [ ] Add canonical tags

### Phase 2 (Week 2-3) - Content & Structure:

- [ ] Fix heading hierarchy (semantic H2-H3)
- [ ] Improve image alt text
- [ ] Add ARIA labels for accessibility
- [ ] Create metadata for integration page
- [ ] Add breadcrumb navigation

### Phase 3 (Week 3-4) - Optimization:

- [ ] Optimize image formats (AVIF/WebP)
- [ ] Compress project images
- [ ] Add Web Vitals monitoring
- [ ] Set up analytics (if desired)
- [ ] Test with SEO tools (Lighthouse, PageSpeed)

---

## TESTING & VALIDATION

### Tools to Use:

1. **Google Search Console** - Index coverage, mobile usability
2. **Google Lighthouse** - Performance, SEO, Accessibility
3. **Schema.org Validator** - Structured data validation
4. **Open Graph Debugger** - Social media sharing preview
5. **Mobile-Friendly Test** - Mobile compatibility

### Current Estimated Scores:

- Lighthouse SEO: ~60/100 (missing meta tags, headings, schema)
- Lighthouse Performance: ~75-85/100 (good defaults)
- Lighthouse Accessibility: ~80/100 (good ARIA, but could improve)

---

## CONCLUSION

Your portfolio has a **solid technical foundation** with Next.js 14, proper i18n implementation, and accessibility considerations. However, it lacks critical SEO elements that would improve search engine discoverability and social media sharing.

**Estimated Time to Fix:** 2-4 weeks
**Expected SEO Improvement:** 6/10 → 8.5/10

Prioritizing the High Priority items in Phase 1 will dramatically improve SEO performance and search visibility.
