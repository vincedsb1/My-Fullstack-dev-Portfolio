import sharp from "sharp";
import {
  readdir,
  readFile,
  writeFile,
  mkdir,
  copyFile,
  unlink,
} from "node:fs/promises";
import path from "node:path";
const root = process.cwd();
const sourceDir = path.join(root, "assets-src");
await mkdir(sourceDir, { recursive: true });
const mapping = {};
for (const name of await readdir("public")) {
  if (!/\.(png|jpe?g)$/i.test(name) || name === "pp.jpg") continue;
  const input = path.join("public", name);
  const outputName = name.replace(/\.[^.]+$/, ".webp");
  await copyFile(input, path.join(sourceDir, name));
  const pipeline = sharp(input)
    .rotate()
    .resize({ width: 2400, withoutEnlargement: true });
  await pipeline
    .clone()
    .webp({ quality: 80 })
    .toFile(path.join("public", outputName));
  await pipeline
    .clone()
    .avif({ quality: 55 })
    .toFile(path.join(sourceDir, name.replace(/\.[^.]+$/, ".avif")));
  mapping["/" + name] = "/" + outputName;
  await unlink(input);
}
async function walk(dir) {
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, item.name);
    if (item.isDirectory()) await walk(file);
    else if (/\.(tsx?|json|mdx|mjs)$/.test(file)) {
      let content = await readFile(file, "utf8");
      for (const [old, next] of Object.entries(mapping))
        content = content.replaceAll(old, next);
      await writeFile(file, content);
    }
  }
}
await walk("src");
await walk("docs/projects");
const names = (await readdir("public")).filter((n) => /\.webp$/.test(n));
await writeFile(
  "src/lib/project-images.ts",
  names.map((n, i) => `import image${i} from '../../public/${n}';`).join("\n") +
    '\nimport type {StaticImageData} from "next/image";\nexport const projectImages:Record<string,StaticImageData>={' +
    names.map((n, i) => `${JSON.stringify("/" + n)}:image${i}`).join(",") +
    "};\n",
);
console.info(
  `Prepared ${
    Object.keys(mapping).length
  } images; originals and AVIF variants retained in assets-src.`,
);
