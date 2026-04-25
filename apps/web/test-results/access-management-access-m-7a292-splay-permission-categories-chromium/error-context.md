# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: access-management/access-management.spec.ts >> Access Management >> Permissions Management >> should display permission categories
- Location: e2e/access-management/access-management.spec.ts:249:5

# Error details

```
Error: expect(received).toBeTruthy()

Received: false
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
                        - button "Access Management" [expanded] [ref=e62]:
                            - img [ref=e64]
                            - generic [ref=e67]: Access Management
                            - img [ref=e69]
                        - list [ref=e72]:
                            - listitem [ref=e73]:
                                - link "Users" [ref=e74] [cursor=pointer]:
                                    - /url: /backoffice/access-management/users
                                    - generic [ref=e75]: Users
                            - listitem [ref=e76]:
                                - link "Roles" [ref=e77] [cursor=pointer]:
                                    - /url: /backoffice/access-management/roles
                                    - generic [ref=e78]: Roles
                            - listitem [ref=e79]:
                                - link "Permissions" [ref=e80] [cursor=pointer]:
                                    - /url: /backoffice/access-management/permissions
                                    - generic [ref=e81]: Permissions
                            - listitem [ref=e82]:
                                - link "System Settings" [ref=e83] [cursor=pointer]:
                                    - /url: /backoffice/settings
                                    - generic [ref=e84]: System Settings
                    - listitem [ref=e85]:
                        - button "Account" [ref=e86]:
                            - img [ref=e88]
                            - generic [ref=e100]: Account
                            - img [ref=e102]
                    - listitem [ref=e104]:
                        - button "Demo" [ref=e105]:
                            - img [ref=e107]
                            - generic [ref=e110]: Demo
                            - img [ref=e112]
            - button "Toggle Sidebar" [ref=e114]
        - main [ref=e115]:
            - generic [ref=e116]:
                - generic [ref=e117]:
                    - button "Toggle Sidebar" [ref=e118]:
                        - img
                        - generic [ref=e119]: Toggle Sidebar
                    - navigation "breadcrumb":
                        - list
                - generic [ref=e120]:
                    - generic [ref=e121]:
                        - img [ref=e122]
                        - searchbox "Search..." [ref=e125]
                    - button "2 Notifications" [ref=e126]:
                        - img
                        - generic [ref=e127]: "2"
                        - generic [ref=e128]: Notifications
                    - button "U" [ref=e130]:
                        - generic [ref=e132]: U
                        - img
            - main [ref=e133]:
                - generic [ref=e136]:
                    - heading "Permission Management" [level=1] [ref=e137]
                    - paragraph [ref=e138]: Create and manage permissions for role-based access control
    - region "Notifications alt+T"
    - button "Open Next.js Dev Tools" [ref=e168] [cursor=pointer]:
        - img [ref=e169]
```

# Test source

```ts
  158 |
  159 |       // Check for page heading
  160 |       const heading = page.getByRole("heading", { level: 1 });
  161 |       await expect(heading).toBeVisible();
  162 |
  163 |       // Check for roles table or list
  164 |       const table = page.locator(selectors.table).first();
  165 |       const hasTable = await table.count() > 0;
  166 |
  167 |       if (hasTable) {
  168 |         await expect(table.first()).toBeVisible();
  169 |       }
  170 |     });
  171 |
  172 |     test("should have create role button if authorized", async ({ page }) => {
  173 |       await page.goto(testRoutes.roles);
  174 |
  175 |       // Check for create button
  176 |       const createButton = page.getByRole("button", { name: /create|new|add|baru|tambah/i });
  177 |       const hasCreateButton = await createButton.count() > 0;
  178 |
  179 |       if (hasCreateButton) {
  180 |         await expect(createButton.first()).toBeVisible();
  181 |       }
  182 |     });
  183 |
  184 |     test("should display role permissions", async ({ page }) => {
  185 |       await page.goto(testRoutes.roles);
  186 |
  187 |       const table = page.locator(selectors.table).first();
  188 |       const hasTable = await table.count() > 0;
  189 |
  190 |       if (hasTable) {
  191 |         // Click on first role to view details
  192 |         const firstRow = table.locator("tr").nth(1);
  193 |         const roleLink = firstRow.getByRole("link");
  194 |         const hasRoleLink = await roleLink.count() > 0;
  195 |
  196 |         if (hasRoleLink) {
  197 |           await roleLink.first().click();
  198 |           await page.waitForTimeout(1000);
  199 |
  200 |           // Should show role details with permissions
  201 |           const currentUrl = page.url();
  202 |           expect(currentUrl).toMatch(/\/roles\/[^/]+/);
  203 |         }
  204 |       }
  205 |     });
  206 |
  207 |     test("should allow editing role permissions", async ({ page }) => {
  208 |       await page.goto(testRoutes.roles);
  209 |
  210 |       const table = page.locator(selectors.table).first();
  211 |       const hasTable = await table.count() > 0;
  212 |
  213 |       if (hasTable) {
  214 |         // Look for edit button
  215 |         const editButton = table.locator("tr").nth(1).getByRole("button", { name: /edit|ubah|manage|kelola/i });
  216 |         const hasEditButton = await editButton.count() > 0;
  217 |
  218 |         if (hasEditButton) {
  219 |           await editButton.first().click();
  220 |           await page.waitForTimeout(500);
  221 |
  222 |           // Should open edit dialog or navigate to edit page
  223 |           const currentUrl = page.url();
  224 |           const hasDialog = await page.locator('[role="dialog"]').count() > 0;
  225 |
  226 |           expect(hasDialog || currentUrl.includes("/edit")).toBeTruthy();
  227 |         }
  228 |       }
  229 |     });
  230 |   });
  231 |
  232 |   test.describe("Permissions Management", () => {
  233 |     test("should display permissions list", async ({ page }) => {
  234 |       await page.goto(testRoutes.permissions);
  235 |
  236 |       // Check for page heading
  237 |       const heading = page.getByRole("heading", { level: 1 });
  238 |       await expect(heading).toBeVisible();
  239 |
  240 |       // Check for permissions table or list
  241 |       const table = page.locator(selectors.table).first();
  242 |       const hasTable = await table.count() > 0;
  243 |
  244 |       if (hasTable) {
  245 |         await expect(table.first()).toBeVisible();
  246 |       }
  247 |     });
  248 |
  249 |     test("should display permission categories", async ({ page }) => {
  250 |       await page.goto(testRoutes.permissions);
  251 |
  252 |       // Look for category sections or filters
  253 |       const categoryHeading = page.getByRole("heading", { level: 2 }).first();
  254 |       const categoryTab = page.getByRole("tab").first();
  255 |       const hasCategoryHeading = await categoryHeading.count() > 0;
  256 |       const hasCategoryTab = await categoryTab.count() > 0;
  257 |
> 258 |       expect(hasCategoryHeading || hasCategoryTab).toBeTruthy();
      |                                                    ^ Error: expect(received).toBeTruthy()
  259 |     });
  260 |
  261 |     test("should allow creating new permission if authorized", async ({ page }) => {
  262 |       await page.goto(testRoutes.permissions);
  263 |
  264 |       // Check for create button
  265 |       const createButton = page.getByRole("button", { name: /create|new|add|baru|tambah/i });
  266 |       const hasCreateButton = await createButton.count() > 0;
  267 |
  268 |       if (hasCreateButton) {
  269 |         await expect(createButton.first()).toBeVisible();
  270 |
  271 |         await createButton.first().click();
  272 |         await page.waitForTimeout(500);
  273 |
  274 |         // Should open create dialog
  275 |         const dialog = page.locator('[role="dialog"]');
  276 |         const hasDialog = await dialog.count() > 0;
  277 |
  278 |         if (hasDialog) {
  279 |           await expect(dialog.first()).toBeVisible();
  280 |         }
  281 |       }
  282 |     });
  283 |   });
  284 |
  285 |   test.describe("Access Control", () => {
  286 |     test("should restrict access for non-admin users", async ({ page, signIn }) => {
  287 |       // Sign out and sign in as regular user
  288 |       await page.goto("/sign-in");
  289 |       await signIn({ email: testUsers.regular.email, password: testUsers.regular.password });
  290 |
  291 |       // Try to access access management
  292 |       await page.goto(testRoutes.accessManagement);
  293 |
  294 |       // Should be redirected or show access denied
  295 |       await page.waitForTimeout(1000);
  296 |       const currentUrl = page.url();
  297 |       const hasAccessDenied = await page.getByText(/access denied|not authorized|unauthorized/i).count() > 0;
  298 |
  299 |       expect(
  300 |         currentUrl.includes("/sign-in") ||
  301 |         currentUrl.includes("/no-access") ||
  302 |         hasAccessDenied
  303 |       ).toBeTruthy();
  304 |     });
  305 |   });
  306 | });
  307 |
```
