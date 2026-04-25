# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apps/apps.spec.ts >> Apps Management >> Apps List Page >> should display apps list or grid
- Location: e2e/apps/apps.spec.ts:19:5

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
  4   | test.describe("Apps Management", () => {
  5   |   // Sign in before each test
  6   |   test.beforeEach(async ({ signIn }) => {
  7   |     await signIn({ email: testUsers.admin.email, password: testUsers.admin.password });
  8   |   });
  9   |
  10  |   test.describe("Apps List Page", () => {
  11  |     test("should display apps page", async ({ page }) => {
  12  |       await page.goto(testRoutes.apps);
  13  |
  14  |       // Check for page heading
  15  |       const heading = page.getByRole("heading", { level: 1 });
  16  |       await expect(heading).toBeVisible();
  17  |     });
  18  |
  19  |     test("should display apps list or grid", async ({ page }) => {
  20  |       await page.goto(testRoutes.apps);
  21  |
  22  |       // Check for apps container
  23  |       const appsList = page.locator("[data-testid=\"apps-list\"], .apps-list");
  24  |       const appsGrid = page.locator("[data-testid=\"apps-grid\"], .apps-grid");
  25  |       const table = page.locator(selectors.table);
  26  |
  27  |       const hasAppsList = await appsList.count() > 0;
  28  |       const hasAppsGrid = await appsGrid.count() > 0;
  29  |       const hasTable = await table.count() > 0;
  30  |
> 31  |       expect(hasAppsList || hasAppsGrid || hasTable).toBeTruthy();
      |                                                      ^ Error: expect(received).toBeTruthy()
  32  |     });
  33  |
  34  |     test("should have create app button if authorized", async ({ page }) => {
  35  |       await page.goto(testRoutes.apps);
  36  |
  37  |       // Check for create button
  38  |       const createButton = page.getByRole("button", { name: /create|new|add|baru|buat/i });
  39  |       const hasCreateButton = await createButton.count() > 0;
  40  |
  41  |       if (hasCreateButton) {
  42  |         await expect(createButton.first()).toBeVisible();
  43  |       }
  44  |     });
  45  |   });
  46  |
  47  |   test.describe("App Creation", () => {
  48  |     test("should open create app dialog when button clicked", async ({ page }) => {
  49  |       await page.goto(testRoutes.apps);
  50  |
  51  |       const createButton = page.getByRole("button", { name: /create|new|add|baru|buat/i });
  52  |       const hasCreateButton = await createButton.count() > 0;
  53  |
  54  |       if (hasCreateButton) {
  55  |         await createButton.first().click();
  56  |         await page.waitForTimeout(500);
  57  |
  58  |         // Check for dialog/form
  59  |         const dialog = page.locator('[role="dialog"], .dialog, .modal');
  60  |         const hasDialog = await dialog.count() > 0;
  61  |
  62  |         if (hasDialog) {
  63  |           await expect(dialog.first()).toBeVisible();
  64  |
  65  |           // Check for form fields
  66  |           const nameInput = page.getByRole("textbox", { name: /name|nama/i });
  67  |           const slugInput = page.getByRole("textbox", { name: /slug/i });
  68  |           const descriptionInput = page.getByRole("textbox", { name: /description|deskripsi/i });
  69  |
  70  |           expect(await nameInput.count() > 0).toBeTruthy();
  71  |         }
  72  |       }
  73  |     });
  74  |
  75  |     test("should validate app slug format", async ({ page }) => {
  76  |       await page.goto(testRoutes.apps);
  77  |
  78  |       const createButton = page.getByRole("button", { name: /create|new|add|baru/i });
  79  |       const hasCreateButton = await createButton.count() > 0;
  80  |
  81  |       if (hasCreateButton) {
  82  |         await createButton.first().click();
  83  |         await page.waitForTimeout(500);
  84  |
  85  |         // Try to fill slug with invalid format (spaces, special chars)
  86  |         const slugInput = page.getByRole("textbox", { name: /slug/i });
  87  |         const hasSlugInput = await slugInput.count() > 0;
  88  |
  89  |         if (hasSlugInput) {
  90  |           await slugInput.first().fill("invalid slug with spaces!");
  91  |
  92  |           // Check for validation error
  93  |           await page.waitForTimeout(500);
  94  |           const errorElement = page.locator(selectors.formError);
  95  |           const hasError = await errorElement.count() > 0;
  96  |
  97  |           if (hasError) {
  98  |             await expect(errorElement.first()).toBeVisible();
  99  |           }
  100 |         }
  101 |       }
  102 |     });
  103 |   });
  104 |
  105 |   test.describe("App Actions", () => {
  106 |     test("should allow viewing app details", async ({ page }) => {
  107 |       await page.goto(testRoutes.apps);
  108 |
  109 |       // Find first app card/row
  110 |       const appCard = page.locator("[data-testid=\"app-card\"], .app-card").first();
  111 |       const appRow = page.locator(selectors.tableRow).nth(1);
  112 |       const hasAppCard = await appCard.count() > 0;
  113 |       const hasAppRow = await appRow.count() > 0;
  114 |
  115 |       if (hasAppCard) {
  116 |         await appCard.first().click();
  117 |         await page.waitForTimeout(1000);
  118 |
  119 |         // Should navigate to app detail page
  120 |         const currentUrl = page.url();
  121 |         expect(currentUrl).toMatch(/\/apps\/[^/]+/);
  122 |       } else if (hasAppRow) {
  123 |         await appRow.first().locator("a").click();
  124 |         await page.waitForTimeout(1000);
  125 |
  126 |         const currentUrl = page.url();
  127 |         expect(currentUrl).toMatch(/\/apps\/[^/]+/);
  128 |       }
  129 |     });
  130 |
  131 |     test("should allow editing app if authorized", async ({ page }) => {
```
