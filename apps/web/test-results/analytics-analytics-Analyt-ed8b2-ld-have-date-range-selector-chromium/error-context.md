# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: analytics/analytics.spec.ts >> Analytics >> Date Range Filtering >> should have date range selector
- Location: e2e/analytics/analytics.spec.ts:46:5

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
  4   | test.describe("Analytics", () => {
  5   |   // Sign in before each test
  6   |   test.beforeEach(async ({ signIn }) => {
  7   |     await signIn({ email: testUsers.admin.email, password: testUsers.admin.password });
  8   |   });
  9   |
  10  |   test.describe("Analytics Dashboard", () => {
  11  |     test("should display analytics page", async ({ page }) => {
  12  |       await page.goto(testRoutes.analytics);
  13  |
  14  |       // Check for page heading
  15  |       const heading = page.getByRole("heading", { level: 1 });
  16  |       await expect(heading).toBeVisible();
  17  |     });
  18  |
  19  |     test("should display statistics cards", async ({ page }) => {
  20  |       await page.goto(testRoutes.analytics);
  21  |
  22  |       // Check for stats cards
  23  |       const statsCards = page.locator(selectors.statsCard);
  24  |       const cardCount = await statsCards.count();
  25  |
  26  |       if (cardCount > 0) {
  27  |         expect(cardCount).toBeGreaterThan(0);
  28  |         await expect(statsCards.first()).toBeVisible();
  29  |       }
  30  |     });
  31  |
  32  |     test("should display charts or graphs if present", async ({ page }) => {
  33  |       await page.goto(testRoutes.analytics);
  34  |
  35  |       // Look for chart containers
  36  |       const chartContainer = page.locator("[data-testid=\"chart\"], .chart, canvas");
  37  |       const hasChart = await chartContainer.count() > 0;
  38  |
  39  |       if (hasChart) {
  40  |         await expect(chartContainer.first()).toBeVisible();
  41  |       }
  42  |     });
  43  |   });
  44  |
  45  |   test.describe("Date Range Filtering", () => {
  46  |     test("should have date range selector", async ({ page }) => {
  47  |       await page.goto(testRoutes.analytics);
  48  |
  49  |       // Look for date range picker
  50  |       const dateRangeButton = page.getByRole("button", { name: /date range|period|periode/i });
  51  |       const dateInput = page.locator("input[type=\"date\"]");
  52  |       const hasDateRangeButton = await dateRangeButton.count() > 0;
  53  |       const hasDateInput = await dateInput.count() > 0;
  54  |
> 55  |       expect(hasDateRangeButton || hasDateInput).toBeTruthy();
      |                                                  ^ Error: expect(received).toBeTruthy()
  56  |     });
  57  |
  58  |     test("should filter analytics by date range", async ({ page }) => {
  59  |       await page.goto(testRoutes.analytics);
  60  |
  61  |       const dateRangeButton = page.getByRole("button", { name: /date range/i });
  62  |       const hasDateRangeButton = await dateRangeButton.count() > 0;
  63  |
  64  |       if (hasDateRangeButton) {
  65  |         await dateRangeButton.first().click();
  66  |         await page.waitForTimeout(500);
  67  |
  68  |         // Select a preset range
  69  |         const last7Days = page.getByRole("menuitem", { name: /7 days|last 7/i });
  70  |         const hasLast7Days = await last7Days.count() > 0;
  71  |
  72  |         if (hasLast7Days) {
  73  |           await last7Days.first().click();
  74  |           await page.waitForTimeout(1000);
  75  |         }
  76  |       }
  77  |     });
  78  |   });
  79  |
  80  |   test.describe("Ticket Analytics", () => {
  81  |     test("should display ticket statistics", async ({ page }) => {
  82  |       await page.goto(testRoutes.analytics);
  83  |
  84  |       // Look for ticket-related stats
  85  |       const ticketStats = page.getByText(/tickets|tiket/i);
  86  |       const hasTicketStats = await ticketStats.count() > 0;
  87  |
  88  |       if (hasTicketStats) {
  89  |         await expect(ticketStats.first()).toBeVisible();
  90  |       }
  91  |     });
  92  |
  93  |     test("should display ticket status breakdown", async ({ page }) => {
  94  |       await page.goto(testRoutes.analytics);
  95  |
  96  |       // Look for status breakdown
  97  |       const statusBreakdown = page.getByText(/open|closed|resolved/i);
  98  |       const hasStatusBreakdown = await statusBreakdown.count() > 0;
  99  |
  100 |       if (hasStatusBreakdown) {
  101 |         await expect(statusBreakdown.first()).toBeVisible();
  102 |       }
  103 |     });
  104 |   });
  105 |
  106 |   test.describe("Task Analytics", () => {
  107 |     test("should display task statistics", async ({ page }) => {
  108 |       await page.goto(testRoutes.analytics);
  109 |
  110 |       // Look for task-related stats
  111 |       const taskStats = page.getByText(/tasks|tugas/i);
  112 |       const hasTaskStats = await taskStats.count() > 0;
  113 |
  114 |       if (hasTaskStats) {
  115 |         await expect(taskStats.first()).toBeVisible();
  116 |       }
  117 |     });
  118 |
  119 |     test("should display task completion rate", async ({ page }) => {
  120 |       await page.goto(testRoutes.analytics);
  121 |
  122 |       // Look for completion rate
  123 |       const completionRate = page.getByText(/completion|completed|selesai/i);
  124 |       const hasCompletionRate = await completionRate.count() > 0;
  125 |
  126 |       if (hasCompletionRate) {
  127 |         await expect(completionRate.first()).toBeVisible();
  128 |       }
  129 |     });
  130 |   });
  131 |
  132 |   test.describe("User Analytics", () => {
  133 |     test("should display user statistics", async ({ page }) => {
  134 |       await page.goto(testRoutes.analytics);
  135 |
  136 |       // Look for user-related stats
  137 |       const userStats = page.getByText(/users|pengguna|active user/i);
  138 |       const hasUserStats = await userStats.count() > 0;
  139 |
  140 |       if (hasUserStats) {
  141 |         await expect(userStats.first()).toBeVisible();
  142 |       }
  143 |     });
  144 |   });
  145 |
  146 |   test.describe("Export Functionality", () => {
  147 |     test("should have export button if available", async ({ page }) => {
  148 |       await page.goto(testRoutes.analytics);
  149 |
  150 |       // Look for export button
  151 |       const exportButton = page.getByRole("button", { name: /export|download|unduh/i });
  152 |       const hasExportButton = await exportButton.count() > 0;
  153 |
  154 |       if (hasExportButton) {
  155 |         await expect(exportButton.first()).toBeVisible();
```
