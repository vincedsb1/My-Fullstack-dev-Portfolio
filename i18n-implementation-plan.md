# Plan d'implémentation i18n - Portfolio Vincent

**Date:** 2025-11-14
**Statut:** Planification
**Langues cibles:** Français (FR) & Anglais (EN)
**Framework:** Next.js 14 (App Router)

---

## TABLE DES MATIÈRES

1. [Résumé de l'audit](#résumé-de-laudit)
2. [Contenu à traduire](#contenu-à-traduire)
3. [État technique actuel](#état-technique-actuel)
4. [Solution recommandée](#solution-recommandée)
5. [Plan d'implémentation par phases](#plan-dimplémentation-par-phases)
6. [Fichiers impactés](#fichiers-impactés)
7. [Estimation d'effort](#estimation-deffort)
8. [Checklist de validation](#checklist-de-validation)

---

## Résumé de l'audit

### État actuel
- ✅ **Architecture:** Next.js 14 App Router (moderne)
- ✅ **Langage:** TypeScript 5 (type-safe)
- ❌ **i18n:** Zéro configuration existante
- ❌ **Contenu:** 100% en anglais, hardcodé dans les JSX
- ❌ **Détection de locale:** Aucune
- ❌ **Stockage de préférence:** Aucun

### Volume de contenu
- **Nombre de chaînes à traduire:** ~150 (estimation: 140-160)
- **Fichiers concernés:** 7 composants + 1 layout
- **Types de contenu:** Titres, descriptions, labels, boutons, dates

### Verdict
✅ **EXCELLENT CANDIDAT** pour i18n
- Petite codebase (facile à migrer)
- Bonne séparation des composants
- Pas de complexité API/backend
- Impact faible sur les dépendances

---

## Contenu à traduire

### Répartition par composant

#### Header (Header.tsx) - ~12 chaînes
```
- "Hi there! I'm"
- "Vincent DESBROSSES"
- "Fullstack developer"
- "From ideation to completion, my skillset covers the full lifecycle of a web project. Let's talk about your next project."
- "Email" (button)
- "Copied!"
- "LinkedIn"
- "GitHub"
- "X"
- "Malt"
- "CV"
- Email address: "vincedsb@gmail.com" (optionnel, pas traduire)
```

#### Footer (Footer.tsx) - ~8 chaînes
```
- "Interested in working together?"
- "I'm deeply passionate about tech and have honed various skills to lead development projects end-to-end. Excited to discuss your upcoming project; reach out to me!"
- "Email" (button)
- "Copied!"
- "LinkedIn" (button)
```

#### Skills (Skills.tsx) - ~35 chaînes
```
Titres:
- "Skills"
- "I've got a few tricks up my sleeve when it comes to skills."

Catégories:
- "Design"
- "Front-end"
- "Back-end"
- "Other"

Technologies (pas de traduction):
- Figma, Storybook, Adobe xD, Zeplin
- NextJS, ReactJS, Tailwind, Javascript, CSS/SCSS, Typescript
- NodeJS, PostgreSQL, MySQL, RESTful API, ExpressJS, Prisma
- Git/GitHub, Vercel, Agile/Scrum, Jira, Product thinking, Jenkins
```

#### Timeline (Timeline.tsx) - ~45 chaînes
```
Titres:
- "Timeline"
- "Take a stroll down my career lane and see where I've been!"

Expériences (7 employeurs):
1. Allaw
   - Position: "Fullstack developper"
   - Période: "Juil. 2024 → now"
   - Description: "Making law accessible to everyone through the platform allaw.fr"

2. Twenty Soft
   - Position: "Fullstack developper"
   - Période: "Sept. 2023 → Juil. 2024"
   - Description: "I offer my freelance services as a fullstack JavaScript developer."

3. Jurisoft
   - Position: "Fullstack developper"
   - Période: "Jul. 2023 → Sep. 2023"
   - Description: "Focused on elevating the front-end experience for legalconstat.fr using a tech stack that included ReactJS, Symfony, and SCSS."

4. Alpha Web
   - Position: "Product owner"
   - Période: "2018 → 2023"
   - Description: "Managed five web/mobile apps using Scrum, focusing on UX/UI design and API architecture"

5. Hair Net system
   - Position: "Customer Support Manager"
   - Période: "2014 → 2018"
   - Description: "Guided a tech team, resolving issues with developers, using HTML5/CSS for data analysis and solution development."

6. Bolloré Ports
   - Position: "System Administrator"
   - Période: "2008 → 2010"
   - Description: "Managed multi-site server environments, working closely with web developers to ensure optimized storage and security features."

7. Town Hall of Thorigny
   - Position: "Fullstack developper"
   - Période: "2007"
   - Description: "Focused on end-to-end web solutions using PHP, MySQL, HTML, CSS, and JavaScript for a municipal website project."
```

#### Projects (Projects.tsx) - ~18 chaînes
```
Titre:
- "Projects"
- "I've navigated a range of projects from start to finish. Take a look at some of my recent work."

Projets (6 au total):
1. Décor Nature
   - Description: "Painting and decorating company website."

2. SmartFlow
   - Description: "Platform offering an effective learning method."

3. Is Tesla worth it?
   - Description: "Compare 2 cars and find out which one has a better value over time."

4. Emmaüs connect
   - Description: "Platform that catalogs and values reclaimed smartphones for resale."

5. Wilder Game
   - Description: "A timed web quiz app challenging users to match film release dates accurately for high scores."

6. QuickFlow
   - Description: "Ideation platform streamlining democratic decision-making."
```

#### Metadata (layout.tsx) - ~2 chaînes
```
- "Vincent's portfolio"
- "Dive into my world of creativity, experience, and digital connections."
```

#### Menu (MenuButton.tsx) - ~3 chaînes (approximé)
```
- "Light"
- "Dark"
- "System"
- (à vérifier)
```

#### Integration Page (integration/page.tsx)
```
- Titre de page (à vérifier)
- Contenu (à vérifier)
```

**TOTAL ESTIMÉ:** 140-160 chaînes à traduire

---

## État technique actuel

### Architecture
```
src/app/
├── components/
│   ├── Header.tsx          (client, hardcodé)
│   ├── Footer.tsx          (client, hardcodé)
│   ├── Skills.tsx          (client, hardcodé)
│   ├── Projects.tsx        (client, hardcodé)
│   ├── Timeline.tsx        (client, hardcodé)
│   └── MenuButton.tsx      (client, hardcodé)
├── layout.tsx              (server, métadonnées hardcodées)
├── page.tsx
├── Providers.tsx           (theme provider avec next-themes)
└── integration/
    └── page.tsx
```

### Dépendances existantes
- **next-themes:** Gestion du thème (dark/light) ✅
- **AOS:** Animations au scroll ✅
- **Lucide React:** Icônes ✅
- **FontAwesome:** Icônes ✅

### Points de détection de locale
1. **URL path:** `/fr/` vs `/en/` (à implémenter)
2. **Headers serveur:** `Accept-Language` (middleware)
3. **localStorage:** Préférence utilisateur stockée
4. **Navigator:** `navigator.language` (fallback client)
5. **Défaut:** Anglais ('en')

---

## Solution recommandée

### Librairie: `next-intl`

**Justification:**
| Critère | next-intl | i18next | react-i18next |
|---------|-----------|---------|---------------|
| **Next.js 14 natif** | ✅ Excellent | ⚠️ Compatible | ⚠️ Compatible |
| **App Router** | ✅ Optimal | ❌ Pages Router | ❌ Pages Router |
| **Type-safe** | ✅ TypeScript natif | ⚠️ Plugin requis | ⚠️ Plugin requis |
| **SSR/SSG** | ✅ Excellent | ✅ Bon | ✅ Bon |
| **Taille bundle** | ✅ ~35KB | ⚠️ ~60KB | ⚠️ ~80KB |
| **Setup complexity** | ✅ Simple | ⚠️ Complexe | ⚠️ Complexe |

**Verdict:** `next-intl` est optimisé pour Next.js 14 App Router.

### Approche: URL-based + Fallback

**Stratégie de détection (par ordre):**
1. **URL path:** `/en/page`, `/fr/page` (source de vérité)
2. **Middleware:** Détecte `Accept-Language` et redirige
3. **localStorage:** Persiste le choix utilisateur
4. **Navigator:** `navigator.language` comme fallback client
5. **Défaut:** 'en' (anglais)

**Exemple de routing:**
```
/en/                    → Anglais (défaut)
/fr/                    → Français
/en/projects            → Projects (EN)
/fr/projects            → Projets (FR)
```

### Fichiers JSON de traduction

**Structure:**
```
src/i18n/
├── en.json
└── fr.json
```

**Format:**
```json
{
  "header": {
    "greeting": "Hi there! I'm",
    "name": "Vincent DESBROSSES",
    "jobTitle": "Fullstack developer",
    "description": "From ideation to completion..."
  },
  "common": {
    "email": "Email",
    "copied": "Copied!",
    "linkedin": "LinkedIn"
  }
}
```

---

## Plan d'implémentation par phases

### 📋 Phase 0: Préparation (30 min - NON TESTABLE)

**Objectif:** Préparer les ressources et dépendances

**Tâches:**
- [ ] Installer `next-intl`
- [ ] Créer la structure de dossiers pour i18n
- [ ] Créer les fichiers JSON vides (en.json, fr.json)

**Commandes:**
```bash
npm install next-intl
mkdir -p src/i18n
```

**Fichiers à créer:**
- `src/i18n/en.json` (vide)
- `src/i18n/fr.json` (vide)
- `middleware.ts` (route interception)
- `i18n.config.ts` (configuration next-intl)

**Durée:** 30 min
**Dépendances:** Aucune
**Testable:** ❌ (fondations)

---

### ✅ Phase 1: Configuration de routing (1h - TESTABLE)

**Objectif:** Mettre en place le routing multilingue avec middleware

**Tâches:**
- [ ] Créer `middleware.ts` pour la détection de locale
- [ ] Configurer `next.config.js` pour next-intl
- [ ] Créer `i18n.config.ts` (configuration)
- [ ] Restructurer les routes avec groupes `(en)` et `(fr)`
- [ ] Tester la redirection automatique

**Fichiers à créer:**
```
middleware.ts
i18n.config.ts
next.config.js (mise à jour)
```

**Fichiers à modifier:**
```
src/app/layout.tsx          (déplacer dans route groups)
src/app/page.tsx            (déplacer)
src/app/integration/        (déplacer)
```

**Nouvelle structure:**
```
src/app/
├── [locale]/                    (route group NOUVEAU)
│   ├── (en)/                   (locale group NOUVEAU)
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── integration/
│   │   │   └── page.tsx
│   │   ├── components/         (partagé)
│   │   └── ...
│   └── (fr)/                   (locale group NOUVEAU)
│       ├── layout.tsx
│       ├── page.tsx
│       ├── integration/
│       │   └── page.tsx
│       └── ...
middleware.ts                    (nouveau)
i18n.config.ts                  (nouveau)
```

**Code exemple:**

`middleware.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Vérifier si locale est déjà dans l'URL
  const pathnameHasLocale = ['/en', '/fr'].some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  // Déterminer la locale préférée
  const locale = getLocaleFromRequest(request);

  // Rediriger vers la locale appropriée
  return NextResponse.redirect(
    new URL(`/${locale}${pathname}`, request.url)
  );
}

function getLocaleFromRequest(request: NextRequest): string {
  // Vérifier localStorage (via cookie)
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && ['en', 'fr'].includes(cookieLocale)) {
    return cookieLocale;
  }

  // Déterminer via Accept-Language
  const acceptLanguage = request.headers.get('accept-language') || '';
  if (acceptLanguage.includes('fr')) return 'fr';

  return 'en'; // Défaut
}

export const config = {
  matcher: ['/((?!_next|api|public|favicon).*)'],
};
```

`i18n.config.ts`:
```typescript
export const locales = ['en', 'fr'] as const;
export const defaultLocale = 'en' as const;

export type Locale = (typeof locales)[number];
```

**Tests:**
```bash
# Test 1: Accès à /projects → redirection vers /en/projects
# Test 2: Accès à /fr/projects → reste /fr/projects
# Test 3: Vérifier Accept-Language header français → /fr/
# Test 4: Cookie NEXT_LOCALE=fr → /fr/
```

**Durée:** 1h
**Dépendances:** Phase 0
**Testable:** ✅ (navigation et redirection)

---

### 📝 Phase 2: Extraction et traduction des contenus (2h30 - NON TESTABLE)

**Objectif:** Extraire tous les textes hardcodés en anglais et créer les fichiers de traduction

**Tâches:**
- [ ] Scanner tous les composants et extraire les chaînes anglaises
- [ ] Créer l'inventaire complet
- [ ] Traduire en français (FR)
- [ ] Remplir `src/i18n/en.json`
- [ ] Remplir `src/i18n/fr.json`
- [ ] Valider la complétude des traductions

**Extraction - Inventaire à créer:**
```json
{
  "header": {},
  "footer": {},
  "skills": {},
  "projects": {},
  "timeline": {},
  "menu": {},
  "metadata": {},
  "common": {}
}
```

**Structure des fichiers JSON:**

`src/i18n/en.json`:
```json
{
  "common": {
    "email": "Email",
    "copied": "Copied!",
    "linkedin": "LinkedIn",
    "github": "GitHub",
    "twitter": "X",
    "malt": "Malt",
    "cv": "CV"
  },
  "header": {
    "greeting": "Hi there! I'm",
    "name": "Vincent DESBROSSES",
    "jobTitle": "Fullstack developer",
    "description": "From ideation to completion, my skillset covers the full lifecycle of a web project. Let's talk about your next project."
  },
  "footer": {
    "title": "Interested in working together?",
    "description": "I'm deeply passionate about tech and have honed various skills to lead development projects end-to-end. Excited to discuss your upcoming project; reach out to me!"
  },
  "skills": {
    "title": "Skills",
    "intro": "I've got a few tricks up my sleeve when it comes to skills.",
    "design": "Design",
    "frontend": "Front-end",
    "backend": "Back-end",
    "other": "Other"
  },
  "projects": {
    "title": "Projects",
    "intro": "I've navigated a range of projects from start to finish. Take a look at some of my recent work.",
    "project1": {
      "name": "Is Tesla worth it?",
      "description": "Compare 2 cars and find out which one has a better value over time."
    },
    "project2": {
      "name": "Emmaüs connect",
      "description": "Platform that catalogs and values reclaimed smartphones for resale."
    },
    "project3": {
      "name": "Wilder Game",
      "description": "A timed web quiz app challenging users to match film release dates accurately for high scores."
    },
    "project4": {
      "name": "QuickFlow",
      "description": "Ideation platform streamlining democratic decision-making."
    },
    "project5": {
      "name": "Décor Nature",
      "description": "Painting and decorating company website."
    },
    "project6": {
      "name": "SmartFlow",
      "description": "Platform offering an effective learning method."
    }
  },
  "timeline": {
    "title": "Timeline",
    "intro": "Take a stroll down my career lane and see where I've been!",
    "experiences": [
      {
        "company": "Allaw",
        "position": "Fullstack developper",
        "period": "Juil. 2024 → now",
        "description": "Making law accessible to everyone through the platform allaw.fr"
      },
      {
        "company": "Twenty Soft",
        "position": "Fullstack developper",
        "period": "Sept. 2023 → Juil. 2024",
        "description": "I offer my freelance services as a fullstack JavaScript developer."
      },
      {
        "company": "Jurisoft",
        "position": "Fullstack developper",
        "period": "Jul. 2023 → Sep. 2023",
        "description": "Focused on elevating the front-end experience for legalconstat.fr using a tech stack that included ReactJS, Symfony, and SCSS."
      },
      {
        "company": "Alpha Web",
        "position": "Product owner",
        "period": "2018 → 2023",
        "description": "Managed five web/mobile apps using Scrum, focusing on UX/UI design and API architecture"
      },
      {
        "company": "Hair Net system",
        "position": "Customer Support Manager",
        "period": "2014 → 2018",
        "description": "Guided a tech team, resolving issues with developers, using HTML5/CSS for data analysis and solution development."
      },
      {
        "company": "Bolloré Ports",
        "position": "System Administrator",
        "period": "2008 → 2010",
        "description": "Managed multi-site server environments, working closely with web developers to ensure optimized storage and security features."
      },
      {
        "company": "Town Hall of Thorigny",
        "position": "Fullstack developper",
        "period": "2007",
        "description": "Focused on end-to-end web solutions using PHP, MySQL, HTML, CSS, and JavaScript for a municipal website project."
      }
    ]
  },
  "metadata": {
    "title": "Vincent's portfolio",
    "description": "Dive into my world of creativity, experience, and digital connections."
  }
}
```

`src/i18n/fr.json`: (Traduction française complète)
```json
{
  "common": {
    "email": "Email",
    "copied": "Copié !",
    "linkedin": "LinkedIn",
    "github": "GitHub",
    "twitter": "X",
    "malt": "Malt",
    "cv": "CV"
  },
  "header": {
    "greeting": "Salut ! Je suis",
    "name": "Vincent DESBROSSES",
    "jobTitle": "Développeur Fullstack",
    "description": "De l'idée à la réalisation, mes compétences couvrent l'ensemble du cycle de vie d'un projet web. Parlons de votre prochain projet."
  },
  "footer": {
    "title": "Envie de travailler ensemble ?",
    "description": "Je suis passionné par la technologie et j'ai développé diverses compétences pour diriger des projets de développement de bout en bout. Enthousiaste à l'idée de discuter de votre prochain projet, contactez-moi !"
  },
  "skills": {
    "title": "Compétences",
    "intro": "J'ai plus d'un tour dans mon sac quand il s'agit de compétences.",
    "design": "Design",
    "frontend": "Front-end",
    "backend": "Back-end",
    "other": "Autres"
  },
  "projects": {
    "title": "Projets",
    "intro": "J'ai navigué une gamme de projets du début à la fin. Jetez un coup d'œil à certains de mes travaux récents.",
    "project1": {
      "name": "Is Tesla worth it?",
      "description": "Comparez 2 voitures et découvrez laquelle offre une meilleure valeur au fil du temps."
    },
    "project2": {
      "name": "Emmaüs connect",
      "description": "Plateforme qui catalogue et valorise les smartphones recondationnés à la revente."
    },
    "project3": {
      "name": "Wilder Game",
      "description": "Une application web de quiz chronométré mettant les utilisateurs au défi de faire correspondre les dates de sortie des films avec précision pour des scores élevés."
    },
    "project4": {
      "name": "QuickFlow",
      "description": "Plateforme d'idéation rationalisant la prise de décision démocratique."
    },
    "project5": {
      "name": "Décor Nature",
      "description": "Site web d'une entreprise de peinture et de décoration."
    },
    "project6": {
      "name": "SmartFlow",
      "description": "Plateforme offrant une méthode d'apprentissage efficace."
    }
  },
  "timeline": {
    "title": "Parcours",
    "intro": "Faites un tour dans mon parcours professionnel et découvrez mes expériences !",
    "experiences": [
      {
        "company": "Allaw",
        "position": "Développeur Fullstack",
        "period": "Juil. 2024 → aujourd'hui",
        "description": "Rendre le droit accessible à tous via la plateforme allaw.fr"
      },
      {
        "company": "Twenty Soft",
        "position": "Développeur Fullstack",
        "period": "Sept. 2023 → Juil. 2024",
        "description": "J'offre mes services en tant que développeur JavaScript fullstack en freelance."
      },
      {
        "company": "Jurisoft",
        "position": "Développeur Fullstack",
        "period": "Juil. 2023 → Sept. 2023",
        "description": "Concentré sur l'amélioration de l'expérience front-end pour legalconstat.fr en utilisant une pile technologique incluant ReactJS, Symfony et SCSS."
      },
      {
        "company": "Alpha Web",
        "position": "Product Owner",
        "period": "2018 → 2023",
        "description": "Gestion de cinq applications web/mobile avec la méthodologie Scrum, en mettant l'accent sur la conception UX/UI et l'architecture API"
      },
      {
        "company": "Hair Net system",
        "position": "Responsable Support Client",
        "period": "2014 → 2018",
        "description": "Responsable d'une équipe technique, résolution de problèmes avec les développeurs, utilisation de HTML5/CSS pour l'analyse de données et le développement de solutions."
      },
      {
        "company": "Bolloré Ports",
        "position": "Administrateur Système",
        "period": "2008 → 2010",
        "description": "Gestion d'environnements serveurs multi-sites, travail étroit avec les développeurs web pour assurer l'optimisation du stockage et la sécurité."
      },
      {
        "company": "Mairie de Thorigny",
        "position": "Développeur Fullstack",
        "period": "2007",
        "description": "Concentration sur les solutions web de bout en bout utilisant PHP, MySQL, HTML, CSS et JavaScript pour un projet de site web municipal."
      }
    ]
  },
  "metadata": {
    "title": "Portfolio de Vincent",
    "description": "Plongez dans mon monde de créativité, d'expérience et de connexions numériques."
  }
}
```

**Durée:** 2h30
**Dépendances:** Phase 0
**Testable:** ❌ (données à utiliser en Phase 3)

---

### 🔌 Phase 3: Intégration next-intl dans les composants (2h - TESTABLE)

**Objectif:** Remplacer tous les textes hardcodés par des appels au hook `useTranslations()`

**Tâches par composant:**
- [ ] **Header.tsx** → Ajouter hook useTranslations
- [ ] **Footer.tsx** → Intégrer traductions
- [ ] **Skills.tsx** → Traduire titres et catégories
- [ ] **Projects.tsx** → Boucler sur objet de projets traduits
- [ ] **Timeline.tsx** → Boucler sur tableau d'expériences traduites
- [ ] **layout.tsx** → Métadonnées dynamiques par locale
- [ ] Tester rendu des 2 langues

**Code exemple (Header.tsx):**

AVANT:
```typescript
<div id="headerHi">Hi there! I'm</div>
```

APRÈS:
```typescript
'use client';
import { useTranslations } from 'next-intl';

function Header() {
  const t = useTranslations('header');

  return (
    <div id="headerHi">{t('greeting')}</div>
  );
}
```

**Pseudo-code pour tous les composants:**
```typescript
import { useTranslations } from 'next-intl';

function Component() {
  const t = useTranslations('componentName');

  // Remplacer tous les textes par t('clé')
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
}
```

**Modifications layout.tsx:**

AVANT:
```typescript
export const metadata: Metadata = {
  title: "Vincent's portfolio",
  description: "Dive into my world of creativity, experience, and digital connections.",
};
```

APRÈS:
```typescript
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(
  { params }: { params: { locale: string } }
): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'metadata' });

  return {
    title: t('title'),
    description: t('description'),
  };
}
```

**Tests:**
```bash
# Test 1: Accès /en/ → Vérifier tous les textes en anglais
# Test 2: Accès /fr/ → Vérifier tous les textes en français
# Test 3: Changer de langue → Vérifier mise à jour correcte
# Test 4: Métadonnées → Vérifier title/description par locale
# Test 5: Responsive → Vérifier sur mobile
```

**Checklist d'intégration:**
- [ ] Header: 5/5 chaînes
- [ ] Footer: 3/3 chaînes
- [ ] Skills: 7/7 chaînes
- [ ] Projects: 8/8 chaînes
- [ ] Timeline: 7 expériences (x7)
- [ ] Metadata: 2/2 chaînes
- [ ] Aucun texte en dur restant

**Durée:** 2h
**Dépendances:** Phase 1, Phase 2
**Testable:** ✅ (rendu complète les 2 langues)

---

### 🎨 Phase 4: Sélecteur de langue dans le menu (1h - TESTABLE)

**Objectif:** Ajouter un switcher de langue dans le menu `MenuButton.tsx`

**Tâches:**
- [ ] Créer composant `LanguageSwitcher.tsx`
- [ ] Intégrer dans `MenuButton.tsx`
- [ ] Permettre changement rapide EN ↔ FR
- [ ] Persister la préférence en cookie
- [ ] Animer la transition de langue

**Code exemple (LanguageSwitcher.tsx):**

```typescript
'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useEffect } from 'react';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const toggleLanguage = (newLocale: 'en' | 'fr') => {
    if (newLocale === locale) return;

    // Remplacer la locale dans le chemin
    const newPathname = pathname.replace(`/${locale}/`, `/${newLocale}/`);

    // Persister le choix en cookie
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;

    // Naviguer vers la nouvelle URL
    router.push(newPathname);
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => toggleLanguage('en')}
        className={locale === 'en' ? 'font-bold' : 'opacity-50'}
      >
        EN
      </button>
      <span>/</span>
      <button
        onClick={() => toggleLanguage('fr')}
        className={locale === 'fr' ? 'font-bold' : 'opacity-50'}
      >
        FR
      </button>
    </div>
  );
}
```

**Intégration dans MenuButton.tsx:**
```typescript
import LanguageSwitcher from './LanguageSwitcher';
import ThemeSwitcher from './ThemeSwitcher';

export default function MenuButton() {
  return (
    <div className="menu">
      <LanguageSwitcher />
      <ThemeSwitcher />
    </div>
  );
}
```

**Tests:**
```bash
# Test 1: Cliquer EN → URL change /fr/ → /en/
# Test 2: Cliquer FR → URL change /en/ → /fr/
# Test 3: Refresh page → Langue persist
# Test 4: Texte change immédiatement
# Test 5: SEO URLs correctes
```

**Durée:** 1h
**Dépendances:** Phase 3
**Testable:** ✅ (navigation et persistance)

---

### 🧪 Phase 5: Tests et optimisations (1h - TESTABLE)

**Objectif:** Valider l'implémentation complète et optimiser

**Tâches:**
- [ ] Test complet E2E (toutes les pages en EN et FR)
- [ ] Vérifier non-traductions (noms d'entreprises, technologies)
- [ ] Tester SSR/SSG (builds correctes)
- [ ] Vérifier SEO (URLs, meta tags)
- [ ] Performance (pas de dégradation)
- [ ] Accessibilité (lang attr, aria-labels)
- [ ] Mobile responsiveness
- [ ] Cas limites (localStorage vide, cookies bloqués)

**Checklist E2E:**
- [ ] Page d'accueil EN → tout en anglais
- [ ] Page d'accueil FR → tout en français
- [ ] Projects EN → descriptions anglaises
- [ ] Projects FR → descriptions françaises
- [ ] Timeline EN → postes et périodes anglaises
- [ ] Timeline FR → postes et périodes françaises
- [ ] Menu: Switcher EN/FR fonctionne
- [ ] Métadonnées: title/description changent
- [ ] CSS: Pas de ruptures visuelles
- [ ] Animations AOS: Fonctionnent dans les 2 langues

**Tests de fallback:**
```bash
# Test: Navigateur sans Accept-Language → défaut EN
# Test: localStorage = fr → accès /en → /fr/
# Test: Cookie NEXT_LOCALE=en → accès /fr → /en/
# Test: Accès direct /fr/projects → FR
# Test: Accès direct /en/ → EN
```

**Optimisations possibles:**
- Ajouter classe `lang="en"` ou `lang="fr"` au HTML
- Ajouter `hreflang` pour SEO multilingue
- Pré-charger les ressources de la locale suivante
- Cache les traductions en localStorage

**Build test:**
```bash
npm run build
npm start
# Vérifier qu'aucune erreur n'apparaît
# Tester les 2 locales sur la prod build
```

**Durée:** 1h
**Dépendances:** Phase 4
**Testable:** ✅ (validation complète)

---

### 🎯 Phase 6: Nettoyage et documentation (30 min - NON TESTABLE)

**Objectif:** Finaliser et documenter

**Tâches:**
- [ ] Supprimer anciens fichiers JSX non utilisés
- [ ] Documenter dans CLAUDE.md (mise à jour)
- [ ] Documenter process pour ajouter nouvelles langues
- [ ] Commit initial i18n
- [ ] Mettre à jour README

**Fichiers à nettoyer:**
- Aucun, structure claire

**Documentation à ajouter à CLAUDE.md:**
```markdown
## Internationalisation (i18n)

- **Librairie:** next-intl
- **Locales:** EN, FR
- **Routing:** URL-based (/en/, /fr/)
- **Traductions:** src/i18n/{en,fr}.json
- **Hook:** `useTranslations()` dans composants clients

### Ajouter une nouvelle langue:
1. Créer src/i18n/xx.json
2. Ajouter locale à locales[] dans i18n.config.ts
3. Créer route group (xx)/ dans src/app/
4. Ajouter option au LanguageSwitcher
```

**Durée:** 30 min
**Dépendances:** Phase 5
**Testable:** ❌ (documentation)

---

## Fichiers impactés

### ✨ Fichiers à CRÉER (8 fichiers)

| Fichier | Type | Description |
|---------|------|-------------|
| `middleware.ts` | Config | Détection/redirection locale |
| `i18n.config.ts` | Config | Config next-intl |
| `src/i18n/en.json` | Data | Traductions anglaises |
| `src/i18n/fr.json` | Data | Traductions françaises |
| `src/app/[locale]/layout.tsx` | Layout | Root layout (nouveau groupe) |
| `src/app/[locale]/page.tsx` | Page | Home (nouveau groupe) |
| `src/app/[locale]/integration/page.tsx` | Page | Integration (nouveau groupe) |
| `src/app/components/LanguageSwitcher.tsx` | Component | Sélecteur langue |

### 📝 Fichiers à MODIFIER (6 fichiers)

| Fichier | Modifications |
|---------|---------------|
| `next.config.js` | Ajouter plugin next-intl |
| `package.json` | Ajouter dépendance next-intl |
| `src/app/components/Header.tsx` | Remplacer textes par t() |
| `src/app/components/Footer.tsx` | Remplacer textes par t() |
| `src/app/components/Skills.tsx` | Remplacer textes par t() |
| `src/app/components/Projects.tsx` | Remplacer textes par t() |
| `src/app/components/Timeline.tsx` | Remplacer textes par t() |
| `src/app/components/MenuButton.tsx` | Intégrer LanguageSwitcher |
| `CLAUDE.md` | Documenter i18n |

### ℹ️ Fichiers NON impactés

- Components partagés (AOS, Lucide, FontAwesome) ✅
- Styling (Tailwind) ✅
- Theme management (next-themes) ✅
- Configuration existante (tsconfig, prettier) ✅

---

## Estimation d'effort

### Timeline totale: **8-10 heures**

| Phase | Description | Durée | Testable |
|-------|-------------|-------|----------|
| **0** | Préparation | 30 min | ❌ |
| **1** | Configuration routing | 1h | ✅ |
| **2** | Traductions | 2h30 | ❌ |
| **3** | Intégration composants | 2h | ✅ |
| **4** | Sélecteur langue | 1h | ✅ |
| **5** | Tests E2E | 1h | ✅ |
| **6** | Documentation | 30 min | ❌ |
| | **TOTAL** | **~8h30** | |

### Par personne
- **Développeur:** 6-8h (Phase 1, 3, 4, 5)
- **Traducteur/QA:** 2-3h (Phase 2, 5)

### Dépendances entre phases
```
Phase 0 (Prep)
    ↓
Phase 1 (Routing) ←→ Phase 2 (Traductions)
    ↓
Phase 3 (Composants) ← Phase 2
    ↓
Phase 4 (Menu)
    ↓
Phase 5 (Tests)
    ↓
Phase 6 (Doc)
```

### Facteurs de risque
- ⚠️ Oublier une chaîne → Inclure une seconde passe d'extraction
- ⚠️ Typos en français → Relire avant commit
- ⚠️ URL inconsistentes → Tester toutes les routes
- ⚠️ Métadonnées mal générées → Tester SEO

---

## Checklist de validation

### ✅ Phase 1 - Routing
- [ ] Middleware détecte Accept-Language
- [ ] Accès `/projects` → redirige `/en/projects`
- [ ] Accès `/fr/projects` → reste `/fr/projects`
- [ ] Cookie NEXT_LOCALE=fr → redirige `/fr/`
- [ ] Aucune 404 sur les routes groupées

### ✅ Phase 3 - Composants
- [ ] Aucun texte en anglais dur dans les JSX
- [ ] Hook `useTranslations()` importé dans tous les composants
- [ ] Tous les t() appellent une clé valide en en.json et fr.json
- [ ] Les données itérables (Timeline, Projects) sont correctement loopées
- [ ] Les alt-text des images restent constants

### ✅ Phase 4 - Sélecteur
- [ ] Bouton EN visible dans le menu
- [ ] Bouton FR visible dans le menu
- [ ] Cliquer EN → URL change, textes changent
- [ ] Cliquer FR → URL change, textes changent
- [ ] Après refresh → langue persist
- [ ] Style du bouton actif clair

### ✅ Phase 5 - Tests complets
- [ ] Page home EN affiche anglais
- [ ] Page home FR affiche français
- [ ] Toutes les sections présentes dans les 2 langues
- [ ] Aucune console error
- [ ] Aucune console warning d'i18n
- [ ] Build production réussi
- [ ] Pas de dégradation performance

### ✅ Déploiement
- [ ] Code mergé sur main
- [ ] Vercel rebuild réussi
- [ ] Test live EN et FR
- [ ] Google Search Console: hreflang correctes (optionnel)

---

## Notes supplémentaires

### SEO & Internationalisation
```html
<!-- Dans layout.tsx, ajouter: -->
<link rel="alternate" hrefLang="en" href="https://example.com/en/" />
<link rel="alternate" hrefLang="fr" href="https://example.com/fr/" />
<link rel="alternate" hrefLang="x-default" href="https://example.com/en/" />
```

### Performance
- Bundle size: +35KB (next-intl)
- LCP: Pas de dégradation (pas d'appels API)
- TTI: Pas d'impact (traductions en JSON)

### Évolutivité
Pour ajouter une nouvelle langue (ex: ES):
1. Créer `src/i18n/es.json`
2. Ajouter `'es'` à `locales` dans `i18n.config.ts`
3. Créer dossier `src/app/[locale]/(es)/`
4. Ajouter option "ES" dans `LanguageSwitcher`

---

## Prochaines étapes après implémentation

1. **Phase 7 (Optionnel):** Ajouter 3ème langue (ES, DE, etc.)
2. **Phase 8 (Optionnel):** Intégrer i18n avec CMS pour traductions dynamiques
3. **Phase 9 (Optionnel):** Analytics par langue pour voir utilisation
4. **Phase 10 (Optionnel):** Traduire contenu des projets (descriptions projets pourraient avoir plusieurs versions)

---

## Contacts/Ressources

- **Documentation next-intl:** https://next-intl-docs.vercel.app/
- **Next.js App Router:** https://nextjs.org/docs/app
- **Tailwind multi-lang:** Pas d'impact (CSS, pas de textes)
