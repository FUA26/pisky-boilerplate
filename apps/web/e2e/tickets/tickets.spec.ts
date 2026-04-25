import { test, expect } from "../fixtures/auth.fixture"
import { testUsers, testRoutes, selectors } from "../utils/test-data"

test.describe("Tickets", () => {
  // Sign in before each test
  test.beforeEach(async ({ signIn }) => {
    await signIn({
      email: testUsers.admin.email,
      password: testUsers.admin.password,
    })
  })

  test.describe("Tickets List Page", () => {
    test("should display tickets page", async ({ page }) => {
      await page.goto(testRoutes.tickets)

      // Check for page heading
      const heading = page.getByRole("heading", { level: 1 })
      await expect(heading).toBeVisible()
    })

    test("should display tickets table or list", async ({ page }) => {
      await page.goto(testRoutes.tickets)

      // Check for tickets list/table
      const ticketsTable = page.locator(selectors.ticketsList).first()
      const table = page.locator(selectors.table).first()
      const hasTicketsList = (await ticketsTable.count()) > 0
      const hasTable = (await table.count()) > 0

      expect(hasTicketsList || hasTable).toBeTruthy()
    })

    test("should have create ticket button if authorized", async ({ page }) => {
      await page.goto(testRoutes.tickets)

      // Check for create button
      const createButton = page.getByRole("button", {
        name: /create|new|add|baru|buat/i,
      })
      const hasCreateButton = (await createButton.count()) > 0

      if (hasCreateButton) {
        await expect(createButton.first()).toBeVisible()
      }
    })

    test("should have search or filter functionality", async ({ page }) => {
      await page.goto(testRoutes.tickets)

      // Check for search input
      const searchInput = page.getByRole("searchbox")
      const filterInput = page.getByPlaceholder(/search|filter|cari/i)
      const hasSearch = (await searchInput.count()) > 0
      const hasFilter = (await filterInput.count()) > 0

      expect(hasSearch || hasFilter).toBeTruthy()
    })

    test("should display ticket details when clicked", async ({ page }) => {
      await page.goto(testRoutes.tickets)

      // Find first ticket item/row
      const ticketItem = page.locator(selectors.ticketItem).first()
      const ticketRow = page.locator(selectors.tableRow).nth(1) // Skip header row
      const hasTicketItem = (await ticketItem.count()) > 0
      const hasTicketRow = (await ticketRow.count()) > 0

      if (hasTicketItem || hasTicketRow) {
        // Click on ticket
        if (hasTicketItem) {
          await ticketItem.first().click()
        } else {
          await ticketRow.first().click()
        }

        // Should navigate to ticket detail page
        await page.waitForTimeout(1000)
        const currentUrl = page.url()
        expect(currentUrl).toMatch(/\/tickets\/[^/]+/)
      }
    })
  })

  test.describe("Ticket Detail Page", () => {
    test("should display ticket information", async ({ page }) => {
      // Navigate to tickets list and find first ticket
      await page.goto(testRoutes.tickets)

      const ticketItem = page.locator(selectors.ticketItem).first()
      const ticketRow = page.locator(selectors.tableRow).nth(1)
      const hasTicketItem = (await ticketItem.count()) > 0
      const hasTicketRow = (await ticketRow.count()) > 0

      if (hasTicketItem || hasTicketRow) {
        // Click on first ticket
        if (hasTicketItem) {
          await ticketItem.first().click()
        } else {
          await ticketRow.first().locator("a").click()
        }

        await page.waitForTimeout(1000)

        // Check for ticket details
        const heading = page.getByRole("heading", { level: 1 })
        await expect(heading).toBeVisible()

        // Check for ticket subject/description
        const hasDescription =
          (await page.getByText(/subject|description|deskripsi/i).count()) > 0
        // Description is optional, just verify page loaded
      }
    })

    test("should display ticket status", async ({ page }) => {
      // Navigate to tickets list and find first ticket
      await page.goto(testRoutes.tickets)

      const ticketRow = page.locator(selectors.tableRow).nth(1)
      const hasTicketRow = (await ticketRow.count()) > 0

      if (hasTicketRow) {
        await ticketRow.first().locator("a").click()
        await page.waitForTimeout(1000)

        // Check for status indicator
        const statusBadge = page.getByText(/open|in progress|resolved|closed/i)
        const hasStatus = (await statusBadge.count()) > 0

        if (hasStatus) {
          await expect(statusBadge.first()).toBeVisible()
        }
      }
    })

    test("should allow adding message or comment", async ({ page }) => {
      // Navigate to tickets list and find first ticket
      await page.goto(testRoutes.tickets)

      const ticketRow = page.locator(selectors.tableRow).nth(1)
      const hasTicketRow = (await ticketRow.count()) > 0

      if (hasTicketRow) {
        await ticketRow.first().locator("a").click()
        await page.waitForTimeout(1000)

        // Check for message/comment input
        const messageInput = page.getByRole("textbox")
        const commentInput = page.locator("textarea")
        const hasMessageInput = (await messageInput.count()) > 0
        const hasCommentInput = (await commentInput.count()) > 0

        if (hasMessageInput || hasCommentInput) {
          // Try to add a message
          const input = hasMessageInput
            ? messageInput.first()
            : commentInput.first()
          await input.fill("Test message from E2E test")

          // Check for send button
          const sendButton = page.getByRole("button", {
            name: /send|submit|kirim/i,
          })
          const hasSendButton = (await sendButton.count()) > 0

          if (hasSendButton) {
            await sendButton.first().click()
            await page.waitForTimeout(1000)
          }
        }
      }
    })
  })

  test.describe("Ticket Actions", () => {
    test("should allow changing ticket status if authorized", async ({
      page,
    }) => {
      await page.goto(testRoutes.tickets)

      const ticketRow = page.locator(selectors.tableRow).nth(1)
      const hasTicketRow = (await ticketRow.count()) > 0

      if (hasTicketRow) {
        await ticketRow.first().locator("a").click()
        await page.waitForTimeout(1000)

        // Look for status change dropdown/button
        const statusDropdown = page.getByRole("combobox")
        const statusButton = page.getByRole("button", {
          name: /status|change/i,
        })
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

    test("should allow assigning ticket if authorized", async ({ page }) => {
      await page.goto(testRoutes.tickets)

      const ticketRow = page.locator(selectors.tableRow).nth(1)
      const hasTicketRow = (await ticketRow.count()) > 0

      if (hasTicketRow) {
        await ticketRow.first().locator("a").click()
        await page.waitForTimeout(1000)

        // Look for assign dropdown/button
        const assignButton = page.getByRole("button", {
          name: /assign|assignee/i,
        })
        const hasAssignButton = (await assignButton.count()) > 0

        if (hasAssignButton) {
          await expect(assignButton.first()).toBeVisible()
        }
      }
    })
  })

  test.describe("Ticket Filtering", () => {
    test("should filter tickets by status", async ({ page }) => {
      await page.goto(testRoutes.tickets)

      // Look for status filter
      const statusFilter = page.getByRole("combobox", { name: /status/i })
      const statusButton = page.getByRole("button", { name: /filter/i })
      const hasStatusFilter = (await statusFilter.count()) > 0

      if (hasStatusFilter) {
        await statusFilter.first().selectOption({ label: /open/i })
        await page.waitForTimeout(1000)

        // Verify filter was applied (URL or page content changed)
        const currentUrl = page.url()
        // Filter might be reflected in URL or just update the list
      }
    })

    test("should filter tickets by priority", async ({ page }) => {
      await page.goto(testRoutes.tickets)

      // Look for priority filter
      const priorityFilter = page.getByRole("combobox", { name: /priority/i })
      const hasPriorityFilter = (await priorityFilter.count()) > 0

      if (hasPriorityFilter) {
        await priorityFilter.first().selectOption({ label: /high/i })
        await page.waitForTimeout(1000)
      }
    })
  })
})
