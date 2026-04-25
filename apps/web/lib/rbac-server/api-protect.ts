import { type NextRequest, NextResponse } from "next/server"
import { getPermissions, requireAuth } from "@/lib/rbac/permissions"
import type { Permission } from "@workspace/types"

type AuthSession = Awaited<ReturnType<typeof requireAuth>>

export type ProtectedApiContext = {
  user: AuthSession["user"]
  permissions: { permissions: Permission[] }
}

type ProtectedHandler = (
  req: NextRequest,
  context: ProtectedApiContext,
  ...args: unknown[]
) => Promise<Response> | Response

function forbidden(message = "Forbidden") {
  return NextResponse.json({ error: message }, { status: 403 })
}

export function protectApiRoute({
  permissions = [],
  strict = true,
  handler,
}: {
  permissions?: Permission[]
  strict?: boolean
  handler: ProtectedHandler
}) {
  return async (req: NextRequest, ...args: unknown[]) => {
    try {
      const session = await requireAuth()
      const userPermissions = await getPermissions(session.user.id)

      const hasPermission = strict
        ? permissions.every((permission) =>
            userPermissions.includes(permission)
          )
        : permissions.length === 0 ||
          permissions.some((permission) => userPermissions.includes(permission))

      if (!hasPermission) {
        return forbidden()
      }

      return handler(
        req,
        { user: session.user, permissions: { permissions: userPermissions } },
        ...args
      )
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unauthorized"
      if (message === "Unauthorized") {
        return NextResponse.json({ error: message }, { status: 401 })
      }
      if (message === "Forbidden") {
        return NextResponse.json({ error: message }, { status: 403 })
      }
      return NextResponse.json(
        { error: message || "Internal Server Error" },
        { status: 500 }
      )
    }
  }
}
