export type Permission = string

export interface PermissionCheckResult {
  can: boolean
  reason?: string
}

export interface RoleWithPermissions {
  id: string
  name: string
  permissions: Permission[]
}
