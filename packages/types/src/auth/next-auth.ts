import type { Permission, RoleWithPermissions } from "../rbac"
import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: RoleWithPermissions
      permissions: Permission[]
    } & DefaultSession["user"]
  }

  interface User {
    role: RoleWithPermissions
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: RoleWithPermissions
  }
}
