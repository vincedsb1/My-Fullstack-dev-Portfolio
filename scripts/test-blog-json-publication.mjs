import {
  copyFileSync,
  existsSync,
  mkdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import path from "node:path";

// Pilote exclusivement local : aucun changement de statut de la fixture ni
// conversion d’un article. Les sources créées ici sont toujours retirées.
const created = [];
const abort = new AbortController();
process.once("SIGINT", () => abort.abort());
process.once("SIGTERM", () => abort.abort());
function create(file, content) {
  if (existsSync(file)) throw new Error(`Le pilote refuse d’écraser ${file}`);
  writeFileSync(file, content, { flag: "wx" });
  created.push(file);
}
function directory(dir) {
  if (existsSync(dir)) throw new Error(`Le pilote refuse de réutiliser ${dir}`);
  mkdirSync(dir, { recursive: true });
  created.push(dir);
}
function run(command, args, env = {}, signal = abort.signal) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      env: { ...process.env, ...env },
      signal: signal ?? undefined,
    });
    child.on("error", reject);
    child.on("exit", (code) =>
      code === 0
        ? resolve()
        : reject(new Error(`${command} ${args.join(" ")}: exit ${code}`)),
    );
  });
}
async function freePort() {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const port = server.address().port;
  await new Promise((resolve) => server.close(resolve));
  return String(port);
}

let failure;
try {
  for (const locale of ["fr", "en"]) {
    if (!existsSync(`src/content/blog-json/${locale}`))
      directory(`src/content/blog-json/${locale}`);
    const slug = `audit-json-${locale}`;
    const media = `public/blog/${slug}`;
    directory(media);
    copyFileSync(
      "public/blog/json-demo-blog/structure.svg",
      `${media}/structure.svg`,
    );
    const article = {
      schemaVersion: 1,
      meta: {
        locale,
        slug,
        status: "published",
        translationKey: "audit-json-publication",
        title:
          locale === "fr"
            ? "Fixture technique de publication JSON"
            : "JSON publication test fixture",
        description:
          locale === "fr"
            ? "Document synthétique utilisé uniquement pour vérifier le pipeline local."
            : "Synthetic data used only to exercise the local publication pipeline.",
        excerpt:
          locale === "fr" ? "Test technique local." : "Local technical test.",
        category: "Test",
        publishedAt: "2026-10-22",
        updatedAt: "2026-10-23",
        cover: `/blog/${slug}/structure.svg`,
        coverAlt: "JSON → React",
        ...(locale === "fr" ? { relatedProjects: ["iconise"] } : {}),
      },
      hero: {
        visual: {
          component: "metric-panel",
          props: { value: "01", label: "JSON" },
        },
      },
      sections: [
        {
          id: "publication",
          title: locale === "fr" ? "Publication locale" : "Local publication",
          blocks: [
            { type: "paragraph", content: [{ text: "JSON → React" }] },
            { type: "heading", level: 3, text: "H3", id: "detail" },
            { type: "heading", level: 4, text: "H4" },
            {
              type: "checklist",
              storageKey: `vd_audit_json_${locale}`,
              items: [{ id: "action", label: "Action" }],
            },
            { type: "code", language: "json", code: '{"schemaVersion": 1}' },
          ],
        },
      ],
      related: {
        slugs: locale === "fr" ? ["internationaliser-saas-lancement"] : [],
      },
    };
    create(
      `src/content/blog-json/${locale}/${slug}.json`,
      JSON.stringify(article, null, 2),
    );
  }
  const route = "src/app/(localized)/[locale]/blog/json-contract-audit";
  directory(route);
  create(
    path.join(route, "page.tsx"),
    `
import { readFileSync } from "node:fs";
import JsonChecklist from "@/features/blog/json/JsonChecklist";
export const dynamic = "force-static";
export function generateStaticParams() { return [{locale: "fr"}]; }
export const metadata = {robots: {index: false, follow: false}};
export default function ContractHarness() {
  const contract = JSON.parse(readFileSync("docs/blog/contracts/guide-checklist-v1.json", "utf8"));
  return <main id="main" className="blog-ds"><h1>Test technique checklist</h1><JsonChecklist storageKey={contract.storageKey} items={contract.items} /></main>;
}`,
  );
  await run("npm", ["run", "build"]);
  await run("npm", ["run", "blog:test:seo"]);
  await run(
    "npx",
    [
      "playwright",
      "test",
      "--config",
      "scripts/blog-publication-tests/playwright.config.ts",
    ],
    { BLOG_PUBLICATION_PORT: await freePort() },
  );
} catch (error) {
  failure = error;
} finally {
  for (const file of created.reverse())
    rmSync(file, { recursive: true, force: true });
  console.info(
    "[blog:publication] Sources temporaires retirées ; restauration du build normal.",
  );
  // Ne pas laisser un build incluant les fixtures prêtes à être déployées.
  await run("npm", ["run", "build"], {}, null);
}
if (failure) throw failure;
console.info(
  "[blog:publication] Pilote FR/EN et interopérabilité du guide validés ; aucun article ajouté.",
);
