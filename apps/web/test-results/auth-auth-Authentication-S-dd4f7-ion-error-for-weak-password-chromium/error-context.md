# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth/auth.spec.ts >> Authentication >> Sign Up >> should show validation error for weak password
- Location: e2e/auth/auth.spec.ts:124:5

# Error details

```
Error: locator.evaluate: Error: strict mode violation: locator('input[name="password"], input[type="password"]') resolved to 2 elements:
    1) <input id="password" type="password" name="password" aria-invalid="true" placeholder="••••••••" autocomplete="new-password" aria-describedby="signup-wua3a8u-password-error" class="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 pr-8 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity…/> aka getByRole('textbox', { name: 'Password', exact: true })
    2) <input type="password" aria-invalid="true" id="confirm-password" placeholder="••••••••" name="confirmPassword" autocomplete="new-password" aria-describedby="signup-wua3a8u-confirmPassword-error" class="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 pr-8 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-inp…/> aka getByRole('textbox', { name: 'Confirm Password' })

Call log:
  - waiting for locator('input[name="password"], input[type="password"]')

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
                - textbox "Name" [active] [ref=e31]:
                    - /placeholder: Your name
                - paragraph [ref=e32]: Name must be at least 2 characters
            - group [ref=e33]:
                - generic [ref=e34]: Email
                - textbox "Email" [ref=e35]:
                    - /placeholder: you@example.com
                    - text: test@example.com
            - group [ref=e36]:
                - generic [ref=e37]: Password
                - generic [ref=e38]:
                    - textbox "Password" [ref=e39]:
                        - /placeholder: ••••••••
                        - text: "123"
                    - button "Show password" [ref=e40]:
                        - img
                        - generic [ref=e41]: Show password
                - paragraph [ref=e42]: Password must be at least 8 characters
            - group [ref=e43]:
                - generic [ref=e44]: Confirm Password
                - generic [ref=e45]:
                    - textbox "Confirm Password" [ref=e46]:
                        - /placeholder: ••••••••
                    - button "Show password" [ref=e47]:
                        - img
                        - generic [ref=e48]: Show password
                - paragraph [ref=e49]: Please confirm your password
            - group [ref=e50]:
                - button "Create account" [ref=e51]
            - paragraph [ref=e52]:
                - text: Already have an account?
                - link "Sign in" [ref=e53] [cursor=pointer]:
                    - /url: /sign-in
    - region "Notifications alt+T"
    - button "Open Next.js Dev Tools" [ref=e59] [cursor=pointer]:
        - img [ref=e60]
    - alert [ref=e63]
```

# Test source

```ts
  39  |     test("should show error for invalid credentials", async ({ page }) => {
  40  |       await page.goto(testRoutes.signIn);
  41  |
  42  |       // Fill in invalid credentials
  43  |       await page.fill(selectors.emailInput, "invalid@example.com");
  44  |       await page.fill(selectors.passwordInput, "WrongPassword123!");
  45  |
  46  |       // Submit form
  47  |       await page.click(selectors.submitButton);
  48  |
  49  |       // Check for error message or stay on sign-in page
  50  |       await page.waitForTimeout(1000);
  51  |       const currentUrl = page.url();
  52  |       expect(currentUrl).toContain("/sign-in");
  53  |     });
  54  |
  55  |     test("should redirect to dashboard after successful sign in", async ({ signIn }) => {
  56  |       // Sign in using fixture
  57  |       await signIn({ email: testUsers.admin.email, password: testUsers.admin.password });
  58  |
  59  |       // Should be redirected to dashboard or backoffice
  60  |       // This is handled by the signIn fixture
  61  |     });
  62  |
  63  |     test("should have link to sign up page", async ({ page }) => {
  64  |       await page.goto(testRoutes.signIn);
  65  |
  66  |       // Look for sign up link
  67  |       const signUpLink = page.getByRole("link", { name: /sign up|register|daftar/i });
  68  |       await expect(signUpLink).toBeVisible();
  69  |     });
  70  |
  71  |     test("should have link to forgot password page", async ({ page }) => {
  72  |       await page.goto(testRoutes.signIn);
  73  |
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
> 139 |       const isInvalid = await passwordInput.evaluate((el: HTMLInputElement) => {
      |                                             ^ Error: locator.evaluate: Error: strict mode violation: locator('input[name="password"], input[type="password"]') resolved to 2 elements:
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
```
