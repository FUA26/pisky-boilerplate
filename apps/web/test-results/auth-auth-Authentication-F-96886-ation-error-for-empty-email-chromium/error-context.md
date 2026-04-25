# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth/auth.spec.ts >> Authentication >> Forgot Password >> should show validation error for empty email
- Location: e2e/auth/auth.spec.ts:197:5

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
                - heading "Reset your password" [level=1] [ref=e27]
                - paragraph [ref=e28]: Enter your email and we'll send you a reset link
            - group [ref=e29]:
                - generic [ref=e30]: Email
                - textbox "Email" [active] [ref=e31]:
                    - /placeholder: you@example.com
                - paragraph [ref=e32]: Email is required
            - group [ref=e33]:
                - button "Send reset link" [ref=e34]
            - paragraph [ref=e35]:
                - link "Back to sign in" [ref=e36] [cursor=pointer]:
                    - /url: /sign-in
    - region "Notifications alt+T"
    - button "Open Next.js Dev Tools" [ref=e42] [cursor=pointer]:
        - img [ref=e43]
    - alert [ref=e46]
```

# Test source

```ts
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
  174 |       ).toBeTruthy();
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
> 210 |       expect(isInvalid).toBeTruthy();
      |                         ^ Error: expect(received).toBeTruthy()
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
  275 |       expect(page.url()).toMatch(/\/(dashboard|backoffice)/);
  276 |
  277 |       // Sign out
  278 |       await signOut();
  279 |
  280 |       // Should be on sign in page
  281 |       expect(page.url()).toContain("/sign-in");
  282 |
  283 |       // Try to access protected route
  284 |       await page.goto(testRoutes.dashboard);
  285 |
  286 |       // Should redirect to sign in again
  287 |       await page.waitForURL(/\/sign-in/, { timeout: 5000 });
  288 |     });
  289 |   });
  290 | });
  291 |
```
