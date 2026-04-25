# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth/auth.spec.ts >> Authentication >> Sign Up >> should redirect to sign in after successful registration
- Location: e2e/auth/auth.spec.ts:149:5

# Error details

```
Error: expect(received).toBeTruthy()

Received: false
```

# Page snapshot

```yaml
- generic [ref=e1]:
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
                - heading "Start building" [level=1] [ref=e27]
                - paragraph [ref=e28]: Create an account and skip the boilerplate
            - group [ref=e29]:
                - generic [ref=e30]: Name
                - textbox "Name" [ref=e31]:
                    - /placeholder: Your name
                    - text: Test User
            - group [ref=e32]:
                - generic [ref=e33]: Email
                - textbox "Email" [ref=e34]:
                    - /placeholder: you@example.com
                    - text: test-1777103841863@example.com
            - group [ref=e35]:
                - generic [ref=e36]: Password
                - generic [ref=e37]:
                    - textbox "Password" [ref=e38]:
                        - /placeholder: ••••••••
                        - text: TestPass123!
                    - button "Show password" [ref=e39]:
                        - img
                        - generic [ref=e40]: Show password
            - group [ref=e41]:
                - generic [ref=e42]: Confirm Password
                - generic [ref=e43]:
                    - textbox "Confirm Password" [active] [ref=e44]:
                        - /placeholder: ••••••••
                    - button "Show password" [ref=e45]:
                        - img
                        - generic [ref=e46]: Show password
                - paragraph [ref=e47]: Please confirm your password
            - group [ref=e48]:
                - button "Create account" [ref=e49]
            - paragraph [ref=e50]:
                - text: Already have an account?
                - link "Sign in" [ref=e51] [cursor=pointer]:
                    - /url: /sign-in
    - region "Notifications alt+T"
    - button "Open Next.js Dev Tools" [ref=e57] [cursor=pointer]:
        - img [ref=e58]
    - alert [ref=e61]
```

# Test source

```ts
  74  |       // Look for forgot password link
  75  |       const forgotPasswordLink = page.getByRole("link", { name: /forgot|lupa/i });
  76  |       await expect(forgotPasswordLink).toBeVisible();
  77  |     });
  78  |   });
  79  |
  80  |   test.describe("Sign Up", () => {
  81  |     test("should display sign up form", async ({ page }) => {
  82  |       await page.goto(testRoutes.signUp);
  83  |
  84  |       // Check for name input (if present)
  85  |       const nameInput = page.locator(selectors.nameInput);
  86  |       const hasNameInput = await nameInput.count() > 0;
  87  |
  88  |       if (hasNameInput) {
  89  |         await expect(nameInput).toBeVisible();
  90  |       }
  91  |
  92  |       // Check for email input
  93  |       await expect(page.locator(selectors.emailInput)).toBeVisible();
  94  |
  95  |       // Check for password input
  96  |       await expect(page.locator(selectors.passwordInput)).toBeVisible();
  97  |
  98  |       // Check for submit button
  99  |       await expect(page.locator(selectors.submitButton)).toBeVisible();
  100 |     });
  101 |
  102 |     test("should show validation errors for invalid email", async ({ page }) => {
  103 |       await page.goto(testRoutes.signUp);
  104 |
  105 |       // Fill in invalid email
  106 |       await page.fill(selectors.emailInput, "invalid-email");
  107 |
  108 |       // Fill password
  109 |       await page.fill(selectors.passwordInput, "ValidPass123!");
  110 |
  111 |       // Try to submit
  112 |       await page.click(selectors.submitButton);
  113 |
  114 |       // Check for validation error
  115 |       await page.waitForTimeout(500);
  116 |       const emailInput = page.locator(selectors.emailInput);
  117 |       const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => {
  118 |         return el.validity && !el.validity.valid;
  119 |       });
  120 |
  121 |       expect(isInvalid).toBeTruthy();
  122 |     });
  123 |
  124 |     test("should show validation error for weak password", async ({ page }) => {
  125 |       await page.goto(testRoutes.signUp);
  126 |
  127 |       // Fill in email
  128 |       await page.fill(selectors.emailInput, "test@example.com");
  129 |
  130 |       // Fill in weak password
  131 |       await page.fill(selectors.passwordInput, "123");
  132 |
  133 |       // Try to submit
  134 |       await page.click(selectors.submitButton);
  135 |
  136 |       // Check for error
  137 |       await page.waitForTimeout(500);
  138 |       const passwordInput = page.locator(selectors.passwordInput);
  139 |       const isInvalid = await passwordInput.evaluate((el: HTMLInputElement) => {
  140 |         return el.validity && el.validity.tooShort;
  141 |       });
  142 |
  143 |       // Password might be validated on server side too
  144 |       // Just check we're still on sign-up page
  145 |       const currentUrl = page.url();
  146 |       expect(currentUrl).toContain("/sign-up");
  147 |     });
  148 |
  149 |     test("should redirect to sign in after successful registration", async ({ page }) => {
  150 |       // Generate unique user
  151 |       const uniqueEmail = `test-${Date.now()}@example.com`;
  152 |
  153 |       await page.goto(testRoutes.signUp);
  154 |
  155 |       // Fill in registration form
  156 |       const nameInput = page.locator(selectors.nameInput);
  157 |       const hasNameInput = await nameInput.count() > 0;
  158 |
  159 |       if (hasNameInput) {
  160 |         await nameInput.fill("Test User");
  161 |       }
  162 |
  163 |       await page.fill(selectors.emailInput, uniqueEmail);
  164 |       await page.fill(selectors.passwordInput, "TestPass123!");
  165 |
  166 |       // Submit form
  167 |       await page.click(selectors.submitButton);
  168 |
  169 |       // Wait for redirect (either to sign-in or dashboard)
  170 |       await page.waitForTimeout(2000);
  171 |       const currentUrl = page.url();
  172 |       expect(
  173 |         currentUrl.includes("/sign-in") || currentUrl.includes("/dashboard")
> 174 |       ).toBeTruthy();
      |         ^ Error: expect(received).toBeTruthy()
  175 |     });
  176 |
  177 |     test("should have link to sign in page", async ({ page }) => {
  178 |       await page.goto(testRoutes.signUp);
  179 |
  180 |       // Look for sign in link
  181 |       const signInLink = page.getByRole("link", { name: /sign in|login|masuk/i });
  182 |       await expect(signInLink).toBeVisible();
  183 |     });
  184 |   });
  185 |
  186 |   test.describe("Forgot Password", () => {
  187 |     test("should display forgot password form", async ({ page }) => {
  188 |       await page.goto(testRoutes.forgotPassword);
  189 |
  190 |       // Check for email input
  191 |       await expect(page.locator(selectors.emailInput)).toBeVisible();
  192 |
  193 |       // Check for submit button
  194 |       await expect(page.locator(selectors.submitButton)).toBeVisible();
  195 |     });
  196 |
  197 |     test("should show validation error for empty email", async ({ page }) => {
  198 |       await page.goto(testRoutes.forgotPassword);
  199 |
  200 |       // Try to submit without email
  201 |       await page.click(selectors.submitButton);
  202 |
  203 |       // Check for error
  204 |       await page.waitForTimeout(500);
  205 |       const emailInput = page.locator(selectors.emailInput);
  206 |       const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => {
  207 |         return el.validity && el.validity.valueMissing;
  208 |       });
  209 |
  210 |       expect(isInvalid).toBeTruthy();
  211 |     });
  212 |
  213 |     test("should submit reset request successfully", async ({ page }) => {
  214 |       await page.goto(testRoutes.forgotPassword);
  215 |
  216 |       // Fill in email
  217 |       await page.fill(selectors.emailInput, testUsers.admin.email);
  218 |
  219 |       // Submit form
  220 |       await page.click(selectors.submitButton);
  221 |
  222 |       // Wait for success message or redirect
  223 |       await page.waitForTimeout(2000);
  224 |
  225 |       // Should show success message or redirect to sign-in
  226 |       const currentUrl = page.url();
  227 |       const hasSuccessMessage = await page.getByText(/sent|email|link/i).count() > 0;
  228 |
  229 |       expect(
  230 |         currentUrl.includes("/sign-in") ||
  231 |         currentUrl.includes("/forgot-password") ||
  232 |         hasSuccessMessage
  233 |       ).toBeTruthy();
  234 |     });
  235 |
  236 |     test("should have link back to sign in", async ({ page }) => {
  237 |       await page.goto(testRoutes.forgotPassword);
  238 |
  239 |       // Look for sign in link
  240 |       const signInLink = page.getByRole("link", { name: /sign in|login|masuk|back/i });
  241 |       await expect(signInLink).toBeVisible();
  242 |     });
  243 |   });
  244 |
  245 |   test.describe("Authentication Flow", () => {
  246 |     test("should require authentication for protected routes", async ({ page }) => {
  247 |       // Try to access dashboard without authentication
  248 |       await page.goto(testRoutes.dashboard);
  249 |
  250 |       // Should redirect to sign in
  251 |       await page.waitForURL(/\/sign-in/, { timeout: 5000 });
  252 |       expect(page.url()).toContain("/sign-in");
  253 |     });
  254 |
  255 |     test("should persist session across page navigations", async ({ signIn, page }) => {
  256 |       // Sign in
  257 |       await signIn();
  258 |
  259 |       // Navigate to different pages
  260 |       await page.goto(testRoutes.dashboard);
  261 |       await page.waitForURL(/\/dashboard/, { timeout: 5000 });
  262 |
  263 |       await page.goto(testRoutes.tickets);
  264 |       await page.waitForTimeout(1000);
  265 |
  266 |       // Should still be authenticated (not redirected to sign-in)
  267 |       expect(page.url()).not.toContain("/sign-in");
  268 |     });
  269 |
  270 |     test("should allow sign out", async ({ signIn, signOut, page }) => {
  271 |       // Sign in
  272 |       await signIn();
  273 |
  274 |       // Verify we're on dashboard
```
