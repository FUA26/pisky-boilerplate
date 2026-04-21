export type Permission =
  // User permissions
  | "USER_READ"
  | "USER_CREATE"
  | "USER_UPDATE"
  | "USER_DELETE"
  // Role permissions
  | "ROLE_READ"
  | "ROLE_CREATE"
  | "ROLE_UPDATE"
  | "ROLE_DELETE"
  // Permission permissions
  | "PERMISSION_READ"
  | "PERMISSION_ASSIGN"
  // File permissions
  | "FILE_UPLOAD"
  | "FILE_READ"
  | "FILE_DELETE"
  // Dashboard
  | "DASHBOARD_ACCESS"

export interface PermissionCheckResult {
  can: boolean
  reason?: string
}

export interface RoleWithPermissions {
  id: string
  name: string
  permissions: Permission[]
}
