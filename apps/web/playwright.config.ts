import { defineConfig, devices } from "@playwright/test"
import { defineConfig as defineBrowserslistConfig } from "@playwright/test"

/**
 * Playwright E2E Testing Configuration
 *
 * Base URL defaults to localhost:3800 (Next.js dev server)
 * Tests should be run with `pnpm test:e2e`
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false, // Run serially for more consistent auth flow
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1, // Run single worker to avoid auth conflicts
  timeout: 60 * 1000, // 60 second timeout per test
  reporter: [["html", { outputFolder: "playwright-report" }], ["list"]],
  use: {
    baseURL: process.env.BASE_URL || "http://localhost:3800",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3800",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
})
