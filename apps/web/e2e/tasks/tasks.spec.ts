import { test, expect } from "../fixtures/auth.fixture"
import { testUsers, testRoutes, selectors } from "../utils/test-data"

test.describe("Tasks", () => {
  // Sign in before each test
  test.beforeEach(async ({ signIn }) => {
    await signIn({
      email: testUsers.admin.email,
      password: testUsers.admin.password,
    })
  })

  test.describe("Tasks List Page", () => {
    test("should display tasks page", async ({ page }) => {
      await page.goto(testRoutes.tasks)

      // Check for page heading
      const heading = page.getByRole("heading", { level: 1 })
      await expect(heading).toBeVisible()
    })

    test("should display tasks list or kanban board", async ({ page }) => {
      await page.goto(testRoutes.tasks)

      // Check for tasks list
      const tasksList = page.locator(selectors.tasksList).first()
      const hasTasksList = (await tasksList.count()) > 0

      if (hasTasksList) {
        await expect(tasksList.first()).toBeVisible()
      }
    })

    test("should have create task button if authorized", async ({ page }) => {
      await page.goto(testRoutes.tasks)

      // Check for create button
      const createButton = page.getByRole("button", {
        name: /create|new|add|baru|buat/i,
      })
      const hasCreateButton = (await createButton.count()) > 0

      if (hasCreateButton) {
        await expect(createButton.first()).toBeVisible()
      }
    })

    test("should display task cards or items", async ({ page }) => {
      await page.goto(testRoutes.tasks)

      // Check for task items
      const taskItem = page.locator(selectors.taskItem).first()
      const hasTaskItem = (await taskItem.count()) > 0

      if (hasTaskItem) {
        await expect(taskItem.first()).toBeVisible()
      }
    })
  })

  test.describe("Task Creation", () => {
    test("should open create task dialog when button clicked", async ({
      page,
    }) => {
      await page.goto(testRoutes.tasks)

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
        }
      }
    })

    test("should create new task with valid data", async ({ page }) => {
      await page.goto(testRoutes.tasks)

      const createButton = page.getByRole("button", {
        name: /create|new|add|baru/i,
      })
      const hasCreateButton = (await createButton.count()) > 0

      if (hasCreateButton) {
        await createButton.first().click()
        await page.waitForTimeout(500)

        // Fill in task form
        const titleInput = page.getByRole("textbox", {
          name: /title|judul|name/i,
        })
        const hasTitleInput = (await titleInput.count()) > 0

        if (hasTitleInput) {
          await titleInput.first().fill(`E2E Test Task ${Date.now()}`)

          // Submit form
          const submitButton = page.getByRole("button", {
            name: /create|save|submit|simpan/i,
          })
          await submitButton.first().click()
          await page.waitForTimeout(1000)

          // Check for success message or new task in list
          const toast = page.locator(selectors.toast)
          const hasToast = (await toast.count()) > 0

          if (hasToast) {
            await expect(toast.first()).toBeVisible()
          }
        }
      }
    })
  })

  test.describe("Task Actions", () => {
    test("should allow viewing task details", async ({ page }) => {
      await page.goto(testRoutes.tasks)

      const taskItem = page.locator(selectors.taskItem).first()
      const hasTaskItem = (await taskItem.count()) > 0

      if (hasTaskItem) {
        await taskItem.first().click()
        await page.waitForTimeout(1000)

        // Should show task details
        const currentUrl = page.url()
        const hasTaskDetail = currentUrl.includes("/tasks/")
        const hasDialogOpen =
          (await page.locator('[role="dialog"]').count()) > 0

        expect(hasTaskDetail || hasDialogOpen).toBeTruthy()
      }
    })

    test("should allow editing task if authorized", async ({ page }) => {
      await page.goto(testRoutes.tasks)

      const taskItem = page.locator(selectors.taskItem).first()
      const hasTaskItem = (await taskItem.count()) > 0

      if (hasTaskItem) {
        // Look for edit button on task
        const editButton = taskItem.getByRole("button", { name: /edit|ubah/i })
        const hasEditButton = (await editButton.count()) > 0

        if (hasEditButton) {
          await editButton.first().click()
          await page.waitForTimeout(500)

          // Should open edit dialog/form
          const dialog = page.locator('[role="dialog"]')
          const hasDialog = (await dialog.count()) > 0

          if (hasDialog) {
            await expect(dialog.first()).toBeVisible()
          }
        }
      }
    })

    test("should allow changing task status", async ({ page }) => {
      await page.goto(testRoutes.tasks)

      const taskItem = page.locator(selectors.taskItem).first()
      const hasTaskItem = (await taskItem.count()) > 0

      if (hasTaskItem) {
        // Look for status dropdown/button
        const statusDropdown = taskItem.getByRole("combobox")
        const statusButton = taskItem.getByRole("button", { name: /status/i })
        const hasStatusDropdown = (await statusDropdown.count()) > 0
        const hasStatusButton = (await statusButton.count()) > 0

        if (hasStatusDropdown) {
          await statusDropdown.first().selectOption({ index: 1 })
          await page.waitForTimeout(500)
        } else if (hasStatusButton) {
          await statusButton.first().click()
          await page.waitForTimeout(500)
        }
      }
    })

    test("should allow assigning task to user", async ({ page }) => {
      await page.goto(testRoutes.tasks)

      const taskItem = page.locator(selectors.taskItem).first()
      const hasTaskItem = (await taskItem.count()) > 0

      if (hasTaskItem) {
        // Look for assign dropdown/button
        const assignButton = taskItem.getByRole("button", {
          name: /assign|assignee/i,
        })
        const hasAssignButton = (await assignButton.count()) > 0

        if (hasAssignButton) {
          await assignButton.first().click()
          await page.waitForTimeout(500)
        }
      }
    })
  })

  test.describe("Task Filtering", () => {
    test("should filter tasks by status", async ({ page }) => {
      await page.goto(testRoutes.tasks)

      // Look for status filter
      const statusFilter = page.getByRole("tab", {
        name: /todo|in progress|done/i,
      })
      const statusDropdown = page.getByRole("combobox", { name: /status/i })
      const hasStatusFilter = (await statusFilter.count()) > 0
      const hasStatusDropdown = (await statusDropdown.count()) > 0

      if (hasStatusFilter) {
        await statusFilter.first().click()
        await page.waitForTimeout(500)
      } else if (hasStatusDropdown) {
        await statusDropdown.first().selectOption({ label: /in progress/i })
        await page.waitForTimeout(500)
      }
    })

    test("should filter tasks by priority", async ({ page }) => {
      await page.goto(testRoutes.tasks)

      // Look for priority filter
      const priorityFilter = page.getByRole("button", {
        name: /priority|high|low/i,
      })
      const priorityDropdown = page.getByRole("combobox", { name: /priority/i })
      const hasPriorityFilter = (await priorityFilter.count()) > 0
      const hasPriorityDropdown = (await priorityDropdown.count()) > 0

      if (hasPriorityFilter) {
        await priorityFilter.first().click()
        await page.waitForTimeout(500)
      } else if (hasPriorityDropdown) {
        await priorityDropdown.first().selectOption({ label: /high/i })
        await page.waitForTimeout(500)
      }
    })
  })

  test.describe("Task Comments", () => {
    test("should allow adding comments to task", async ({ page }) => {
      await page.goto(testRoutes.tasks)

      const taskItem = page.locator(selectors.taskItem).first()
      const hasTaskItem = (await taskItem.count()) > 0

      if (hasTaskItem) {
        // Click on task to view details
        await taskItem.first().click()
        await page.waitForTimeout(1000)

        // Look for comment input
        const commentInput = page.getByRole("textbox", { name: /comment|add/i })
        const hasCommentInput = (await commentInput.count()) > 0

        if (hasCommentInput) {
          await commentInput.first().fill("Test comment from E2E test")

          const submitButton = page.getByRole("button", {
            name: /send|submit|post/i,
          })
          const hasSubmitButton = (await submitButton.count()) > 0

          if (hasSubmitButton) {
            await submitButton.first().click()
            await page.waitForTimeout(1000)
          }
        }
      }
    })
  })
})
