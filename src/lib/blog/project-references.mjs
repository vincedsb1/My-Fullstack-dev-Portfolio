import { readFileSync } from "node:fs";
import path from "node:path";

/** Même contrôle de publication pour les références issues du MDX et du JSON. */
export function validateBlogProjectReferences(slugs, locale, fail) {
  for (const slug of slugs) {
    try {
      const target = path.join(
        process.cwd(),
        "src/content/projects/manifests",
        locale,
        slug + ".json",
      );
      if (JSON.parse(readFileSync(target, "utf8")).status === "published")
        continue;
    } catch {
      // Le message commun couvre les manifestes absents ou invalides.
    }
    fail(`le projet lié ${slug} n'est pas publié dans cette langue.`);
  }
}
