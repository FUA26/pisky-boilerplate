# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dashboard/dashboard.spec.ts >> Dashboard >> Dashboard Page >> should display user menu or profile link
- Location: e2e/dashboard/dashboard.spec.ts:48:5

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
  4   | test.describe("Dashboard", () => {
  5   |   // Sign in before each test
  6   |   test.beforeEach(async ({ signIn }) => {
  7   |     await signIn({ email: testUsers.admin.email, password: testUsers.admin.password });
  8   |   });
  9   |
  10  |   test.describe("Dashboard Page", () => {
  11  |     test("should display dashboard heading", async ({ page }) => {
  12  |       await page.goto(testRoutes.dashboard);
  13  |
  14  |       // Check for dashboard heading
  15  |       const heading = page.getByRole("heading", { level: 1 });
  16  |       await expect(heading).toBeVisible();
  17  |     });
  18  |
  19  |     test("should display navigation menu", async ({ page }) => {
  20  |       await page.goto(testRoutes.dashboard);
  21  |
  22  |       // Check for navigation
  23  |       const nav = page.locator(selectors.navigationMenu);
  24  |       await expect(nav).toBeVisible();
  25  |     });
  26  |
  27  |     test("should have navigation links to main features", async ({ page }) => {
  28  |       await page.goto(testRoutes.dashboard);
  29  |
  30  |       // Check for common navigation links
  31  |       const expectedLinks = [
  32  |         /dashboard|dasbor/i,
  33  |         /tickets|tiket/i,
  34  |         /tasks|tugas/i,
  35  |         /apps|aplikasi/i,
  36  |         /settings|pengaturan/i,
  37  |       ];
  38  |
  39  |       for (const pattern of expectedLinks) {
  40  |         const link = page.getByRole("link", { name: pattern });
  41  |         const isVisible = await link.count() > 0;
  42  |         if (isVisible) {
  43  |           await expect(link.first()).toBeVisible();
  44  |         }
  45  |       }
  46  |     });
  47  |
  48  |     test("should display user menu or profile link", async ({ page }) => {
  49  |       await page.goto(testRoutes.dashboard);
  50  |
  51  |       // Check for user menu/profile
  52  |       const userMenu = page.getByRole("button", { name: /profile|user|account/i });
  53  |       const profileLink = page.getByRole("link", { name: /profile|profil/i });
  54  |
  55  |       const hasUserMenu = await userMenu.count() > 0;
  56  |       const hasProfileLink = await profileLink.count() > 0;
  57  |
> 58  |       expect(hasUserMenu || hasProfileLink).toBeTruthy();
      |                                             ^ Error: expect(received).toBeTruthy()
  59  |     });
  60  |
  61  |     test("should display sign out option", async ({ page }) => {
  62  |       await page.goto(testRoutes.dashboard);
  63  |
  64  |       // Click on user menu if present
  65  |       const userMenu = page.getByRole("button", { name: /profile|user|account/i });
  66  |       const hasUserMenu = await userMenu.count() > 0;
  67  |
  68  |       if (hasUserMenu) {
  69  |         await userMenu.first().click();
  70  |         await page.waitForTimeout(500);
  71  |       }
  72  |
  73  |       // Check for sign out button/link
  74  |       const signOutButton = page.getByRole("button", { name: /sign out|logout|keluar/i });
  75  |       const signOutLink = page.getByRole("link", { name: /sign out|logout|keluar/i });
  76  |
  77  |       const hasSignOutButton = await signOutButton.count() > 0;
  78  |       const hasSignOutLink = await signOutLink.count() > 0;
  79  |
  80  |       expect(hasSignOutButton || hasSignOutLink).toBeTruthy();
  81  |     });
  82  |   });
  83  |
  84  |   test.describe("Dashboard Navigation", () => {
  85  |     test("should navigate to tickets page", async ({ page }) => {
  86  |       await page.goto(testRoutes.dashboard);
  87  |
  88  |       // Click on tickets link
  89  |       const ticketsLink = page.getByRole("link", { name: /tickets|tiket/i });
  90  |       const hasTicketsLink = await ticketsLink.count() > 0;
  91  |
  92  |       if (hasTicketsLink) {
  93  |         await ticketsLink.first().click();
  94  |         await page.waitForURL(/\/tickets/, { timeout: 5000 });
  95  |         expect(page.url()).toContain("/tickets");
  96  |       }
  97  |     });
  98  |
  99  |     test("should navigate to tasks page", async ({ page }) => {
  100 |       await page.goto(testRoutes.dashboard);
  101 |
  102 |       // Click on tasks link
  103 |       const tasksLink = page.getByRole("link", { name: /tasks|tugas/i });
  104 |       const hasTasksLink = await tasksLink.count() > 0;
  105 |
  106 |       if (hasTasksLink) {
  107 |         await tasksLink.first().click();
  108 |         await page.waitForURL(/\/tasks/, { timeout: 5000 });
  109 |         expect(page.url()).toContain("/tasks");
  110 |       }
  111 |     });
  112 |
  113 |     test("should navigate to apps page", async ({ page }) => {
  114 |       await page.goto(testRoutes.dashboard);
  115 |
  116 |       // Click on apps link
  117 |       const appsLink = page.getByRole("link", { name: /apps|aplikasi/i });
  118 |       const hasAppsLink = await appsLink.count() > 0;
  119 |
  120 |       if (hasAppsLink) {
  121 |         await appsLink.first().click();
  122 |         await page.waitForURL(/\/apps/, { timeout: 5000 });
  123 |         expect(page.url()).toContain("/apps");
  124 |       }
  125 |     });
  126 |
  127 |     test("should navigate to settings page", async ({ page }) => {
  128 |       await page.goto(testRoutes.dashboard);
  129 |
  130 |       // Click on settings link
  131 |       const settingsLink = page.getByRole("link", { name: /settings|pengaturan/i });
  132 |       const hasSettingsLink = await settingsLink.count() > 0;
  133 |
  134 |       if (hasSettingsLink) {
  135 |         await settingsLink.first().click();
  136 |         await page.waitForURL(/\/settings/, { timeout: 5000 });
  137 |         expect(page.url()).toContain("/settings");
  138 |       }
  139 |     });
  140 |
  141 |     test("should navigate to profile page", async ({ page }) => {
  142 |       await page.goto(testRoutes.dashboard);
  143 |
  144 |       // Click on user menu/profile
  145 |       const userMenu = page.getByRole("button", { name: /profile|user|account/i });
  146 |       const profileLink = page.getByRole("link", { name: /profile|profil/i });
  147 |
  148 |       const hasUserMenu = await userMenu.count() > 0;
  149 |       const hasProfileLink = await profileLink.count() > 0;
  150 |
  151 |       if (hasUserMenu) {
  152 |         await userMenu.first().click();
  153 |         await page.waitForTimeout(500);
  154 |
  155 |         const profileMenuItem = page.getByRole("link", { name: /profile|profil/i });
  156 |         if (await profileMenuItem.count() > 0) {
  157 |           await profileMenuItem.first().click();
  158 |           await page.waitForURL(/\/profile/, { timeout: 5000 });
```
