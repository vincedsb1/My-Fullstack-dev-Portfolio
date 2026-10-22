import { defineConfig } from "@playwright/test";
const port = process.env.PORTFOLIO_E2E_PORT ?? "3006";
export default defineConfig({
  testDir: "tests/browser",
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: `http://localhost:${port}`,
    viewport: { width: 390, height: 844 },
    trace: "retain-on-failure",
  },
  webServer: {
    command: `npm run start -- -p ${port}`,
    url: `http://localhost:${port}/fr`,
    reuseExistingServer: !process.env.CI,
  },
  timeout: 60000,
});
