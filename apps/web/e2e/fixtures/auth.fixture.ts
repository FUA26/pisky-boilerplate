import { test as base } from "@playwright/test"

export type AuthOptions = {
  email?: string
  password?: string
}

/**
 * Extended test fixture with authentication helpers
 */
export const test = base.extend<{
  signIn: (options?: AuthOptions) => Promise<void>
  signOut: () => Promise<void>
  signUp: (options?: AuthOptions & { name?: string }) => Promise<void>
}>({
  signIn: async ({ page }, use) => {
    const signInFunc = async (options: AuthOptions = {}) => {
      const { email = "admin@example.com", password = "admin123" } = options

      // Navigate to sign in page
      await page.goto("/sign-in")

      // Fill in credentials
      await page.fill('input[name="email"], input[type="email"]', email)
      await page.fill(
        'input[name="password"], input[type="password"]',
        password
      )

      // Submit form
      await page.click('button[type="submit"]')

      // Wait for navigation to dashboard or redirect
      await page.waitForURL(/\/(dashboard|backoffice)/, { timeout: 5000 })
    }

    await use(signInFunc)
  },

  signOut: async ({ page }, use) => {
    const signOutFunc = async () => {
      // Click sign out button (should be in user menu)
      const signOutButton = page.getByRole("button", {
        name: /sign out|logout|keluar/i,
      })
      await signOutButton.click()

      // Wait for navigation to sign in page
      await page.waitForURL("/sign-in", { timeout: 5000 })
    }

    await use(signOutFunc)
  },

  signUp: async ({ page }, use) => {
    const signUpFunc = async (
      options: AuthOptions & { name?: string } = {}
    ) => {
      const { email, password, name = "Test User" } = options

      // Navigate to sign up page
      await page.goto("/sign-up")

      // Fill in registration form
      if (name) {
        await page.fill('input[name="name"]', name)
      }
      if (email) {
        await page.fill('input[name="email"], input[type="email"]', email)
      }
      if (password) {
        await page.fill(
          'input[name="password"], input[type="password"]',
          password
        )
        // Confirm password if field exists
        const confirmPasswordField = page.locator(
          'input[name="confirmPassword"], input[name="confirm-password"]'
        )
        if ((await confirmPasswordField.count()) > 0) {
          await confirmPasswordField.fill(password)
        }
      }

      // Submit form
      await page.click('button[type="submit"]')

      // Wait for redirect or success message
      await page.waitForURL(/\/(sign-in|dashboard)/, { timeout: 5000 })
    }

    await use(signUpFunc)
  },
})

export const expect = test.expect
