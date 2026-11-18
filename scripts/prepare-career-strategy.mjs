import { readFileSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import {
  validateBundle,
  ENGINE_VERSION,
} from "../src/features/career-strategy/schema.mjs";
const root = path.resolve("src/content/career-strategy");
const read = (name) =>
  JSON.parse(readFileSync(path.join(root, name + ".json"), "utf8"));
const questionnaire = read("questionnaire"),
  catalog = read("strategies");
const common = {
  schemaVersion: 1,
  questionnaireVersion: questionnaire.version,
  catalogVersion: catalog.version,
  engineVersion: ENGINE_VERSION,
  questionnaire,
  catalog,
};
const localized = {
  fr: { ...common, content: read("fr") },
  en: { ...common, content: read("en") },
};
function shape(value) {
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((k) => [k, shape(value[k])]),
    );
  return typeof value;
}
if (
  JSON.stringify(shape(localized.fr.content)) !==
  JSON.stringify(shape(localized.en.content))
)
  throw new Error("Career strategy: translation keys differ");
const contentVersion = createHash("sha256")
  .update(JSON.stringify(localized))
  .digest("hex")
  .slice(0, 20);
const dir = path.resolve("public/career-strategy", contentVersion);
mkdirSync(dir, { recursive: true });
function writeChanged(file, data) {
  if (!existsSync(file) || readFileSync(file, "utf8") !== data)
    writeFileSync(file, data);
}
const urls = {};
for (const locale of ["fr", "en"]) {
  const bundle = { ...localized[locale], contentVersion };
  validateBundle(bundle);
  if (bundle.content.locale !== locale)
    throw new Error("Career strategy: locale mismatch");
  writeChanged(path.join(dir, locale + ".json"), JSON.stringify(bundle) + "\n");
  urls[locale] = `/career-strategy/${contentVersion}/${locale}.json`;
}
writeChanged(
  path.join(root, "bundle-manifest.json"),
  JSON.stringify({ contentVersion, urls }, null, 2) + "\n",
);
console.info(
  `[career-strategy] Validated FR/EN resources: ${contentVersion}, 40/80 questions, ${catalog.strategies.length} strategies.`,
);
