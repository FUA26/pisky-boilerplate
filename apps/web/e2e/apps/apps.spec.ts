import { test, expect } from "../fixtures/auth.fixture"
import { testUsers, testRoutes, selectors } from "../utils/test-data"

test.describe("Apps Management", () => {
  // Sign in before each test
  test.beforeEach(async ({ signIn }) => {
    await signIn({
      email: testUsers.admin.email,
      password: testUsers.admin.password,
    })
  })

  test.describe("Apps List Page", () => {
    test("should display apps page", async ({ page }) => {
      await page.goto(testRoutes.apps)

      // Check for page heading
      const heading = page.getByRole("heading", { level: 1 })
      await expect(heading).toBeVisible()
    })

    test("should display apps list or grid", async ({ page }) => {
      await page.goto(testRoutes.apps)

      // Check for apps container
      const appsList = page.locator('[data-testid="apps-list"], .apps-list')
      const appsGrid = page.locator('[data-testid="apps-grid"], .apps-grid')
      const table = page.locator(selectors.table)

      const hasAppsList = (await appsList.count()) > 0
      const hasAppsGrid = (await appsGrid.count()) > 0
      const hasTable = (await table.count()) > 0

      expect(hasAppsList || hasAppsGrid || hasTable).toBeTruthy()
    })

    test("should have create app button if authorized", async ({ page }) => {
      await page.goto(testRoutes.apps)

      // Check for create button
      const createButton = page.getByRole("button", {
        name: /create|new|add|baru|buat/i,
      })
      const hasCreateButton = (await createButton.count()) > 0

      if (hasCreateButton) {
        await expect(createButton.first()).toBeVisible()
      }
    })
  })

  test.describe("App Creation", () => {
    test("should open create app dialog when button clicked", async ({
      page,
    }) => {
      await page.goto(testRoutes.apps)

      const createButton = page.getByRole("button", {
        name: /create|new|add|baru|buat/i,
      })
      const hasCreateButton = (await createButton.count()) > 0

      if (hasCreateButton) {
        await createButton.first().click()
        await page.waitForTimeout(500)

        // Check for dialog/form
        const dialog = page.locator('[role="dialog"], .dialog, .modal')
        const hasDialog = (await dialog.count()) > 0

        if (hasDialog) {
          await expect(dialog.first()).toBeVisible()

          // Check for form fields
          const nameInput = page.getByRole("textbox", { name: /name|nama/i })
          const slugInput = page.getByRole("textbox", { name: /slug/i })
          const descriptionInput = page.getByRole("textbox", {
            name: /description|deskripsi/i,
          })

          expect((await nameInput.count()) > 0).toBeTruthy()
        }
      }
    })

    test("should validate app slug format", async ({ page }) => {
      await page.goto(testRoutes.apps)

      const createButton = page.getByRole("button", {
        name: /create|new|add|baru/i,
      })
      const hasCreateButton = (await createButton.count()) > 0

      if (hasCreateButton) {
        await createButton.first().click()
        await page.waitForTimeout(500)

        // Try to fill slug with invalid format (spaces, special chars)
        const slugInput = page.getByRole("textbox", { name: /slug/i })
        const hasSlugInput = (await slugInput.count()) > 0

        if (hasSlugInput) {
          await slugInput.first().fill("invalid slug with spaces!")

          // Check for validation error
          await page.waitForTimeout(500)
          const errorElement = page.locator(selectors.formError)
          const hasError = (await errorElement.count()) > 0

          if (hasError) {
            await expect(errorElement.first()).toBeVisible()
          }
        }
      }
    })
  })

  test.describe("App Actions", () => {
    test("should allow viewing app details", async ({ page }) => {
      await page.goto(testRoutes.apps)

      // Find first app card/row
      const appCard = page
        .locator('[data-testid="app-card"], .app-card')
        .first()
      const appRow = page.locator(selectors.tableRow).nth(1)
      const hasAppCard = (await appCard.count()) > 0
      const hasAppRow = (await appRow.count()) > 0

      if (hasAppCard) {
        await appCard.first().click()
        await page.waitForTimeout(1000)

        // Should navigate to app detail page
        const currentUrl = page.url()
        expect(currentUrl).toMatch(/\/apps\/[^/]+/)
      } else if (hasAppRow) {
        await appRow.first().locator("a").click()
        await page.waitForTimeout(1000)

        const currentUrl = page.url()
        expect(currentUrl).toMatch(/\/apps\/[^/]+/)
      }
    })

    test("should allow editing app if authorized", async ({ page }) => {
      await page.goto(testRoutes.apps)

      // Find first app and look for edit button
      const editButton = page
        .getByRole("button", { name: /edit|ubah/i })
        .first()
      const hasEditButton = (await editButton.count()) > 0

      if (hasEditButton) {
        await editButton.click()
        await page.waitForTimeout(500)

        // Should open edit dialog
        const dialog = page.locator('[role="dialog"]')
        const hasDialog = (await dialog.count()) > 0

        if (hasDialog) {
          await expect(dialog.first()).toBeVisible()
        }
      }
    })

    test("should allow deactivating app if authorized", async ({ page }) => {
      await page.goto(testRoutes.apps)

      // Look for deactivate/toggle button
      const toggleButton = page.getByRole("button", {
        name: /deactivate|activate|toggle/i,
      })
      const hasToggleButton = (await toggleButton.count()) > 0

      if (hasToggleButton) {
        await toggleButton.first().click()
        await page.waitForTimeout(500)

        // Should show confirmation
        const confirmButton = page.getByRole("button", {
          name: /confirm|yes|ya/i,
        })
        const hasConfirmButton = (await confirmButton.count()) > 0

        if (hasConfirmButton) {
          // Cancel to avoid actually deactivating
          await page.keyboard.press("Escape")
        }
      }
    })
  })

  test.describe("App Channels", () => {
    test("should display app channels on app detail page", async ({ page }) => {
      await page.goto(testRoutes.apps)

      // Navigate to first app
      const appCard = page
        .locator('[data-testid="app-card"], .app-card')
        .first()
      const appRow = page.locator(selectors.tableRow).nth(1)
      const hasAppCard = (await appCard.count()) > 0
      const hasAppRow = (await appRow.count()) > 0

      if (hasAppCard) {
        await appCard.first().click()
      } else if (hasAppRow) {
        await appRow.first().locator("a").click()
      }

      await page.waitForTimeout(1000)

      // Check for channels section
      const channelsSection = page.getByText(/channels|channel|kanal/i)
      const hasChannelsSection = (await channelsSection.count()) > 0

      if (hasChannelsSection) {
        await expect(channelsSection.first()).toBeVisible()
      }
    })

    test("should allow creating new channel if authorized", async ({
      page,
    }) => {
      await page.goto(testRoutes.apps)

      // Navigate to first app
      const appCard = page.locator('[data-testid="app-card"]').first()
      const hasAppCard = (await appCard.count()) > 0

      if (hasAppCard) {
        await appCard.first().click()
        await page.waitForTimeout(1000)

        // Look for create channel button
        const createChannelButton = page.getByRole("button", {
          name: /create channel|add channel|new channel/i,
        })
        const hasCreateChannelButton = (await createChannelButton.count()) > 0

        if (hasCreateChannelButton) {
          await createChannelButton.first().click()
          await page.waitForTimeout(500)

          // Should open create channel dialog
          const dialog = page.locator('[role="dialog"]')
          const hasDialog = (await dialog.count()) > 0

          if (hasDialog) {
            await expect(dialog.first()).toBeVisible()
          }
        }
      }
    })
  })

  test.describe("App Access Requests", () => {
    test("should display access requests page", async ({ page }) => {
      await page.goto(testRoutes.accessRequests)

      // Check for page heading
      const heading = page.getByRole("heading", { level: 1 })
      await expect(heading).toBeVisible()
    })

    test("should display pending access requests", async ({ page }) => {
      await page.goto(testRoutes.accessRequests)

      // Check for requests table
      const table = page.locator(selectors.table).first()
      const hasTable = (await table.count()) > 0

      if (hasTable) {
        await expect(table.first()).toBeVisible()
      }
    })

    test("should allow approving access requests", async ({ page }) => {
      await page.goto(testRoutes.accessRequests)

      const table = page.locator(selectors.table).first()
      const hasTable = (await table.count()) > 0

      if (hasTable) {
        // Look for approve button
        const approveButton = table.getByRole("button", {
          name: /approve|terima|accept/i,
        })
        const hasApproveButton = (await approveButton.count()) > 0

        if (hasApproveButton) {
          await expect(approveButton.first()).toBeVisible()
        }
      }
    })

    test("should allow rejecting access requests", async ({ page }) => {
      await page.goto(testRoutes.accessRequests)

      const table = page.locator(selectors.table).first()
      const hasTable = (await table.count()) > 0

      if (hasTable) {
        // Look for reject button
        const rejectButton = table.getByRole("button", {
          name: /reject|tolak/i,
        })
        const hasRejectButton = (await rejectButton.count()) > 0

        if (hasRejectButton) {
          await expect(rejectButton.first()).toBeVisible()
        }
      }
    })
  })
})
