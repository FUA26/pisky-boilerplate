"use client"

import { useSession } from "next-auth/react"
import type { Permission } from "@workspace/types"

export function useCan() {
  const { data: session } = useSession()

  const can = (permission: Permission): boolean => {
    if (!session?.user) return false
    return session.user.permissions?.includes(permission) ?? false
  }

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some((p) => can(p))
  }

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every((p) => can(p))
  }

  return {
    can,
    hasAnyPermission,
    hasAllPermissions,
    isAdmin: session?.user?.role?.name === "ADMIN",
    isAuthenticated: !!session?.user,
  }
}
