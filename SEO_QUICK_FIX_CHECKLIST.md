# SEO Quick Fix Checklist

## Priority 1: Critical (Do First)

### 1. Fix Missing H1 Tag
- **File:** `src/app/components/Header.tsx`
- **Issue:** Name is in DIV instead of H1
- **Action:** Replace div id="headerName" with `<h1>`
- **Estimated Time:** 5 minutes

```typescript
// BEFORE
<div id="headerName" className="...text-4xl...">
  {t("name")}
</div>

// AFTER
<h1 id="headerName" className="...text-4xl...">
  {t("name")}
</h1>
```

---

### 2. Create robots.ts
- **File:** Create `src/app/robots.ts`
- **Issue:** No robot instructions for search engines
- **Estimated Time:** 10 minutes

```typescript
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: '/integration',
      },
    ],
    sitemap: 'https://your-domain.com/sitemap.xml',
  }
}
```

---

### 3. Create sitemap.ts
- **File:** Create `src/app/sitemap.ts`
- **Issue:** Search engines can't discover all pages
- **Estimated Time:** 10 minutes

```typescript
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://your-domain.com/en',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://your-domain.com/fr',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://your-domain.com/en/integration',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://your-domain.com/fr/integration',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]
}
```

---

### 4. Add Hreflang to Layout Metadata
- **File:** `src/app/[locale]/layout.tsx`
- **Issue:** i18n URLs not linked to each other
- **Estimated Time:** 15 minutes

```typescript
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  
  return {
    title: "Vincent's portfolio",
    description: "Dive into my world of creativity, experience, and digital connections.",
    alternates: {
      languages: {
        'en': 'https://your-domain.com/en',
        'fr': 'https://your-domain.com/fr',
        'x-default': 'https://your-domain.com/en',
      },
      canonical: `https://your-domain.com/${locale}`,
    },
    openGraph: {
      title: "Vincent's portfolio",
      description: "Dive into my world of creativity, experience, and digital connections.",
      url: `https://your-domain.com/${locale}`,
      type: 'website',
      siteName: "Vincent's portfolio",
    },
    twitter: {
      card: 'summary_large_image',
      title: "Vincent's portfolio",
      description: "Dive into my world of creativity, experience, and digital connections.",
      creator: '@vincedsb',
    },
  };
}
```

---

### 5. Add Schema Markup
- **File:** `src/app/[locale]/layout.tsx`
- **Issue:** No structured data for rich snippets
- **Estimated Time:** 20 minutes

Add this to metadata `other` property:

```typescript
other: {
  'application/ld+json': JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    'name': 'Vincent DESBROSSES',
    'url': 'https://your-domain.com',
    'jobTitle': 'Fullstack Developer',
    'description': 'From ideation to completion, my skillset covers the full lifecycle of a web project.',
    'image': 'https://your-domain.com/pp.jpg',
    'sameAs': [
      'https://www.linkedin.com/in/vincent-desbrosses/',
      'https://github.com/vincedsb1',
      'https://twitter.com/vincedsb',
    ],
    'email': 'vincedsb@gmail.com',
  }),
},
```

---

## Priority 2: Important (Do Next)

### 6. Fix Heading Hierarchy
- **File:** `src/app/components/Skills.tsx`, `Projects.tsx`, `Timeline.tsx`
- **Issue:** Section titles are DIVs, should be H2/H3
- **Estimated Time:** 30 minutes

**Skills.tsx:**
```typescript
// BEFORE
<div id="skillsTitle" className="...text-2xl...">
  {t("title")}
</div>

// AFTER
<h2 id="skillsTitle" className="...text-2xl...">
  {t("title")}
</h2>
```

Also change subsection titles (Design, Frontend, Backend, Other) from DIV to H3.

---

### 7. Improve Image Alt Text
- **File:** `src/app/components/Projects.tsx`
- **Issue:** Alt text too minimal, project4 duplicates project6
- **Estimated Time:** 10 minutes

```typescript
// BEFORE
alt="Décor Nature"

// AFTER
alt="Décor Nature - Painting and Decoration Services Website"

// DUPLICATE ISSUE - project4 should be unique:
// BEFORE (Line 393)
alt="QuickFlow"

// AFTER
alt="QuickFlow - Ideation and Decision-Making Platform"
```

---

### 8. Add ARIA Labels
- **File:** `src/app/components/MenuButton.tsx`, `LanguageSwitcher.tsx`, `Header.tsx`, `CustomAccordion.tsx`
- **Issue:** Screen readers can't understand controls
- **Estimated Time:** 20 minutes

**MenuButton.tsx:**
```typescript
<div
  id="buttonMenuBg"
  onClick={onMenuClick}
  onKeyDown={handleKeyDown}
  role="button"
  tabIndex={0}
  aria-label="Open menu"
  aria-expanded={showMenu}  // Need to pass from parent
  aria-controls="menuContainer"
  className="..."
>
```

**LanguageSwitcher.tsx:**
```typescript
<div 
  onClick={() => handleLanguageChange("en")}
  onKeyDown={(e) => handleKeyDown(e, "en")}
  role="button"
  tabIndex={0}
  aria-label="Select English language"
  aria-current={locale === "en" ? "page" : undefined}
>
  🇬🇧 English
</div>
```

**CustomAccordion.tsx:**
```typescript
<button
  onClick={onToggle}
  aria-expanded={isOpen}
  aria-controls={`faq-panel-${item.id}`}
  className="..."
>
  <h3>{question}</h3>
  <ChevronDown aria-hidden="true" />
</button>
<div
  id={`faq-panel-${item.id}`}
  aria-hidden={!isOpen}
  className="..."
>
  {answer}
</div>
```

---

### 9. Add Integration Page Metadata
- **File:** Create `src/app/[locale]/integration/page.tsx` with metadata
- **Issue:** Integration page inherits generic metadata
- **Estimated Time:** 10 minutes

```typescript
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  return {
    title: "Integration | Vincent's Portfolio",
    description: "Legal directory integration page",
  };
}

export default function Integration() {
  // ... existing content
}
```

---

## Priority 3: Nice to Have

### 10. Optimize Images
- **File:** `next.config.mjs`
- **Issue:** Images not in modern formats, quality too high
- **Estimated Time:** 15 minutes

```javascript
export default withNextIntl({
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 365,
  },
});
```

Update Image components:
```typescript
<Image
  src="/project1.png"
  width={815}
  height={730}
  quality={80}  // Reduce from 100
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  alt="..."
/>
```

---

### 11. Fix Duplicate Project Alt Text
- **File:** `src/app/components/Projects.tsx`
- **Issue:** project4.png has same alt as project6
- **Action:** Line 393 - make alt text unique
- **Estimated Time:** 2 minutes

---

## Testing & Validation

### After Fixing, Test With:

1. **Google Lighthouse**
   ```bash
   # Build and run locally
   npm run build
   npm run start
   # Open Chrome DevTools > Lighthouse
   ```

2. **Google Search Console**
   - Submit sitemap: `https://your-domain.com/sitemap.xml`
   - Check indexing status

3. **Schema.org Validator**
   - Visit: https://validator.schema.org/
   - Paste HTML or URL

4. **Open Graph Debugger**
   - Visit: https://developers.facebook.com/tools/debug/
   - Enter your URL to preview social sharing

---

## Timeline Estimate

| Priority | Tasks | Time |
|----------|-------|------|
| P1 (Critical) | H1 + robots + sitemap + hreflang + schema | 1-2 hours |
| P2 (Important) | Headings + alt text + ARIA + metadata | 1.5 hours |
| P3 (Enhancement) | Image optimization | 1 hour |
| **Testing & QA** | Validation with tools | 1 hour |
| **TOTAL** | All fixes | 4-5 hours |

---

## Expected Results

**Before SEO Audit:**
- Lighthouse SEO: ~60/100
- Google Rankings: Limited visibility
- Social Sharing: No rich previews

**After Priority 1 Fixes:**
- Lighthouse SEO: ~75/100
- Google Rankings: Improved discoverability
- Social Sharing: Enabled

**After All Fixes:**
- Lighthouse SEO: ~85/100
- Lighthouse Performance: ~85/100
- Lighthouse Accessibility: ~90/100
- Google Rankings: Strong foundation

---

## Important URLs to Update

Replace `https://your-domain.com` with actual domain in:
- `src/app/robots.ts`
- `src/app/sitemap.ts`
- `src/app/[locale]/layout.tsx` (in metadata)
- Schema markup JSON-LD

---

## Questions?

Refer to detailed reports:
- **SEO_AUDIT_REPORT.md** - Comprehensive analysis with recommendations
- **SEO_AUDIT_TECHNICAL_SUMMARY.md** - File-by-file technical details
