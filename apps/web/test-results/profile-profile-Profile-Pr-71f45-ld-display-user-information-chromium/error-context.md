# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: profile/profile.spec.ts >> Profile >> Profile Page >> should display user information
- Location: e2e/profile/profile.spec.ts:19:5

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
  4   | test.describe("Profile", () => {
  5   |   // Sign in before each test
  6   |   test.beforeEach(async ({ signIn }) => {
  7   |     await signIn({ email: testUsers.admin.email, password: testUsers.admin.password });
  8   |   });
  9   |
  10  |   test.describe("Profile Page", () => {
  11  |     test("should display profile page", async ({ page }) => {
  12  |       await page.goto(testRoutes.profile);
  13  |
  14  |       // Check for page heading
  15  |       const heading = page.getByRole("heading", { level: 1 });
  16  |       await expect(heading).toBeVisible();
  17  |     });
  18  |
  19  |     test("should display user information", async ({ page }) => {
  20  |       await page.goto(testRoutes.profile);
  21  |
  22  |       // Check for user name display
  23  |       const nameHeading = page.getByRole("heading", { name: testUsers.admin.name });
  24  |       const nameText = page.getByText(testUsers.admin.name);
  25  |       const hasNameHeading = await nameHeading.count() > 0;
  26  |       const hasNameText = await nameText.count() > 0;
  27  |
> 28  |       expect(hasNameHeading || hasNameText).toBeTruthy();
      |                                             ^ Error: expect(received).toBeTruthy()
  29  |     });
  30  |
  31  |     test("should display user email", async ({ page }) => {
  32  |       await page.goto(testRoutes.profile);
  33  |
  34  |       // Check for email display
  35  |       const emailText = page.getByText(testUsers.admin.email);
  36  |       const emailLabel = page.getByText(/email/i);
  37  |       const hasEmailText = await emailText.count() > 0;
  38  |       const hasEmailLabel = await emailLabel.count() > 0;
  39  |
  40  |       expect(hasEmailText || hasEmailLabel).toBeTruthy();
  41  |     });
  42  |
  43  |     test("should display avatar or placeholder", async ({ page }) => {
  44  |       await page.goto(testRoutes.profile);
  45  |
  46  |       // Check for avatar image or placeholder
  47  |       const avatar = page.locator("img[alt*=\"avatar\"], img[alt*=\"profile\"]");
  48  |       const avatarPlaceholder = page.locator("[data-testid=\"avatar\"], .avatar, [class*=\"avatar\"]");
  49  |       const hasAvatar = await avatar.count() > 0;
  50  |       const hasPlaceholder = await avatarPlaceholder.count() > 0;
  51  |
  52  |       expect(hasAvatar || hasPlaceholder).toBeTruthy();
  53  |     });
  54  |   });
  55  |
  56  |   test.describe("Profile Editing", () => {
  57  |     test("should allow editing profile name", async ({ page }) => {
  58  |       await page.goto(testRoutes.profile);
  59  |
  60  |       // Look for edit button
  61  |       const editButton = page.getByRole("button", { name: /edit|ubah|profil/i });
  62  |       const hasEditButton = await editButton.count() > 0;
  63  |
  64  |       if (hasEditButton) {
  65  |         await editButton.first().click();
  66  |         await page.waitForTimeout(500);
  67  |
  68  |         // Check for name input
  69  |         const nameInput = page.getByRole("textbox", { name: /name|nama/i });
  70  |         const hasNameInput = await nameInput.count() > 0;
  71  |
  72  |         if (hasNameInput) {
  73  |           await nameInput.first().fill(`Updated Name ${Date.now()}`);
  74  |
  75  |           // Save changes
  76  |           const saveButton = page.getByRole("button", { name: /save|simpan|update/i });
  77  |           await saveButton.first().click();
  78  |           await page.waitForTimeout(1000);
  79  |
  80  |           // Check for success message
  81  |           const toast = page.locator(selectors.toast);
  82  |           const hasToast = await toast.count() > 0;
  83  |
  84  |           if (hasToast) {
  85  |             await expect(toast.first()).toBeVisible();
  86  |           }
  87  |         }
  88  |       }
  89  |     });
  90  |
  91  |     test("should allow editing profile bio if available", async ({ page }) => {
  92  |       await page.goto(testRoutes.profile);
  93  |
  94  |       // Look for edit button
  95  |       const editButton = page.getByRole("button", { name: /edit|ubah/i });
  96  |       const hasEditButton = await editButton.count() > 0;
  97  |
  98  |       if (hasEditButton) {
  99  |         await editButton.first().click();
  100 |         await page.waitForTimeout(500);
  101 |
  102 |         // Check for bio input
  103 |         const bioInput = page.getByRole("textbox", { name: /bio|about|tentang/i });
  104 |         const hasBioInput = await bioInput.count() > 0;
  105 |
  106 |         if (hasBioInput) {
  107 |           await bioInput.first().fill("Updated bio from E2E test");
  108 |
  109 |           // Save changes
  110 |           const saveButton = page.getByRole("button", { name: /save|simpan/i });
  111 |           await saveButton.first().click();
  112 |           await page.waitForTimeout(1000);
  113 |         }
  114 |       }
  115 |     });
  116 |   });
  117 |
  118 |   test.describe("Avatar Upload", () => {
  119 |     test("should have avatar upload option", async ({ page }) => {
  120 |       await page.goto(testRoutes.profile);
  121 |
  122 |       // Look for upload button
  123 |       const uploadButton = page.getByRole("button", { name: /upload|change avatar|ubah foto/i });
  124 |       const hasUploadButton = await uploadButton.count() > 0;
  125 |
  126 |       if (hasUploadButton) {
  127 |         await expect(uploadButton.first()).toBeVisible();
  128 |       }
```
