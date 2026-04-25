# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth/auth.spec.ts >> Authentication >> Authentication Flow >> should allow sign out
- Location: e2e/auth/auth.spec.ts:270:5

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: locator.click: Test timeout of 60000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /sign out|logout|keluar/i })

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
    - generic [ref=e2]:
        - generic [ref=e5]:
            - button "Pisky Support Dev Development" [ref=e7] [cursor=pointer]:
                - img [ref=e9]
                - generic [ref=e13]:
                    - generic [ref=e14]: Pisky Support Dev
                    - generic [ref=e15]: Development
                - img [ref=e16]
            - generic [ref=e20]:
                - generic [ref=e21]: Navigation
                - list [ref=e23]:
                    - listitem [ref=e24]:
                        - link "Main" [ref=e25] [cursor=pointer]:
                            - /url: /dashboard
                            - img [ref=e27]
                            - generic [ref=e32]: Main
                    - listitem [ref=e33]:
                        - button "Task Management" [ref=e34]:
                            - img [ref=e36]
                            - generic [ref=e39]: Task Management
                            - img [ref=e41]
                    - listitem [ref=e43]:
                        - button "Ticketing" [ref=e44]:
                            - img [ref=e46]
                            - generic [ref=e48]: Ticketing
                            - img [ref=e50]
                    - listitem [ref=e52]:
                        - button "Apps & Analytics" [ref=e53]:
                            - img [ref=e55]
                            - generic [ref=e57]: Apps & Analytics
                            - img [ref=e59]
                    - listitem [ref=e61]:
                        - button "Access Management" [ref=e62]:
                            - img [ref=e64]
                            - generic [ref=e67]: Access Management
                            - img [ref=e69]
                    - listitem [ref=e71]:
                        - button "Account" [ref=e72]:
                            - img [ref=e74]
                            - generic [ref=e86]: Account
                            - img [ref=e88]
                    - listitem [ref=e90]:
                        - button "Demo" [ref=e91]:
                            - img [ref=e93]
                            - generic [ref=e96]: Demo
                            - img [ref=e98]
            - button "Toggle Sidebar" [ref=e100]
        - main [ref=e101]:
            - generic [ref=e102]:
                - generic [ref=e103]:
                    - button "Toggle Sidebar" [ref=e104]:
                        - img
                        - generic [ref=e105]: Toggle Sidebar
                    - navigation "breadcrumb" [ref=e106]:
                        - list [ref=e107]:
                            - listitem [ref=e108]:
                                - link "Dashboard" [disabled] [ref=e109]
                - generic [ref=e110]:
                    - generic [ref=e111]:
                        - img [ref=e112]
                        - searchbox "Search..." [ref=e115]
                    - button "2 Notifications" [ref=e116]:
                        - img
                        - generic [ref=e117]: "2"
                        - generic [ref=e118]: Notifications
                    - button "A Admin admin@example.com" [ref=e120]:
                        - generic [ref=e122]: A
                        - generic [ref=e123]:
                            - generic [ref=e124]: Admin
                            - generic [ref=e125]: admin@example.com
                        - img
            - main [ref=e126]:
                - generic [ref=e128]:
                    - img [ref=e130]
                    - heading "No App Access" [level=3] [ref=e132]
                    - paragraph [ref=e133]: You do not have access to any apps. Request access from an administrator.
    - region "Notifications alt+T"
    - button "Open Next.js Dev Tools" [ref=e139] [cursor=pointer]:
        - img [ref=e140]
    - alert [ref=e143]: Dashboard
```

# Test source

```ts
  1  | import { test as base } from "@playwright/test";
  2  |
  3  | export type AuthOptions = {
  4  |   email?: string;
  5  |   password?: string;
  6  | };
  7  |
  8  | /**
  9  |  * Extended test fixture with authentication helpers
  10 |  */
  11 | export const test = base.extend<{
  12 |   signIn: (options?: AuthOptions) => Promise<void>;
  13 |   signOut: () => Promise<void>;
  14 |   signUp: (options?: AuthOptions & { name?: string }) => Promise<void>;
  15 | }>({
  16 |   signIn: async ({ page }, use) => {
  17 |     const signInFunc = async (options: AuthOptions = {}) => {
  18 |       const { email = "admin@example.com", password = "admin123" } = options;
  19 |
  20 |       // Navigate to sign in page
  21 |       await page.goto("/sign-in");
  22 |
  23 |       // Fill in credentials
  24 |       await page.fill('input[name="email"], input[type="email"]', email);
  25 |       await page.fill('input[name="password"], input[type="password"]', password);
  26 |
  27 |       // Submit form
  28 |       await page.click('button[type="submit"]');
  29 |
  30 |       // Wait for navigation to dashboard or redirect
  31 |       await page.waitForURL(/\/(dashboard|backoffice)/, { timeout: 5000 });
  32 |     };
  33 |
  34 |     await use(signInFunc);
  35 |   },
  36 |
  37 |   signOut: async ({ page }, use) => {
  38 |     const signOutFunc = async () => {
  39 |       // Click sign out button (should be in user menu)
  40 |       const signOutButton = page.getByRole("button", { name: /sign out|logout|keluar/i });
> 41 |       await signOutButton.click();
     |                           ^ Error: locator.click: Test timeout of 60000ms exceeded.
  42 |
  43 |       // Wait for navigation to sign in page
  44 |       await page.waitForURL("/sign-in", { timeout: 5000 });
  45 |     };
  46 |
  47 |     await use(signOutFunc);
  48 |   },
  49 |
  50 |   signUp: async ({ page }, use) => {
  51 |     const signUpFunc = async (options: AuthOptions & { name?: string } = {}) => {
  52 |       const {
  53 |         email,
  54 |         password,
  55 |         name = "Test User",
  56 |       } = options;
  57 |
  58 |       // Navigate to sign up page
  59 |       await page.goto("/sign-up");
  60 |
  61 |       // Fill in registration form
  62 |       if (name) {
  63 |         await page.fill('input[name="name"]', name);
  64 |       }
  65 |       if (email) {
  66 |         await page.fill('input[name="email"], input[type="email"]', email);
  67 |       }
  68 |       if (password) {
  69 |         await page.fill('input[name="password"], input[type="password"]', password);
  70 |         // Confirm password if field exists
  71 |         const confirmPasswordField = page.locator('input[name="confirmPassword"], input[name="confirm-password"]');
  72 |         if (await confirmPasswordField.count() > 0) {
  73 |           await confirmPasswordField.fill(password);
  74 |         }
  75 |       }
  76 |
  77 |       // Submit form
  78 |       await page.click('button[type="submit"]');
  79 |
  80 |       // Wait for redirect or success message
  81 |       await page.waitForURL(/\/(sign-in|dashboard)/, { timeout: 5000 });
  82 |     };
  83 |
  84 |     await use(signUpFunc);
  85 |   },
  86 | });
  87 |
  88 | export const expect = test.expect;
  89 |
```
