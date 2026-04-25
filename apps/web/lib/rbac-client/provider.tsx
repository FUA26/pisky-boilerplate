"use client"

import { createContext, useContext, type ReactNode } from "react"
import type { Permission } from "@workspace/types/rbac"

interface PermissionsContextValue {
  permissions: Permission[]
}

const PermissionsContext = createContext<PermissionsContextValue | null>({
  permissions: [],
})

export function PermissionsProvider({
  permissions,
  children,
}: {
  permissions?: Permission[]
  children: ReactNode
}) {
  return (
    <PermissionsContext.Provider value={{ permissions: permissions ?? [] }}>
      {children}
    </PermissionsContext.Provider>
  )
}

export function usePermissions() {
  return useContext(PermissionsContext)
}
