import { FullConfig } from "@playwright/test"

async function globalSetup(config: FullConfig) {
  console.log("Starting E2E test setup...")
  console.log("Base URL:", config.projects?.[0]?.use?.baseURL)

  // Any global setup can go here, such as:
  // - Starting a test database
  // - Seeding test data
  // - Setting environment variables
}

export default globalSetup
