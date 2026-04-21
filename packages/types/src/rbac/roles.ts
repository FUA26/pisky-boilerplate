export type RoleName = "ADMIN" | "USER" | "MODERATOR"

export interface RoleData {
  name: RoleName
  permissions: string[]
}
