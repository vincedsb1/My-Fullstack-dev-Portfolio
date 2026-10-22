import { defineConfig } from "@playwright/test";
const preview = process.env.BLOG_PREVIEW === "1";
const port = process.env.BLOG_PUBLICATION_PORT ?? (preview ? "3108" : "3107");
export default defineConfig({
  testDir: ".",
  testMatch: preview
    ? ["preview.spec.ts", "guide-readiness.spec.ts"]
    : "publication.spec.ts",
  workers: 1,
  use: {
    baseURL: `http://localhost:${port}`,
    reducedMotion: "reduce",
    trace: "retain-on-failure",
  },
  webServer: {
    cwd: process.cwd(),
    command: preview
      ? `node node_modules/next/dist/bin/next dev -p ${port}`
      : `npm run start -- -p ${port}`,
    url: `http://localhost:${port}/fr/blog/${
      preview ? "json-preview" : "audit-json-fr"
    }`,
    reuseExistingServer: false,
  },
});
