/**
 * Transition MDX -> JSON : adapte le test SEO de main (commit 1b217e7).
 * Usage après extraction du ZIP : node scripts/patch-blog-json-seo-tests.mjs
 * Ne modifie rien si le script a déjà été migré. Arrêt explicite si structure inconnue.
 */
import {readFileSync,writeFileSync} from 'node:fs';
import path from 'node:path';
const file=path.join(process.cwd(),'scripts/test-blog-seo.mjs');
let content=readFileSync(file,'utf8');
const changes=[
  {
    before:'import { readAllBlogArticles } from "../src/lib/blog/article-source.mjs";',
    after:'import { readAllBlogArticles } from "../src/lib/blog/article-source.mjs";\nimport { readAllJsonBlogArticles, validateMergedBlogArticles } from "../src/lib/blog/json-source.mjs";',
    marker:'validateMergedBlogArticles } from "../src/lib/blog/json-source.mjs"',
  },
  {
    before:'const articles = readAllBlogArticles();',
    after:'const articles = validateMergedBlogArticles([...readAllBlogArticles(), ...readAllJsonBlogArticles()]);',
    marker:'const articles = validateMergedBlogArticles(',
  },
  {
    before:'    } else {\n      const firstHeading = article.body.match(/^##\\s+(.+)$/m)?.[1]?.trim();',
    after:'    } else if (article.format === "json") {\n      const firstHeading = article.data.sections[0]?.title;\n      check(Boolean(firstHeading) && html.includes(firstHeading),\n        "premier titre et contenu JSON présents dans le HTML initial " + route);\n    } else {\n      const firstHeading = article.body.match(/^##\\s+(.+)$/m)?.[1]?.trim();',
    marker:'premier titre et contenu JSON présents dans le HTML initial',
  },
];
let replacements=0;
for (const {before,after,marker} of changes){
  if(content.includes(marker)) continue;
  if(!content.includes(before))throw new Error(`[seo patch] Fichier source différent du commit attendu, séquence absente : ${before.slice(0,90)}`);
  content=content.replace(before,after);
  replacements++;
}
if(replacements)writeFileSync(file,content);
console.info(`[seo patch] ${replacements} adaptation(s) appliquée(s), script désormais MDX + JSON.`);
