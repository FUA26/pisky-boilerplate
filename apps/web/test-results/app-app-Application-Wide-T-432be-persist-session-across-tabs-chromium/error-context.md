# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app/app.spec.ts >> Application-Wide Tests >> Session Management >> should persist session across tabs
- Location: e2e/app/app.spec.ts:190:5

# Error details

```
TypeError: signIn(...) is not a function
```

```
Error: page.fill: Test ended.
Call log:
  - waiting for locator('input[name="email"], input[type="email"]')
    - locator resolved to <input id="email" type="email" name="email" data-slot="input" autocomplete="email" aria-invalid="false" placeholder="you@example.com" class="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-non…/>
    - fill("admin@example.com")
  - attempting fill action
    - waiting for element to be visible, enabled and editable

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
    - generic [ref=e2]:
        - generic [ref=e3]:
            - generic:
                - generic:
                    - img "Background Paths"
            - link "P Pisky Support" [ref=e5] [cursor=pointer]:
                - /url: /
                - generic [ref=e7]: P
                - generic [ref=e8]: Pisky Support
            - generic [ref=e9]:
                - heading "Ship faster with opinionated patterns" [level=1] [ref=e10]:
                    - text: Ship faster with
                    - text: opinionated patterns
                - paragraph [ref=e11]: Skip the boilerplate and get to building. Modern Next.js architecture, shadcn/ui components, and patterns that scale — all ready to go.
            - generic [ref=e12]:
                - generic [ref=e15]: Next.js 16
                - generic [ref=e18]: React 19
                - generic [ref=e21]: TypeScript
        - generic [ref=e25]:
            - generic [ref=e26]:
                - heading "Let's get you building" [level=1] [ref=e27]
                - paragraph [ref=e28]: Sign in to pick up where you left off
            - group [ref=e29]:
                - generic [ref=e30]: Email
                - textbox "Email" [ref=e31]:
                    - /placeholder: you@example.com
            - group [ref=e32]:
                - generic [ref=e33]:
                    - generic [ref=e34]: Password
                    - link "Forgot it?" [ref=e35] [cursor=pointer]:
                        - /url: /forgot-password
                - generic [ref=e36]:
                    - textbox "Password" [ref=e37]:
                        - /placeholder: ••••••••
                    - button "Show password" [ref=e38]:
                        - img
                        - generic [ref=e39]: Show password
            - group [ref=e40]:
                - button "Sign in" [ref=e41]
            - paragraph [ref=e42]:
                - text: New here?
                - link "Create an account" [ref=e43] [cursor=pointer]:
                    - /url: /sign-up
    - region "Notifications alt+T"
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
> 24 |       await page.fill('input[name="email"], input[type="email"]', email);
     |                  ^ Error: page.fill: Test ended.
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
  41 |       await signOutButton.click();
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
