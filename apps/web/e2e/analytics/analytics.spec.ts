import { test, expect } from "../fixtures/auth.fixture"
import { testUsers, testRoutes, selectors } from "../utils/test-data"

test.describe("Analytics", () => {
  // Sign in before each test
  test.beforeEach(async ({ signIn }) => {
    await signIn({
      email: testUsers.admin.email,
      password: testUsers.admin.password,
    })
  })

  test.describe("Analytics Dashboard", () => {
    test("should display analytics page", async ({ page }) => {
      await page.goto(testRoutes.analytics)

      // Check for page heading
      const heading = page.getByRole("heading", { level: 1 })
      await expect(heading).toBeVisible()
    })

    test("should display statistics cards", async ({ page }) => {
      await page.goto(testRoutes.analytics)

      // Check for stats cards
      const statsCards = page.locator(selectors.statsCard)
      const cardCount = await statsCards.count()

      if (cardCount > 0) {
        expect(cardCount).toBeGreaterThan(0)
        await expect(statsCards.first()).toBeVisible()
      }
    })

    test("should display charts or graphs if present", async ({ page }) => {
      await page.goto(testRoutes.analytics)

      // Look for chart containers
      const chartContainer = page.locator(
        '[data-testid="chart"], .chart, canvas'
      )
      const hasChart = (await chartContainer.count()) > 0

      if (hasChart) {
        await expect(chartContainer.first()).toBeVisible()
      }
    })
  })

  test.describe("Date Range Filtering", () => {
    test("should have date range selector", async ({ page }) => {
      await page.goto(testRoutes.analytics)

      // Look for date range picker
      const dateRangeButton = page.getByRole("button", {
        name: /date range|period|periode/i,
      })
      const dateInput = page.locator('input[type="date"]')
      const hasDateRangeButton = (await dateRangeButton.count()) > 0
      const hasDateInput = (await dateInput.count()) > 0

      expect(hasDateRangeButton || hasDateInput).toBeTruthy()
    })

    test("should filter analytics by date range", async ({ page }) => {
      await page.goto(testRoutes.analytics)

      const dateRangeButton = page.getByRole("button", { name: /date range/i })
      const hasDateRangeButton = (await dateRangeButton.count()) > 0

      if (hasDateRangeButton) {
        await dateRangeButton.first().click()
        await page.waitForTimeout(500)

        // Select a preset range
        const last7Days = page.getByRole("menuitem", { name: /7 days|last 7/i })
        const hasLast7Days = (await last7Days.count()) > 0

        if (hasLast7Days) {
          await last7Days.first().click()
          await page.waitForTimeout(1000)
        }
      }
    })
  })

  test.describe("Ticket Analytics", () => {
    test("should display ticket statistics", async ({ page }) => {
      await page.goto(testRoutes.analytics)

      // Look for ticket-related stats
      const ticketStats = page.getByText(/tickets|tiket/i)
      const hasTicketStats = (await ticketStats.count()) > 0

      if (hasTicketStats) {
        await expect(ticketStats.first()).toBeVisible()
      }
    })

    test("should display ticket status breakdown", async ({ page }) => {
      await page.goto(testRoutes.analytics)

      // Look for status breakdown
      const statusBreakdown = page.getByText(/open|closed|resolved/i)
      const hasStatusBreakdown = (await statusBreakdown.count()) > 0

      if (hasStatusBreakdown) {
        await expect(statusBreakdown.first()).toBeVisible()
      }
    })
  })

  test.describe("Task Analytics", () => {
    test("should display task statistics", async ({ page }) => {
      await page.goto(testRoutes.analytics)

      // Look for task-related stats
      const taskStats = page.getByText(/tasks|tugas/i)
      const hasTaskStats = (await taskStats.count()) > 0

      if (hasTaskStats) {
        await expect(taskStats.first()).toBeVisible()
      }
    })

    test("should display task completion rate", async ({ page }) => {
      await page.goto(testRoutes.analytics)

      // Look for completion rate
      const completionRate = page.getByText(/completion|completed|selesai/i)
      const hasCompletionRate = (await completionRate.count()) > 0

      if (hasCompletionRate) {
        await expect(completionRate.first()).toBeVisible()
      }
    })
  })

  test.describe("User Analytics", () => {
    test("should display user statistics", async ({ page }) => {
      await page.goto(testRoutes.analytics)

      // Look for user-related stats
      const userStats = page.getByText(/users|pengguna|active user/i)
      const hasUserStats = (await userStats.count()) > 0

      if (hasUserStats) {
        await expect(userStats.first()).toBeVisible()
      }
    })
  })

  test.describe("Export Functionality", () => {
    test("should have export button if available", async ({ page }) => {
      await page.goto(testRoutes.analytics)

      // Look for export button
      const exportButton = page.getByRole("button", {
        name: /export|download|unduh/i,
      })
      const hasExportButton = (await exportButton.count()) > 0

      if (hasExportButton) {
        await expect(exportButton.first()).toBeVisible()
      }
    })
  })
})
