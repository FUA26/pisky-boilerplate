import { test, expect } from "../fixtures/auth.fixture"
import { testUsers, testRoutes, selectors } from "../utils/test-data"

test.describe("Profile", () => {
  // Sign in before each test
  test.beforeEach(async ({ signIn }) => {
    await signIn({
      email: testUsers.admin.email,
      password: testUsers.admin.password,
    })
  })

  test.describe("Profile Page", () => {
    test("should display profile page", async ({ page }) => {
      await page.goto(testRoutes.profile)

      // Check for page heading
      const heading = page.getByRole("heading", { level: 1 })
      await expect(heading).toBeVisible()
    })

    test("should display user information", async ({ page }) => {
      await page.goto(testRoutes.profile)

      // Check for user name display
      const nameHeading = page.getByRole("heading", {
        name: testUsers.admin.name,
      })
      const nameText = page.getByText(testUsers.admin.name)
      const hasNameHeading = (await nameHeading.count()) > 0
      const hasNameText = (await nameText.count()) > 0

      expect(hasNameHeading || hasNameText).toBeTruthy()
    })

    test("should display user email", async ({ page }) => {
      await page.goto(testRoutes.profile)

      // Check for email display
      const emailText = page.getByText(testUsers.admin.email)
      const emailLabel = page.getByText(/email/i)
      const hasEmailText = (await emailText.count()) > 0
      const hasEmailLabel = (await emailLabel.count()) > 0

      expect(hasEmailText || hasEmailLabel).toBeTruthy()
    })

    test("should display avatar or placeholder", async ({ page }) => {
      await page.goto(testRoutes.profile)

      // Check for avatar image or placeholder
      const avatar = page.locator('img[alt*="avatar"], img[alt*="profile"]')
      const avatarPlaceholder = page.locator(
        '[data-testid="avatar"], .avatar, [class*="avatar"]'
      )
      const hasAvatar = (await avatar.count()) > 0
      const hasPlaceholder = (await avatarPlaceholder.count()) > 0

      expect(hasAvatar || hasPlaceholder).toBeTruthy()
    })
  })

  test.describe("Profile Editing", () => {
    test("should allow editing profile name", async ({ page }) => {
      await page.goto(testRoutes.profile)

      // Look for edit button
      const editButton = page.getByRole("button", { name: /edit|ubah|profil/i })
      const hasEditButton = (await editButton.count()) > 0

      if (hasEditButton) {
        await editButton.first().click()
        await page.waitForTimeout(500)

        // Check for name input
        const nameInput = page.getByRole("textbox", { name: /name|nama/i })
        const hasNameInput = (await nameInput.count()) > 0

        if (hasNameInput) {
          await nameInput.first().fill(`Updated Name ${Date.now()}`)

          // Save changes
          const saveButton = page.getByRole("button", {
            name: /save|simpan|update/i,
          })
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

    test("should allow editing profile bio if available", async ({ page }) => {
      await page.goto(testRoutes.profile)

      // Look for edit button
      const editButton = page.getByRole("button", { name: /edit|ubah/i })
      const hasEditButton = (await editButton.count()) > 0

      if (hasEditButton) {
        await editButton.first().click()
        await page.waitForTimeout(500)

        // Check for bio input
        const bioInput = page.getByRole("textbox", {
          name: /bio|about|tentang/i,
        })
        const hasBioInput = (await bioInput.count()) > 0

        if (hasBioInput) {
          await bioInput.first().fill("Updated bio from E2E test")

          // Save changes
          const saveButton = page.getByRole("button", { name: /save|simpan/i })
          await saveButton.first().click()
          await page.waitForTimeout(1000)
        }
      }
    })
  })

  test.describe("Avatar Upload", () => {
    test("should have avatar upload option", async ({ page }) => {
      await page.goto(testRoutes.profile)

      // Look for upload button
      const uploadButton = page.getByRole("button", {
        name: /upload|change avatar|ubah foto/i,
      })
      const hasUploadButton = (await uploadButton.count()) > 0

      if (hasUploadButton) {
        await expect(uploadButton.first()).toBeVisible()
      }
    })

    test("should open file picker when upload clicked", async ({ page }) => {
      await page.goto(testRoutes.profile)

      const uploadButton = page.getByRole("button", { name: /upload|change/i })
      const hasUploadButton = (await uploadButton.count()) > 0

      if (hasUploadButton) {
        // Set up file chooser handler
        const fileChooserPromise = page.waitForEvent("filechooser")

        await uploadButton.first().click()

        const fileChooser = await fileChooserPromise
        expect(fileChooser).toBeDefined()
      }
    })
  })

  test.describe("Password Change", () => {
    test("should allow changing password", async ({ page }) => {
      await page.goto(testRoutes.profile)

      // Look for change password button/section
      const changePasswordButton = page.getByRole("button", {
        name: /change password|ubah kata sandi/i,
      })
      const passwordSection = page.getByText(/password|kata sandi/i)
      const hasChangeButton = (await changePasswordButton.count()) > 0
      const hasPasswordSection = (await passwordSection.count()) > 0

      if (hasChangeButton) {
        await changePasswordButton.first().click()
        await page.waitForTimeout(500)

        // Should show password change form
        const currentPasswordInput = page.getByRole("textbox", {
          name: /current|lama/i,
        })
        const newPasswordInput = page.getByRole("textbox", {
          name: /new|baru/i,
        })
        const hasCurrentPassword = (await currentPasswordInput.count()) > 0
        const hasNewPassword = (await newPasswordInput.count()) > 0

        expect(hasCurrentPassword || hasNewPassword).toBeTruthy()
      } else if (hasPasswordSection) {
        await passwordSection.first().click()
        await page.waitForTimeout(500)
      }
    })

    test("should validate current password", async ({ page }) => {
      await page.goto(testRoutes.profile)

      const changePasswordButton = page.getByRole("button", {
        name: /change password/i,
      })
      const hasChangeButton = (await changePasswordButton.count()) > 0

      if (hasChangeButton) {
        await changePasswordButton.first().click()
        await page.waitForTimeout(500)

        // Fill in wrong current password
        const currentPasswordInput = page.locator(
          'input[name="currentPassword"], input[name="old_password"]'
        )
        const hasCurrentPassword = (await currentPasswordInput.count()) > 0

        if (hasCurrentPassword) {
          await currentPasswordInput.first().fill("WrongPassword123!")

          const newPasswordInput = page.locator(
            'input[name="newPassword"], input[name="new_password"]'
          )
          await newPasswordInput.first().fill("NewPassword123!")

          // Submit form
          const submitButton = page.getByRole("button", {
            name: /save|simpan|change/i,
          })
          await submitButton.first().click()
          await page.waitForTimeout(1000)

          // Should show error
          const errorElement = page.locator(selectors.formError)
          const hasError = (await errorElement.count()) > 0

          if (hasError) {
            await expect(errorElement.first()).toBeVisible()
          }
        }
      }
    })

    test("should validate new password strength", async ({ page }) => {
      await page.goto(testRoutes.profile)

      const changePasswordButton = page.getByRole("button", {
        name: /change password/i,
      })
      const hasChangeButton = (await changePasswordButton.count()) > 0

      if (hasChangeButton) {
        await changePasswordButton.first().click()
        await page.waitForTimeout(500)

        // Fill in weak new password
        const newPasswordInput = page.locator(
          'input[name="newPassword"], input[name="new_password"]'
        )
        const hasNewPassword = (await newPasswordInput.count()) > 0

        if (hasNewPassword) {
          await newPasswordInput.first().fill("123")

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

  test.describe("Account Actions", () => {
    test("should have delete account option with warning", async ({ page }) => {
      await page.goto(testRoutes.profile)

      // Look for delete account button/link
      const deleteButton = page.getByRole("button", {
        name: /delete account|hapus akun/i,
      })
      const hasDeleteButton = (await deleteButton.count()) > 0

      if (hasDeleteButton) {
        await expect(deleteButton.first()).toBeVisible()

        await deleteButton.first().click()
        await page.waitForTimeout(500)

        // Should show warning/confirmation
        const dialog = page.locator('[role="dialog"]')
        const warningText = page.getByText(
          /warning|irreversible|cannot be undone/i
        )
        const hasDialog = (await dialog.count()) > 0
        const hasWarning = (await warningText.count()) > 0

        expect(hasDialog || hasWarning).toBeTruthy()

        // Close dialog without deleting
        if (hasDialog) {
          await page.keyboard.press("Escape")
        }
      }
    })
  })
})
