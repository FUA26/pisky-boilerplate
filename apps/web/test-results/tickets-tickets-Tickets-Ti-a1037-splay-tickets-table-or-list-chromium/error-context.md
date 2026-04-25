# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tickets/tickets.spec.ts >> Tickets >> Tickets List Page >> should display tickets table or list
- Location: e2e/tickets/tickets.spec.ts:19:5

# Error details

```
Error: expect(received).toBeTruthy()

Received: false
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
    - generic [ref=e2]:
        - generic [ref=e3]:
            - generic:
                - generic:
                    - img "Background Paths"
            - link "Z Pisky Support" [ref=e5] [cursor=pointer]:
                - /url: /
                - generic [ref=e7]: Z
                - generic [ref=e8]: Pisky Support
            - generic [ref=e9]:
                - generic [ref=e11]: "404"
                - heading "Page not found" [level=1] [ref=e12]
                - paragraph [ref=e13]: The page is unavailable or has been moved. We will get you back on track.
            - generic [ref=e14]:
                - generic [ref=e17]: Next.js 16
                - generic [ref=e20]: React 19
        - generic [ref=e22]:
            - generic [ref=e23]:
                - link "Go to Dashboard" [ref=e24] [cursor=pointer]:
                    - /url: /
                    - img
                    - text: Go to Dashboard
                - link "Back to Sign In" [ref=e25] [cursor=pointer]:
                    - /url: /sign-in
                    - img
                    - text: Back to Sign In
                - generic [ref=e30]: or
                - link "Browse Documentation" [ref=e31] [cursor=pointer]:
                    - /url: https://github.com/yourorg/pisky-support
                    - img
                    - text: Browse Documentation
            - paragraph [ref=e32]:
                - text: Need help?
                - link "Report an issue" [ref=e33] [cursor=pointer]:
                    - /url: https://github.com/yourorg/pisky-support/issues
    - region "Notifications alt+T"
    - button "Open Next.js Dev Tools" [ref=e39] [cursor=pointer]:
        - img [ref=e40]
    - alert [ref=e43]
```

# Test source

```ts
  1   | import { test, expect } from "../fixtures/auth.fixture";
  2   | import { testUsers, testRoutes, selectors } from "../utils/test-data";
  3   |
  4   | test.describe("Tickets", () => {
  5   |   // Sign in before each test
  6   |   test.beforeEach(async ({ signIn }) => {
  7   |     await signIn({ email: testUsers.admin.email, password: testUsers.admin.password });
  8   |   });
  9   |
  10  |   test.describe("Tickets List Page", () => {
  11  |     test("should display tickets page", async ({ page }) => {
  12  |       await page.goto(testRoutes.tickets);
  13  |
  14  |       // Check for page heading
  15  |       const heading = page.getByRole("heading", { level: 1 });
  16  |       await expect(heading).toBeVisible();
  17  |     });
  18  |
  19  |     test("should display tickets table or list", async ({ page }) => {
  20  |       await page.goto(testRoutes.tickets);
  21  |
  22  |       // Check for tickets list/table
  23  |       const ticketsTable = page.locator(selectors.ticketsList).first();
  24  |       const table = page.locator(selectors.table).first();
  25  |       const hasTicketsList = await ticketsTable.count() > 0;
  26  |       const hasTable = await table.count() > 0;
  27  |
> 28  |       expect(hasTicketsList || hasTable).toBeTruthy();
      |                                          ^ Error: expect(received).toBeTruthy()
  29  |     });
  30  |
  31  |     test("should have create ticket button if authorized", async ({ page }) => {
  32  |       await page.goto(testRoutes.tickets);
  33  |
  34  |       // Check for create button
  35  |       const createButton = page.getByRole("button", { name: /create|new|add|baru|buat/i });
  36  |       const hasCreateButton = await createButton.count() > 0;
  37  |
  38  |       if (hasCreateButton) {
  39  |         await expect(createButton.first()).toBeVisible();
  40  |       }
  41  |     });
  42  |
  43  |     test("should have search or filter functionality", async ({ page }) => {
  44  |       await page.goto(testRoutes.tickets);
  45  |
  46  |       // Check for search input
  47  |       const searchInput = page.getByRole("searchbox");
  48  |       const filterInput = page.getByPlaceholder(/search|filter|cari/i);
  49  |       const hasSearch = await searchInput.count() > 0;
  50  |       const hasFilter = await filterInput.count() > 0;
  51  |
  52  |       expect(hasSearch || hasFilter).toBeTruthy();
  53  |     });
  54  |
  55  |     test("should display ticket details when clicked", async ({ page }) => {
  56  |       await page.goto(testRoutes.tickets);
  57  |
  58  |       // Find first ticket item/row
  59  |       const ticketItem = page.locator(selectors.ticketItem).first();
  60  |       const ticketRow = page.locator(selectors.tableRow).nth(1); // Skip header row
  61  |       const hasTicketItem = await ticketItem.count() > 0;
  62  |       const hasTicketRow = await ticketRow.count() > 0;
  63  |
  64  |       if (hasTicketItem || hasTicketRow) {
  65  |         // Click on ticket
  66  |         if (hasTicketItem) {
  67  |           await ticketItem.first().click();
  68  |         } else {
  69  |           await ticketRow.first().click();
  70  |         }
  71  |
  72  |         // Should navigate to ticket detail page
  73  |         await page.waitForTimeout(1000);
  74  |         const currentUrl = page.url();
  75  |         expect(currentUrl).toMatch(/\/tickets\/[^/]+/);
  76  |       }
  77  |     });
  78  |   });
  79  |
  80  |   test.describe("Ticket Detail Page", () => {
  81  |     test("should display ticket information", async ({ page }) => {
  82  |       // Navigate to tickets list and find first ticket
  83  |       await page.goto(testRoutes.tickets);
  84  |
  85  |       const ticketItem = page.locator(selectors.ticketItem).first();
  86  |       const ticketRow = page.locator(selectors.tableRow).nth(1);
  87  |       const hasTicketItem = await ticketItem.count() > 0;
  88  |       const hasTicketRow = await ticketRow.count() > 0;
  89  |
  90  |       if (hasTicketItem || hasTicketRow) {
  91  |         // Click on first ticket
  92  |         if (hasTicketItem) {
  93  |           await ticketItem.first().click();
  94  |         } else {
  95  |           await ticketRow.first().locator("a").click();
  96  |         }
  97  |
  98  |         await page.waitForTimeout(1000);
  99  |
  100 |         // Check for ticket details
  101 |         const heading = page.getByRole("heading", { level: 1 });
  102 |         await expect(heading).toBeVisible();
  103 |
  104 |         // Check for ticket subject/description
  105 |         const hasDescription = await page.getByText(/subject|description|deskripsi/i).count() > 0;
  106 |         // Description is optional, just verify page loaded
  107 |       }
  108 |     });
  109 |
  110 |     test("should display ticket status", async ({ page }) => {
  111 |       // Navigate to tickets list and find first ticket
  112 |       await page.goto(testRoutes.tickets);
  113 |
  114 |       const ticketRow = page.locator(selectors.tableRow).nth(1);
  115 |       const hasTicketRow = await ticketRow.count() > 0;
  116 |
  117 |       if (hasTicketRow) {
  118 |         await ticketRow.first().locator("a").click();
  119 |         await page.waitForTimeout(1000);
  120 |
  121 |         // Check for status indicator
  122 |         const statusBadge = page.getByText(/open|in progress|resolved|closed/i);
  123 |         const hasStatus = await statusBadge.count() > 0;
  124 |
  125 |         if (hasStatus) {
  126 |           await expect(statusBadge.first()).toBeVisible();
  127 |         }
  128 |       }
```
