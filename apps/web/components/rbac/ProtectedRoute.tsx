import { auth } from "@/lib/auth/config"
import { getPermissions } from "@/lib/rbac/permissions"
import { redirect } from "next/navigation"
import type { ReactNode } from "react"

interface ProtectedRouteProps {
  permissions: string[]
  children: ReactNode
}

export async function ProtectedRoute({
  permissions,
  children,
}: ProtectedRouteProps) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const userPermissions = await getPermissions(session.user.id)
  const allowed = permissions.every((permission) =>
    userPermissions.includes(permission as never)
  )

  if (!allowed) {
    redirect("/no-access")
  }

  return <>{children}</>
}
