/**
 * Test data utilities for E2E tests
 */

export const testUsers = {
  admin: {
    email: "admin@example.com",
    password: "admin123",
    name: "Admin",
  },
  regular: {
    email: "user@example.com",
    password: "user123",
    name: "Regular User",
  },
  new: {
    email: `test-${Date.now()}@example.com`,
    password: "newuser123",
    name: "New Test User",
  },
}

export const testRoutes = {
  landing: "/",
  signIn: "/sign-in",
  signUp: "/sign-up",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  // Dashboard routes (protected, regular user)
  dashboard: "/dashboard/dashboard",
  dashboardHome: "/dashboard",
  tickets: "/dashboard/tickets",
  tasks: "/dashboard/tasks",
  apps: "/dashboard/apps",
  profile: "/dashboard/profile",
  settings: "/dashboard/settings",
  accessRequests: "/dashboard/access-requests",
  analytics: "/dashboard/analytics",
  systemSettings: "/dashboard/manage/system-settings",
  // Backoffice routes (admin)
  backoffice: "/backoffice",
  backofficeDashboard: "/backoffice/dashboard",
  manage: "/backoffice/manage",
  accessManagement: "/backoffice/access-management",
  users: "/backoffice/access-management/users",
  roles: "/backoffice/access-management/roles",
  permissions: "/backoffice/access-management/permissions",
  manageUsers: "/backoffice/manage/users",
  manageRoles: "/backoffice/manage/roles",
  managePermissions: "/backoffice/manage/permissions",
  backofficeSettings: "/backoffice/settings",
}

export const selectors = {
  // Auth
  emailInput: 'input[name="email"], input[type="email"]',
  passwordInput: 'input[name="password"], input[type="password"]',
  nameInput: 'input[name="name"]',
  submitButton: 'button[type="submit"]',
  signInButton: 'button:has-text("Sign In"), button:has-text("Masuk")',
  signUpButton: 'button:has-text("Sign Up"), button:has-text("Daftar")',
  signOutButton: 'button:has-text("Sign Out"), button:has-text("Keluar")',
  forgotPasswordLink: 'a:has-text("Forgot"), a:has-text("Lupa")',

  // Navigation
  navigationMenu: 'nav, [role="navigation"]',
  sidebar: '[role="navigation"], aside',
  mobileMenuButton: 'button[aria-label="menu"], button:has-text("Menu")',

  // Dashboard
  dashboardHeading: 'h1:has-text("Dashboard"), h1:has-text("Dasbor")',
  statsCard: '[class*="stat"], [class*="card"]',

  // Tickets
  ticketsList: '[data-testid="tickets-list"], .tickets-list, table',
  ticketItem: '[data-testid="ticket-item"], .ticket-item, tr',
  createTicketButton:
    'button:has-text("Create"), button:has-text("New"), button:has-text("Buat")',

  // Tasks
  tasksList: '[data-testid="tasks-list"], .tasks-list',
  taskItem: '[data-testid="task-item"], .task-item',
  createTaskButton:
    'button:has-text("Create Task"), button:has-text("New Task")',

  // Tables
  table: "table",
  tableRow: "tr",
  tableCell: "td, th",
  pagination: '[role="navigation"][aria-label*="pagination"], .pagination',

  // Forms
  formInput: "input, textarea",
  formSelect: "select",
  formError: ".error, [role='alert']",
  formSuccess: ".success, [class*='success']",

  // Loading
  loadingSpinner: '[role="status"], .spinner, .loading',
  skeleton: ".skeleton",

  // Toast/Notifications
  toast: '[role="alert"], .toast, .notification',
}

export async function generateUniqueEmail(): Promise<string> {
  return `test-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`
}

export async function generateUniquePassword(): Promise<string> {
  const base = "testpass123"
  const random = Math.random().toString(36).substring(7)
  return `${base}${random}`
}
