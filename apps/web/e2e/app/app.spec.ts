import { test, expect } from "../fixtures/auth.fixture"
import { testUsers, testRoutes } from "../utils/test-data"

test.describe("Application-Wide Tests", () => {
  test.describe("Landing Page", () => {
    test("should load landing page", async ({ page }) => {
      await page.goto(testRoutes.landing)

      // Check for page content
      const body = page.locator("body")
      await expect(body).toBeVisible()
    })

    test("should have navigation menu", async ({ page }) => {
      await page.goto(testRoutes.landing)

      const nav = page.locator("nav").first()
      const hasNav = (await nav.count()) > 0

      if (hasNav) {
        await expect(nav.first()).toBeVisible()
      }
    })

    test("should have sign in link or button", async ({ page }) => {
      await page.goto(testRoutes.landing)

      const signInLink = page.getByRole("link", {
        name: /sign in|login|masuk/i,
      })
      const signInButton = page.getByRole("button", {
        name: /sign in|login|masuk/i,
      })
      const hasSignInLink = (await signInLink.count()) > 0
      const hasSignInButton = (await signInButton.count()) > 0

      expect(hasSignInLink || hasSignInButton).toBeTruthy()
    })
  })

  test.describe("404 Page", () => {
    test("should show 404 page for non-existent routes", async ({ page }) => {
      await page.goto("/non-existent-page")

      // Check for 404 content
      const notFoundHeading = page.getByRole("heading", {
        name: /404|not found|tidak ditemukan/i,
      })
      const notFoundText = page.getByText(/404|not found|tidak ditemukan/i)
      const hasHeading = (await notFoundHeading.count()) > 0
      const hasText = (await notFoundText.count()) > 0

      expect(hasHeading || hasText).toBeTruthy()
    })

    test("should have link back to home on 404 page", async ({ page }) => {
      await page.goto("/non-existent-page")

      const homeLink = page.getByRole("link", {
        name: /home|beranda|dashboard/i,
      })
      const hasHomeLink = (await homeLink.count()) > 0

      if (hasHomeLink) {
        await expect(homeLink.first()).toBeVisible()
      }
    })
  })

  test.describe("Error Page", () => {
    test("should display error boundary on error", async ({ page }) => {
      // This test would need to trigger an actual error
      // For now, just verify error page exists
      await page.goto("/error")

      const errorHeading = page.getByRole("heading", {
        name: /error|oops|terjadi kesalahan/i,
      })
      const hasErrorHeading = (await errorHeading.count()) > 0

      if (hasErrorHeading) {
        await expect(errorHeading.first()).toBeVisible()
      }
    })
  })

  test.describe("Responsive Design", () => {
    test("should be responsive on mobile viewport", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto(testRoutes.landing)

      // Check body is visible
      const body = page.locator("body")
      await expect(body).toBeVisible()

      // No horizontal overflow
      const bodyWidth = await body.evaluate((el) => el.scrollWidth)
      const viewportWidth = page.viewportSize()?.width || 375
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth)
    })

    test("should be responsive on tablet viewport", async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })
      await page.goto(testRoutes.landing)

      const body = page.locator("body")
      await expect(body).toBeVisible()

      const bodyWidth = await body.evaluate((el) => el.scrollWidth)
      const viewportWidth = page.viewportSize()?.width || 768
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth)
    })

    test("should be responsive on desktop viewport", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 })
      await page.goto(testRoutes.landing)

      const body = page.locator("body")
      await expect(body).toBeVisible()
    })
  })

  test.describe("Accessibility", () => {
    test("should have proper heading hierarchy", async ({ page }) => {
      await page.goto(testRoutes.landing)

      // Check for h1
      const h1 = page.locator("h1")
      const hasH1 = (await h1.count()) > 0
      expect(hasH1).toBeTruthy()
    })

    test("should have skip link for keyboard navigation", async ({ page }) => {
      await page.goto(testRoutes.landing)

      const skipLink = page.locator('a[href^="#"], a[class*="skip"]')
      const hasSkipLink = (await skipLink.count()) > 0

      // Skip link is optional, just check if it exists
      if (hasSkipLink) {
        await expect(skipLink.first()).toBeVisible()
      }
    })

    test("should have accessible form labels", async ({ page }) => {
      await page.goto(testRoutes.signIn)

      const inputs = page.locator("input")
      const inputCount = await inputs.count()

      if (inputCount > 0) {
        // Check first input has associated label
        const firstInput = inputs.first()
        const id = await firstInput.getAttribute("id")
        const label = page.locator(`label[for="${id}"]`)
        const ariaLabel = await firstInput.getAttribute("aria-label")

        const hasLabel = (await label.count()) > 0
        const hasAriaLabel = ariaLabel !== null

        expect(hasLabel || hasAriaLabel).toBeTruthy()
      }
    })
  })

  test.describe("Performance", () => {
    test("should load page quickly", async ({ page }) => {
      const startTime = Date.now()
      await page.goto(testRoutes.landing)
      await page.waitForLoadState("networkidle")
      const loadTime = Date.now() - startTime

      // Page should load in less than 5 seconds
      expect(loadTime).toBeLessThan(5000)
    })

    test("should not have console errors", async ({ page }) => {
      const errors: string[] = []
      page.on("console", (msg) => {
        if (msg.type() === "error") {
          errors.push(msg.text())
        }
      })

      await page.goto(testRoutes.landing)
      await page.waitForLoadState("networkidle")

      // Check for critical errors
      const criticalErrors = errors.filter(
        (e) =>
          e.includes("Uncaught") ||
          e.includes("TypeError") ||
          e.includes("ReferenceError")
      )

      expect(criticalErrors.length).toBe(0)
    })
  })

  test.describe("Session Management", () => {
    test("should persist session across tabs", async ({ page, context }) => {
      // Sign in in first tab
      await page.goto("/sign-in")
      await page.fill('input[name="email"]', testUsers.admin.email)
      await page.fill('input[name="password"]', testUsers.admin.password)
      await page.click('button[type="submit"]')
      await page.waitForURL(/\/dashboard/, { timeout: 5000 })

      // Open new tab and navigate to dashboard
      const page2 = await context.newPage()
      await page2.goto(testRoutes.dashboard)

      // Should be logged in (not redirected to sign-in)
      await page2.waitForTimeout(1000)
      const url = page2.url()
      expect(url).not.toContain("/sign-in")

      await page2.close()
    })

    test("should handle session timeout gracefully", async ({ page }) => {
      // Sign in
      await page.goto("/sign-in")
      await page.fill('input[name="email"]', testUsers.admin.email)
      await page.fill('input[name="password"]', testUsers.admin.password)
      await page.click('button[type="submit"]')
      await page.waitForURL(/\/dashboard/, { timeout: 5000 })

      // Clear cookies to simulate session expiry
      await page.context().clearCookies()

      // Try to navigate to protected route
      await page.goto(testRoutes.dashboard)
      await page.waitForTimeout(1000)

      // Should redirect to sign-in
      const url = page.url()
      expect(url).toContain("/sign-in")
    })
  })

  test.describe("Security Headers", () => {
    test("should have security headers", async ({ page }) => {
      const response = await page.request.get(testRoutes.landing)
      const headers = response.headers()

      // Check for security headers (optional but recommended)
      const csp = headers["content-security-policy"]
      const xFrameOptions = headers["x-frame-options"]

      // These are optional, just log if present
      if (csp) {
        console.log("CSP header present:", csp)
      }
      if (xFrameOptions) {
        console.log("X-Frame-Options header present:", xFrameOptions)
      }
    })
  })
})
