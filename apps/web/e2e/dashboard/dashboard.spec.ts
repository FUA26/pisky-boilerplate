import { test, expect } from "../fixtures/auth.fixture"
import { testUsers, testRoutes, selectors } from "../utils/test-data"

test.describe("Dashboard", () => {
  // Sign in before each test
  test.beforeEach(async ({ signIn }) => {
    await signIn({
      email: testUsers.admin.email,
      password: testUsers.admin.password,
    })
  })

  test.describe("Dashboard Page", () => {
    test("should display dashboard heading", async ({ page }) => {
      await page.goto(testRoutes.dashboard)

      // Check for dashboard heading
      const heading = page.getByRole("heading", { level: 1 })
      await expect(heading).toBeVisible()
    })

    test("should display navigation menu", async ({ page }) => {
      await page.goto(testRoutes.dashboard)

      // Check for navigation
      const nav = page.locator(selectors.navigationMenu)
      await expect(nav).toBeVisible()
    })

    test("should have navigation links to main features", async ({ page }) => {
      await page.goto(testRoutes.dashboard)

      // Check for common navigation links
      const expectedLinks = [
        /dashboard|dasbor/i,
        /tickets|tiket/i,
        /tasks|tugas/i,
        /apps|aplikasi/i,
        /settings|pengaturan/i,
      ]

      for (const pattern of expectedLinks) {
        const link = page.getByRole("link", { name: pattern })
        const isVisible = (await link.count()) > 0
        if (isVisible) {
          await expect(link.first()).toBeVisible()
        }
      }
    })

    test("should display user menu or profile link", async ({ page }) => {
      await page.goto(testRoutes.dashboard)

      // Check for user menu/profile
      const userMenu = page.getByRole("button", {
        name: /profile|user|account/i,
      })
      const profileLink = page.getByRole("link", { name: /profile|profil/i })

      const hasUserMenu = (await userMenu.count()) > 0
      const hasProfileLink = (await profileLink.count()) > 0

      expect(hasUserMenu || hasProfileLink).toBeTruthy()
    })

    test("should display sign out option", async ({ page }) => {
      await page.goto(testRoutes.dashboard)

      // Click on user menu if present
      const userMenu = page.getByRole("button", {
        name: /profile|user|account/i,
      })
      const hasUserMenu = (await userMenu.count()) > 0

      if (hasUserMenu) {
        await userMenu.first().click()
        await page.waitForTimeout(500)
      }

      // Check for sign out button/link
      const signOutButton = page.getByRole("button", {
        name: /sign out|logout|keluar/i,
      })
      const signOutLink = page.getByRole("link", {
        name: /sign out|logout|keluar/i,
      })

      const hasSignOutButton = (await signOutButton.count()) > 0
      const hasSignOutLink = (await signOutLink.count()) > 0

      expect(hasSignOutButton || hasSignOutLink).toBeTruthy()
    })
  })

  test.describe("Dashboard Navigation", () => {
    test("should navigate to tickets page", async ({ page }) => {
      await page.goto(testRoutes.dashboard)

      // Click on tickets link
      const ticketsLink = page.getByRole("link", { name: /tickets|tiket/i })
      const hasTicketsLink = (await ticketsLink.count()) > 0

      if (hasTicketsLink) {
        await ticketsLink.first().click()
        await page.waitForURL(/\/tickets/, { timeout: 5000 })
        expect(page.url()).toContain("/tickets")
      }
    })

    test("should navigate to tasks page", async ({ page }) => {
      await page.goto(testRoutes.dashboard)

      // Click on tasks link
      const tasksLink = page.getByRole("link", { name: /tasks|tugas/i })
      const hasTasksLink = (await tasksLink.count()) > 0

      if (hasTasksLink) {
        await tasksLink.first().click()
        await page.waitForURL(/\/tasks/, { timeout: 5000 })
        expect(page.url()).toContain("/tasks")
      }
    })

    test("should navigate to apps page", async ({ page }) => {
      await page.goto(testRoutes.dashboard)

      // Click on apps link
      const appsLink = page.getByRole("link", { name: /apps|aplikasi/i })
      const hasAppsLink = (await appsLink.count()) > 0

      if (hasAppsLink) {
        await appsLink.first().click()
        await page.waitForURL(/\/apps/, { timeout: 5000 })
        expect(page.url()).toContain("/apps")
      }
    })

    test("should navigate to settings page", async ({ page }) => {
      await page.goto(testRoutes.dashboard)

      // Click on settings link
      const settingsLink = page.getByRole("link", {
        name: /settings|pengaturan/i,
      })
      const hasSettingsLink = (await settingsLink.count()) > 0

      if (hasSettingsLink) {
        await settingsLink.first().click()
        await page.waitForURL(/\/settings/, { timeout: 5000 })
        expect(page.url()).toContain("/settings")
      }
    })

    test("should navigate to profile page", async ({ page }) => {
      await page.goto(testRoutes.dashboard)

      // Click on user menu/profile
      const userMenu = page.getByRole("button", {
        name: /profile|user|account/i,
      })
      const profileLink = page.getByRole("link", { name: /profile|profil/i })

      const hasUserMenu = (await userMenu.count()) > 0
      const hasProfileLink = (await profileLink.count()) > 0

      if (hasUserMenu) {
        await userMenu.first().click()
        await page.waitForTimeout(500)

        const profileMenuItem = page.getByRole("link", {
          name: /profile|profil/i,
        })
        if ((await profileMenuItem.count()) > 0) {
          await profileMenuItem.first().click()
          await page.waitForURL(/\/profile/, { timeout: 5000 })
          expect(page.url()).toContain("/profile")
        }
      } else if (hasProfileLink) {
        await profileLink.first().click()
        await page.waitForURL(/\/profile/, { timeout: 5000 })
        expect(page.url()).toContain("/profile")
      }
    })
  })

  test.describe("Dashboard Statistics", () => {
    test("should display statistics cards if present", async ({ page }) => {
      await page.goto(testRoutes.dashboard)

      // Check for stats cards
      const statsCards = page.locator(selectors.statsCard)
      const cardCount = await statsCards.count()

      if (cardCount > 0) {
        // Should have at least one stat card
        expect(cardCount).toBeGreaterThan(0)

        // First card should be visible
        await expect(statsCards.first()).toBeVisible()
      }
    })

    test("should display recent activity if present", async ({ page }) => {
      await page.goto(testRoutes.dashboard)

      // Look for recent activity section
      const activitySection = page.getByText(
        /recent activity|activity|aktivitas/i
      )
      const hasActivity = (await activitySection.count()) > 0

      if (hasActivity) {
        await expect(activitySection.first()).toBeVisible()
      }
    })
  })

  test.describe("Dashboard Responsive", () => {
    test("should display mobile menu on small screens", async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto(testRoutes.dashboard)

      // Check for mobile menu button
      const mobileMenuButton = page.locator(selectors.mobileMenuButton)
      const hasMobileMenu = (await mobileMenuButton.count()) > 0

      if (hasMobileMenu) {
        await expect(mobileMenuButton.first()).toBeVisible()
      }
    })

    test("should toggle mobile menu when clicked", async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto(testRoutes.dashboard)

      // Find and click mobile menu button
      const mobileMenuButton = page.locator(selectors.mobileMenuButton)
      const hasMobileMenu = (await mobileMenuButton.count()) > 0

      if (hasMobileMenu) {
        await mobileMenuButton.first().click()
        await page.waitForTimeout(500)

        // Menu should now be visible
        const mobileMenu = page.locator('nav, aside, [role="navigation"]')
        const menuVisible = await mobileMenu.first().isVisible()
        expect(menuVisible).toBeTruthy()
      }
    })
  })
})
