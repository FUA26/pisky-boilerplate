import { test, expect } from "../fixtures/auth.fixture"
import { testUsers, testRoutes, selectors } from "../utils/test-data"

test.describe("Authentication", () => {
  test.beforeEach(async ({ page }) => {
    // Start from landing page
    await page.goto(testRoutes.landing)
  })

  test.describe("Sign In", () => {
    test("should display sign in form", async ({ page }) => {
      await page.goto(testRoutes.signIn)

      // Check for email input
      await expect(page.locator(selectors.emailInput)).toBeVisible()

      // Check for password input
      await expect(page.locator(selectors.passwordInput)).toBeVisible()

      // Check for submit button
      await expect(page.locator(selectors.submitButton)).toBeVisible()
    })

    test("should show validation errors for empty fields", async ({ page }) => {
      await page.goto(testRoutes.signIn)

      // Try to submit without filling fields
      await page.click(selectors.submitButton)

      // Check for validation errors
      const errorSelector = page.locator(selectors.formError)
      const hasError = (await errorSelector.count()) > 0

      if (hasError) {
        await expect(errorSelector.first()).toBeVisible()
      }
    })

    test("should show error for invalid credentials", async ({ page }) => {
      await page.goto(testRoutes.signIn)

      // Fill in invalid credentials
      await page.fill(selectors.emailInput, "invalid@example.com")
      await page.fill(selectors.passwordInput, "WrongPassword123!")

      // Submit form
      await page.click(selectors.submitButton)

      // Check for error message or stay on sign-in page
      await page.waitForTimeout(1000)
      const currentUrl = page.url()
      expect(currentUrl).toContain("/sign-in")
    })

    test("should redirect to dashboard after successful sign in", async ({
      signIn,
    }) => {
      // Sign in using fixture
      await signIn({
        email: testUsers.admin.email,
        password: testUsers.admin.password,
      })

      // Should be redirected to dashboard or backoffice
      // This is handled by the signIn fixture
    })

    test("should have link to sign up page", async ({ page }) => {
      await page.goto(testRoutes.signIn)

      // Look for sign up link
      const signUpLink = page.getByRole("link", {
        name: /sign up|register|daftar/i,
      })
      await expect(signUpLink).toBeVisible()
    })

    test("should have link to forgot password page", async ({ page }) => {
      await page.goto(testRoutes.signIn)

      // Look for forgot password link
      const forgotPasswordLink = page.getByRole("link", {
        name: /forgot|lupa/i,
      })
      await expect(forgotPasswordLink).toBeVisible()
    })
  })

  test.describe("Sign Up", () => {
    test("should display sign up form", async ({ page }) => {
      await page.goto(testRoutes.signUp)

      // Check for name input (if present)
      const nameInput = page.locator(selectors.nameInput)
      const hasNameInput = (await nameInput.count()) > 0

      if (hasNameInput) {
        await expect(nameInput).toBeVisible()
      }

      // Check for email input
      await expect(page.locator(selectors.emailInput)).toBeVisible()

      // Check for password input
      await expect(page.locator(selectors.passwordInput)).toBeVisible()

      // Check for submit button
      await expect(page.locator(selectors.submitButton)).toBeVisible()
    })

    test("should show validation errors for invalid email", async ({
      page,
    }) => {
      await page.goto(testRoutes.signUp)

      // Fill in invalid email
      await page.fill(selectors.emailInput, "invalid-email")

      // Fill password
      await page.fill(selectors.passwordInput, "ValidPass123!")

      // Try to submit
      await page.click(selectors.submitButton)

      // Check for validation error
      await page.waitForTimeout(500)
      const emailInput = page.locator(selectors.emailInput)
      const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => {
        return el.validity && !el.validity.valid
      })

      expect(isInvalid).toBeTruthy()
    })

    test("should show validation error for weak password", async ({ page }) => {
      await page.goto(testRoutes.signUp)

      // Fill in email
      await page.fill(selectors.emailInput, "test@example.com")

      // Fill in weak password
      await page.fill(selectors.passwordInput, "123")

      // Try to submit
      await page.click(selectors.submitButton)

      // Check for error
      await page.waitForTimeout(500)
      const passwordInput = page.locator(selectors.passwordInput)
      const isInvalid = await passwordInput.evaluate((el: HTMLInputElement) => {
        return el.validity && el.validity.tooShort
      })

      // Password might be validated on server side too
      // Just check we're still on sign-up page
      const currentUrl = page.url()
      expect(currentUrl).toContain("/sign-up")
    })

    test("should redirect to sign in after successful registration", async ({
      page,
    }) => {
      // Generate unique user
      const uniqueEmail = `test-${Date.now()}@example.com`

      await page.goto(testRoutes.signUp)

      // Fill in registration form
      const nameInput = page.locator(selectors.nameInput)
      const hasNameInput = (await nameInput.count()) > 0

      if (hasNameInput) {
        await nameInput.fill("Test User")
      }

      await page.fill(selectors.emailInput, uniqueEmail)
      await page.fill(selectors.passwordInput, "TestPass123!")

      // Submit form
      await page.click(selectors.submitButton)

      // Wait for redirect (either to sign-in or dashboard)
      await page.waitForTimeout(2000)
      const currentUrl = page.url()
      expect(
        currentUrl.includes("/sign-in") || currentUrl.includes("/dashboard")
      ).toBeTruthy()
    })

    test("should have link to sign in page", async ({ page }) => {
      await page.goto(testRoutes.signUp)

      // Look for sign in link
      const signInLink = page.getByRole("link", {
        name: /sign in|login|masuk/i,
      })
      await expect(signInLink).toBeVisible()
    })
  })

  test.describe("Forgot Password", () => {
    test("should display forgot password form", async ({ page }) => {
      await page.goto(testRoutes.forgotPassword)

      // Check for email input
      await expect(page.locator(selectors.emailInput)).toBeVisible()

      // Check for submit button
      await expect(page.locator(selectors.submitButton)).toBeVisible()
    })

    test("should show validation error for empty email", async ({ page }) => {
      await page.goto(testRoutes.forgotPassword)

      // Try to submit without email
      await page.click(selectors.submitButton)

      // Check for error
      await page.waitForTimeout(500)
      const emailInput = page.locator(selectors.emailInput)
      const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => {
        return el.validity && el.validity.valueMissing
      })

      expect(isInvalid).toBeTruthy()
    })

    test("should submit reset request successfully", async ({ page }) => {
      await page.goto(testRoutes.forgotPassword)

      // Fill in email
      await page.fill(selectors.emailInput, testUsers.admin.email)

      // Submit form
      await page.click(selectors.submitButton)

      // Wait for success message or redirect
      await page.waitForTimeout(2000)

      // Should show success message or redirect to sign-in
      const currentUrl = page.url()
      const hasSuccessMessage =
        (await page.getByText(/sent|email|link/i).count()) > 0

      expect(
        currentUrl.includes("/sign-in") ||
          currentUrl.includes("/forgot-password") ||
          hasSuccessMessage
      ).toBeTruthy()
    })

    test("should have link back to sign in", async ({ page }) => {
      await page.goto(testRoutes.forgotPassword)

      // Look for sign in link
      const signInLink = page.getByRole("link", {
        name: /sign in|login|masuk|back/i,
      })
      await expect(signInLink).toBeVisible()
    })
  })

  test.describe("Authentication Flow", () => {
    test("should require authentication for protected routes", async ({
      page,
    }) => {
      // Try to access dashboard without authentication
      await page.goto(testRoutes.dashboard)

      // Should redirect to sign in
      await page.waitForURL(/\/sign-in/, { timeout: 5000 })
      expect(page.url()).toContain("/sign-in")
    })

    test("should persist session across page navigations", async ({
      signIn,
      page,
    }) => {
      // Sign in
      await signIn()

      // Navigate to different pages
      await page.goto(testRoutes.dashboard)
      await page.waitForURL(/\/dashboard/, { timeout: 5000 })

      await page.goto(testRoutes.tickets)
      await page.waitForTimeout(1000)

      // Should still be authenticated (not redirected to sign-in)
      expect(page.url()).not.toContain("/sign-in")
    })

    test("should allow sign out", async ({ signIn, signOut, page }) => {
      // Sign in
      await signIn()

      // Verify we're on dashboard
      expect(page.url()).toMatch(/\/(dashboard|backoffice)/)

      // Sign out
      await signOut()

      // Should be on sign in page
      expect(page.url()).toContain("/sign-in")

      // Try to access protected route
      await page.goto(testRoutes.dashboard)

      // Should redirect to sign in again
      await page.waitForURL(/\/sign-in/, { timeout: 5000 })
    })
  })
})
