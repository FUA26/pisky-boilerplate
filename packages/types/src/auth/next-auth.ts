import type { Permission, RoleWithPermissions } from "../rbac"
import type { DefaultSession } from "next-auth"
import "next-auth/jwt"

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
