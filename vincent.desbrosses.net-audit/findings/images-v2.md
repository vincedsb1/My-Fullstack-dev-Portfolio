# Images — re-audit 2026-09-09

## Points forts (vérifiés en production)

- **12 images, 0 sans `alt`, 0 `alt` vide.** Les textes sont descriptifs et spécifiques
  (« Screenshot of the AiSystem macOS application »), pas des mots-clés empilés.
- **Format négocié : AVIF servi**, 14,2 Ko pour une vignette projet, en
  `cache-control: public, max-age=31536000, immutable`.
- **`loading="lazy"` sur les 11 images sous la ligne de flottaison**, absent sur le
  portrait du hero (correct : c'est l'élément LCP candidat, il porte `priority`).
- `sizes` renseigné sur toutes les images responsives.
- CLS mesuré à 0 lors de l'audit précédent.

## Medium — dimensions `og:image` déclarées fausses

Vérifié en lisant l'en-tête JPEG du fichier réellement servi :

| | Valeur |
|---|---|
| Fichier réel `pp.jpg` | **1084 × 1084 px**, 261 Ko |
| Déclaré dans `[locale]/layout.tsx` | `og:image:width` **819**, `og:image:height` **823** |

Les deux valeurs sont codées en dur et ne correspondent plus au fichier. Certains
agrégateurs utilisent ces dimensions pour pré-allouer la vignette : un écart provoque un
recadrage ou un rendu incorrect.

Deux corrections possibles, la seconde étant préférable :
1. Corriger les nombres en `1084 × 1084`.
2. Produire une carte sociale dédiée **1200 × 630** — le format attendu par
   `summary_large_image`. Une image carrée est recadrée sur LinkedIn et X quel que
   soit le ratio déclaré.

## Low — poids des sources dans le dépôt

`public/` contient environ 25 Mo d'images sources non compressées (la plus lourde à
3,8 Mo). Sans effet sur la livraison — `next/image` sert de l'AVIF optimisé — mais cela
pèse sur le dépôt et la durée de build.
