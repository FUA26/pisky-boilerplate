# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: settings/settings.spec.ts >> Settings >> Security Settings >> should have change password option
- Location: e2e/settings/settings.spec.ts:203:5

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
  112 |
  113 |         // Look for save button
  114 |         const saveButton = page.getByRole("button", { name: /save|simpan/i });
  115 |         const hasSaveButton = await saveButton.count() > 0;
  116 |
  117 |         if (hasSaveButton) {
  118 |           await saveButton.first().click();
  119 |           await page.waitForTimeout(1000);
  120 |         }
  121 |       }
  122 |     });
  123 |   });
  124 |
  125 |   test.describe("Theme Settings", () => {
  126 |     test("should have theme toggle", async ({ page }) => {
  127 |       await page.goto(testRoutes.dashboard);
  128 |
  129 |       // Look for theme toggle button
  130 |       const themeButton = page.getByRole("button", { name: /theme|dark|light|mode/i });
  131 |       const hasThemeButton = await themeButton.count() > 0;
  132 |
  133 |       if (hasThemeButton) {
  134 |         await expect(themeButton.first()).toBeVisible();
  135 |       }
  136 |     });
  137 |
  138 |     test("should toggle between light and dark mode", async ({ page }) => {
  139 |       await page.goto(testRoutes.dashboard);
  140 |
  141 |       const themeButton = page.getByRole("button", { name: /theme|dark|light|mode/i });
  142 |       const hasThemeButton = await themeButton.count() > 0;
  143 |
  144 |       if (hasThemeButton) {
  145 |         // Get initial theme
  146 |         const htmlBefore = page.locator("html");
  147 |         const classBefore = await htmlBefore.getAttribute("class");
  148 |
  149 |         // Click theme toggle
  150 |         await themeButton.first().click();
  151 |         await page.waitForTimeout(500);
  152 |
  153 |         // Get theme after toggle
  154 |         const htmlAfter = page.locator("html");
  155 |         const classAfter = await htmlAfter.getAttribute("class");
  156 |
  157 |         // Classes should be different
  158 |         expect(classBefore).not.toEqual(classAfter);
  159 |       }
  160 |     });
  161 |   });
  162 |
  163 |   test.describe("Notification Settings", () => {
  164 |     test("should display notification preferences", async ({ page }) => {
  165 |       await page.goto(testRoutes.settings);
  166 |
  167 |       // Look for notification section
  168 |       const notificationSection = page.getByText(/notification|notifikasi/i);
  169 |       const hasNotificationSection = await notificationSection.count() > 0;
  170 |
  171 |       if (hasNotificationSection) {
  172 |         await expect(notificationSection.first()).toBeVisible();
  173 |       }
  174 |     });
  175 |
  176 |     test("should allow toggling notification types", async ({ page }) => {
  177 |       await page.goto(testRoutes.settings);
  178 |
  179 |       // Look for notification toggles
  180 |       const emailNotificationToggle = page.getByRole("switch", { name: /email/i });
  181 |       const hasEmailToggle = await emailNotificationToggle.count() > 0;
  182 |
  183 |       if (hasEmailToggle) {
  184 |         await emailNotificationToggle.first().click();
  185 |         await page.waitForTimeout(500);
  186 |       }
  187 |     });
  188 |   });
  189 |
  190 |   test.describe("Security Settings", () => {
  191 |     test("should display security settings", async ({ page }) => {
  192 |       await page.goto(testRoutes.settings);
  193 |
  194 |       // Look for security section
  195 |       const securitySection = page.getByText(/security|keamanan/i);
  196 |       const hasSecuritySection = await securitySection.count() > 0;
  197 |
  198 |       if (hasSecuritySection) {
  199 |         await expect(securitySection.first()).toBeVisible();
  200 |       }
  201 |     });
  202 |
  203 |     test("should have change password option", async ({ page }) => {
  204 |       await page.goto(testRoutes.settings);
  205 |
  206 |       // Look for change password button/link
  207 |       const changePasswordButton = page.getByRole("button", { name: /change password|ubah kata sandi/i });
  208 |       const changePasswordLink = page.getByRole("link", { name: /change password|ubah kata sandi/i });
  209 |       const hasButton = await changePasswordButton.count() > 0;
  210 |       const hasLink = await changePasswordLink.count() > 0;
  211 |
> 212 |       expect(hasButton || hasLink).toBeTruthy();
      |                                    ^ Error: expect(received).toBeTruthy()
  213 |     });
  214 |   });
  215 |
  216 |   test.describe("Settings Validation", () => {
  217 |     test("should validate email settings format", async ({ page }) => {
  218 |       await page.goto(testRoutes.manage);
  219 |
  220 |       // Look for email settings input
  221 |       const emailInput = page.getByRole("textbox", { name: /email|contact email/i });
  222 |       const hasEmailInput = await emailInput.count() > 0;
  223 |
  224 |       if (hasEmailInput) {
  225 |         await emailInput.first().fill("invalid-email");
  226 |
  227 |         // Look for save button
  228 |         const saveButton = page.getByRole("button", { name: /save|simpan/i });
  229 |         const hasSaveButton = await saveButton.count() > 0;
  230 |
  231 |         if (hasSaveButton) {
  232 |           await saveButton.first().click();
  233 |           await page.waitForTimeout(500);
  234 |
  235 |           // Should show validation error
  236 |           const errorElement = page.locator(selectors.formError);
  237 |           const hasError = await errorElement.count() > 0;
  238 |
  239 |           if (hasError) {
  240 |             await expect(errorElement.first()).toBeVisible();
  241 |           }
  242 |         }
  243 |       }
  244 |     });
  245 |
  246 |     test("should validate site URL format", async ({ page }) => {
  247 |       await page.goto(testRoutes.manage);
  248 |
  249 |       // Look for site URL input
  250 |       const urlInput = page.getByRole("textbox", { name: /url|website/i });
  251 |       const hasUrlInput = await urlInput.count() > 0;
  252 |
  253 |       if (hasUrlInput) {
  254 |         await urlInput.first().fill("not-a-valid-url");
  255 |
  256 |         // Look for save button
  257 |         const saveButton = page.getByRole("button", { name: /save|simpan/i });
  258 |         const hasSaveButton = await saveButton.count() > 0;
  259 |
  260 |         if (hasSaveButton) {
  261 |           await saveButton.first().click();
  262 |           await page.waitForTimeout(500);
  263 |
  264 |           // Should show validation error
  265 |           const errorElement = page.locator(selectors.formError);
  266 |           const hasError = await errorElement.count() > 0;
  267 |
  268 |           if (hasError) {
  269 |             await expect(errorElement.first()).toBeVisible();
  270 |           }
  271 |         }
  272 |       }
  273 |     });
  274 |   });
  275 | });
  276 |
```
