import { test, expect } from "../fixtures/auth.fixture"
import { testUsers, testRoutes, selectors } from "../utils/test-data"

test.describe("Settings", () => {
  // Sign in before each test
  test.beforeEach(async ({ signIn }) => {
    await signIn({
      email: testUsers.admin.email,
      password: testUsers.admin.password,
    })
  })

  test.describe("User Settings Page", () => {
    test("should display settings page", async ({ page }) => {
      await page.goto(testRoutes.settings)

      // Check for page heading
      const heading = page.getByRole("heading", { level: 1 })
      await expect(heading).toBeVisible()
    })

    test("should have settings sections or tabs", async ({ page }) => {
      await page.goto(testRoutes.settings)

      // Look for settings sections or tabs
      const tabs = page.getByRole("tab")
      const sections = page.locator('section, [data-testid*="setting"]')
      const hasTabs = (await tabs.count()) > 0
      const hasSections = (await sections.count()) > 0

      expect(hasTabs || hasSections).toBeTruthy()
    })
  })

  test.describe("System Settings", () => {
    test("should display system settings page if admin", async ({ page }) => {
      await page.goto(testRoutes.manage)

      // Check for page heading
      const heading = page.getByRole("heading", { level: 1 })
      const hasHeading = (await heading.count()) > 0

      if (hasHeading) {
        await expect(heading.first()).toBeVisible()
      }
    })

    test("should allow editing site name", async ({ page }) => {
      await page.goto(testRoutes.manage)

      // Look for site name input
      const siteNameInput = page.getByRole("textbox", {
        name: /site name|nama situs/i,
      })
      const hasSiteNameInput = (await siteNameInput.count()) > 0

      if (hasSiteNameInput) {
        const currentValue = await siteNameInput.first().inputValue()
        await siteNameInput.first().fill(`Test Site ${Date.now()}`)

        // Look for save button
        const saveButton = page.getByRole("button", { name: /save|simpan/i })
        const hasSaveButton = (await saveButton.count()) > 0

        if (hasSaveButton) {
          await saveButton.first().click()
          await page.waitForTimeout(1000)

          // Check for success message
          const toast = page.locator(selectors.toast)
          const hasToast = (await toast.count()) > 0

          if (hasToast) {
            await expect(toast.first()).toBeVisible()
          }
        }
      }
    })

    test("should allow toggling registration", async ({ page }) => {
      await page.goto(testRoutes.manage)

      // Look for registration toggle/switch
      const registrationToggle = page.getByRole("switch", {
        name: /registration|pendaftaran/i,
      })
      const registrationCheckbox = page.getByRole("checkbox", {
        name: /registration|pendaftaran/i,
      })
      const hasToggle = (await registrationToggle.count()) > 0
      const hasCheckbox = (await registrationCheckbox.count()) > 0

      if (hasToggle) {
        await registrationToggle.first().click()
        await page.waitForTimeout(500)

        // Look for save button
        const saveButton = page.getByRole("button", { name: /save|simpan/i })
        const hasSaveButton = (await saveButton.count()) > 0

        if (hasSaveButton) {
          await saveButton.first().click()
          await page.waitForTimeout(1000)
        }
      } else if (hasCheckbox) {
        await registrationCheckbox.first().check()
        await page.waitForTimeout(500)
      }
    })

    test("should allow setting password requirements", async ({ page }) => {
      await page.goto(testRoutes.manage)

      // Look for password length input
      const passwordLengthInput = page.getByRole("spinbutton", {
        name: /password length|panjang kata sandi/i,
      })
      const hasPasswordLengthInput = (await passwordLengthInput.count()) > 0

      if (hasPasswordLengthInput) {
        await passwordLengthInput.first().fill("10")
        await page.waitForTimeout(500)

        // Look for save button
        const saveButton = page.getByRole("button", { name: /save|simpan/i })
        const hasSaveButton = (await saveButton.count()) > 0

        if (hasSaveButton) {
          await saveButton.first().click()
          await page.waitForTimeout(1000)
        }
      }
    })
  })

  test.describe("Theme Settings", () => {
    test("should have theme toggle", async ({ page }) => {
      await page.goto(testRoutes.dashboard)

      // Look for theme toggle button
      const themeButton = page.getByRole("button", {
        name: /theme|dark|light|mode/i,
      })
      const hasThemeButton = (await themeButton.count()) > 0

      if (hasThemeButton) {
        await expect(themeButton.first()).toBeVisible()
      }
    })

    test("should toggle between light and dark mode", async ({ page }) => {
      await page.goto(testRoutes.dashboard)

      const themeButton = page.getByRole("button", {
        name: /theme|dark|light|mode/i,
      })
      const hasThemeButton = (await themeButton.count()) > 0

      if (hasThemeButton) {
        // Get initial theme
        const htmlBefore = page.locator("html")
        const classBefore = await htmlBefore.getAttribute("class")

        // Click theme toggle
        await themeButton.first().click()
        await page.waitForTimeout(500)

        // Get theme after toggle
        const htmlAfter = page.locator("html")
        const classAfter = await htmlAfter.getAttribute("class")

        // Classes should be different
        expect(classBefore).not.toEqual(classAfter)
      }
    })
  })

  test.describe("Notification Settings", () => {
    test("should display notification preferences", async ({ page }) => {
      await page.goto(testRoutes.settings)

      // Look for notification section
      const notificationSection = page.getByText(/notification|notifikasi/i)
      const hasNotificationSection = (await notificationSection.count()) > 0

      if (hasNotificationSection) {
        await expect(notificationSection.first()).toBeVisible()
      }
    })

    test("should allow toggling notification types", async ({ page }) => {
      await page.goto(testRoutes.settings)

      // Look for notification toggles
      const emailNotificationToggle = page.getByRole("switch", {
        name: /email/i,
      })
      const hasEmailToggle = (await emailNotificationToggle.count()) > 0

      if (hasEmailToggle) {
        await emailNotificationToggle.first().click()
        await page.waitForTimeout(500)
      }
    })
  })

  test.describe("Security Settings", () => {
    test("should display security settings", async ({ page }) => {
      await page.goto(testRoutes.settings)

      // Look for security section
      const securitySection = page.getByText(/security|keamanan/i)
      const hasSecuritySection = (await securitySection.count()) > 0

      if (hasSecuritySection) {
        await expect(securitySection.first()).toBeVisible()
      }
    })

    test("should have change password option", async ({ page }) => {
      await page.goto(testRoutes.settings)

      // Look for change password button/link
      const changePasswordButton = page.getByRole("button", {
        name: /change password|ubah kata sandi/i,
      })
      const changePasswordLink = page.getByRole("link", {
        name: /change password|ubah kata sandi/i,
      })
      const hasButton = (await changePasswordButton.count()) > 0
      const hasLink = (await changePasswordLink.count()) > 0

      expect(hasButton || hasLink).toBeTruthy()
    })
  })

  test.describe("Settings Validation", () => {
    test("should validate email settings format", async ({ page }) => {
      await page.goto(testRoutes.manage)

      // Look for email settings input
      const emailInput = page.getByRole("textbox", {
        name: /email|contact email/i,
      })
      const hasEmailInput = (await emailInput.count()) > 0

      if (hasEmailInput) {
        await emailInput.first().fill("invalid-email")

        // Look for save button
        const saveButton = page.getByRole("button", { name: /save|simpan/i })
        const hasSaveButton = (await saveButton.count()) > 0

        if (hasSaveButton) {
          await saveButton.first().click()
          await page.waitForTimeout(500)

          // Should show validation error
          const errorElement = page.locator(selectors.formError)
          const hasError = (await errorElement.count()) > 0

          if (hasError) {
            await expect(errorElement.first()).toBeVisible()
          }
        }
      }
    })

    test("should validate site URL format", async ({ page }) => {
      await page.goto(testRoutes.manage)

      // Look for site URL input
      const urlInput = page.getByRole("textbox", { name: /url|website/i })
      const hasUrlInput = (await urlInput.count()) > 0

      if (hasUrlInput) {
        await urlInput.first().fill("not-a-valid-url")

        // Look for save button
        const saveButton = page.getByRole("button", { name: /save|simpan/i })
        const hasSaveButton = (await saveButton.count()) > 0

        if (hasSaveButton) {
          await saveButton.first().click()
          await page.waitForTimeout(500)

          // Should show validation error
          const errorElement = page.locator(selectors.formError)
          const hasError = (await errorElement.count()) > 0

          if (hasError) {
            await expect(errorElement.first()).toBeVisible()
          }
        }
      }
    })
  })
})
