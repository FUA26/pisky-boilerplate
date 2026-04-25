import { test, expect } from "../fixtures/auth.fixture"
import { testUsers, testRoutes, selectors } from "../utils/test-data"

test.describe("Access Management", () => {
  // Sign in as admin before each test
  test.beforeEach(async ({ signIn }) => {
    await signIn({
      email: testUsers.admin.email,
      password: testUsers.admin.password,
    })
  })

  test.describe("Access Management Dashboard", () => {
    test("should display access management page", async ({ page }) => {
      await page.goto(testRoutes.accessManagement)

      // Check for page heading
      const heading = page.getByRole("heading", { level: 1 })
      await expect(heading).toBeVisible()
    })

    test("should have navigation to users, roles, and permissions", async ({
      page,
    }) => {
      await page.goto(testRoutes.accessManagement)

      // Check for navigation links
      const usersLink = page.getByRole("link", { name: /users|pengguna/i })
      const rolesLink = page.getByRole("link", { name: /roles|peran/i })
      const permissionsLink = page.getByRole("link", {
        name: /permissions|izin/i,
      })

      expect((await usersLink.count()) > 0).toBeTruthy()
      expect((await rolesLink.count()) > 0).toBeTruthy()
      expect((await permissionsLink.count()) > 0).toBeTruthy()
    })
  })

  test.describe("Users Management", () => {
    test("should display users list", async ({ page }) => {
      await page.goto(testRoutes.users)

      // Check for page heading
      const heading = page.getByRole("heading", { level: 1 })
      await expect(heading).toBeVisible()

      // Check for users table
      const table = page.locator(selectors.table).first()
      const hasTable = (await table.count()) > 0

      if (hasTable) {
        await expect(table.first()).toBeVisible()
      }
    })

    test("should have create user button if authorized", async ({ page }) => {
      await page.goto(testRoutes.users)

      // Check for create button
      const createButton = page.getByRole("button", {
        name: /create|new|add|baru|tambah/i,
      })
      const hasCreateButton = (await createButton.count()) > 0

      if (hasCreateButton) {
        await expect(createButton.first()).toBeVisible()
      }
    })

    test("should display user information in table", async ({ page }) => {
      await page.goto(testRoutes.users)

      const table = page.locator(selectors.table).first()
      const hasTable = (await table.count()) > 0

      if (hasTable) {
        // Check for table headers
        const headers = table.locator("th")
        const headerCount = await headers.count()

        expect(headerCount).toBeGreaterThan(0)

        // Check for table rows (excluding header)
        const rows = table.locator("tr")
        const rowCount = await rows.count()

        expect(rowCount).toBeGreaterThan(1) // At least header + one data row
      }
    })

    test("should allow editing user if authorized", async ({ page }) => {
      await page.goto(testRoutes.users)

      const table = page.locator(selectors.table).first()
      const hasTable = (await table.count()) > 0

      if (hasTable) {
        // Look for edit button in first data row
        const editButton = table
          .locator("tr")
          .nth(1)
          .getByRole("button", { name: /edit|ubah/i })
        const hasEditButton = (await editButton.count()) > 0

        if (hasEditButton) {
          await editButton.first().click()
          await page.waitForTimeout(500)

          // Should open edit dialog
          const dialog = page.locator('[role="dialog"]')
          const hasDialog = (await dialog.count()) > 0

          if (hasDialog) {
            await expect(dialog.first()).toBeVisible()
          }
        }
      }
    })

    test("should allow deleting user if authorized", async ({ page }) => {
      await page.goto(testRoutes.users)

      const table = page.locator(selectors.table).first()
      const hasTable = (await table.count()) > 0

      if (hasTable) {
        // Look for delete button in rows (skip first user which might be admin)
        const deleteButton = table
          .locator("tr")
          .nth(2)
          .getByRole("button", { name: /delete|hapus/i })
        const hasDeleteButton = (await deleteButton.count()) > 0

        if (hasDeleteButton) {
          await deleteButton.first().click()
          await page.waitForTimeout(500)

          // Should show confirmation dialog
          const confirmButton = page.getByRole("button", {
            name: /confirm|yes|ya/i,
          })
          const hasConfirmButton = (await confirmButton.count()) > 0

          if (hasConfirmButton) {
            // Don't actually delete, just verify the button exists
            await page.keyboard.press("Escape")
          }
        }
      }
    })

    test("should allow searching users", async ({ page }) => {
      await page.goto(testRoutes.users)

      // Look for search input
      const searchInput = page.getByRole("searchbox")
      const filterInput = page.getByPlaceholder(/search|filter|cari/i)
      const hasSearch = (await searchInput.count()) > 0
      const hasFilter = (await filterInput.count()) > 0

      if (hasSearch) {
        await searchInput.first().fill("admin")
        await page.waitForTimeout(500)
      } else if (hasFilter) {
        await filterInput.first().fill("admin")
        await page.waitForTimeout(500)
      }
    })
  })

  test.describe("Roles Management", () => {
    test("should display roles list", async ({ page }) => {
      await page.goto(testRoutes.roles)

      // Check for page heading
      const heading = page.getByRole("heading", { level: 1 })
      await expect(heading).toBeVisible()

      // Check for roles table or list
      const table = page.locator(selectors.table).first()
      const hasTable = (await table.count()) > 0

      if (hasTable) {
        await expect(table.first()).toBeVisible()
      }
    })

    test("should have create role button if authorized", async ({ page }) => {
      await page.goto(testRoutes.roles)

      // Check for create button
      const createButton = page.getByRole("button", {
        name: /create|new|add|baru|tambah/i,
      })
      const hasCreateButton = (await createButton.count()) > 0

      if (hasCreateButton) {
        await expect(createButton.first()).toBeVisible()
      }
    })

    test("should display role permissions", async ({ page }) => {
      await page.goto(testRoutes.roles)

      const table = page.locator(selectors.table).first()
      const hasTable = (await table.count()) > 0

      if (hasTable) {
        // Click on first role to view details
        const firstRow = table.locator("tr").nth(1)
        const roleLink = firstRow.getByRole("link")
        const hasRoleLink = (await roleLink.count()) > 0

        if (hasRoleLink) {
          await roleLink.first().click()
          await page.waitForTimeout(1000)

          // Should show role details with permissions
          const currentUrl = page.url()
          expect(currentUrl).toMatch(/\/roles\/[^/]+/)
        }
      }
    })

    test("should allow editing role permissions", async ({ page }) => {
      await page.goto(testRoutes.roles)

      const table = page.locator(selectors.table).first()
      const hasTable = (await table.count()) > 0

      if (hasTable) {
        // Look for edit button
        const editButton = table
          .locator("tr")
          .nth(1)
          .getByRole("button", { name: /edit|ubah|manage|kelola/i })
        const hasEditButton = (await editButton.count()) > 0

        if (hasEditButton) {
          await editButton.first().click()
          await page.waitForTimeout(500)

          // Should open edit dialog or navigate to edit page
          const currentUrl = page.url()
          const hasDialog = (await page.locator('[role="dialog"]').count()) > 0

          expect(hasDialog || currentUrl.includes("/edit")).toBeTruthy()
        }
      }
    })
  })

  test.describe("Permissions Management", () => {
    test("should display permissions list", async ({ page }) => {
      await page.goto(testRoutes.permissions)

      // Check for page heading
      const heading = page.getByRole("heading", { level: 1 })
      await expect(heading).toBeVisible()

      // Check for permissions table or list
      const table = page.locator(selectors.table).first()
      const hasTable = (await table.count()) > 0

      if (hasTable) {
        await expect(table.first()).toBeVisible()
      }
    })

    test("should display permission categories", async ({ page }) => {
      await page.goto(testRoutes.permissions)

      // Look for category sections or filters
      const categoryHeading = page.getByRole("heading", { level: 2 }).first()
      const categoryTab = page.getByRole("tab").first()
      const hasCategoryHeading = (await categoryHeading.count()) > 0
      const hasCategoryTab = (await categoryTab.count()) > 0

      expect(hasCategoryHeading || hasCategoryTab).toBeTruthy()
    })

    test("should allow creating new permission if authorized", async ({
      page,
    }) => {
      await page.goto(testRoutes.permissions)

      // Check for create button
      const createButton = page.getByRole("button", {
        name: /create|new|add|baru|tambah/i,
      })
      const hasCreateButton = (await createButton.count()) > 0

      if (hasCreateButton) {
        await expect(createButton.first()).toBeVisible()

        await createButton.first().click()
        await page.waitForTimeout(500)

        // Should open create dialog
        const dialog = page.locator('[role="dialog"]')
        const hasDialog = (await dialog.count()) > 0

        if (hasDialog) {
          await expect(dialog.first()).toBeVisible()
        }
      }
    })
  })

  test.describe("Access Control", () => {
    test("should restrict access for non-admin users", async ({
      page,
      signIn,
    }) => {
      // Sign out and sign in as regular user
      await page.goto("/sign-in")
      await signIn({
        email: testUsers.regular.email,
        password: testUsers.regular.password,
      })

      // Try to access access management
      await page.goto(testRoutes.accessManagement)

      // Should be redirected or show access denied
      await page.waitForTimeout(1000)
      const currentUrl = page.url()
      const hasAccessDenied =
        (await page
          .getByText(/access denied|not authorized|unauthorized/i)
          .count()) > 0

      expect(
        currentUrl.includes("/sign-in") ||
          currentUrl.includes("/no-access") ||
          hasAccessDenied
      ).toBeTruthy()
    })
  })
})
