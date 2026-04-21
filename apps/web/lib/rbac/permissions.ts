import { cache } from "react"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth/config"
import type { Permission } from "@workspace/types"

export async function requireAuth() {
  const session = await auth()
  if (!session?.user) {
    throw new Error("Unauthorized")
  }
  return session
}

export const getPermissions = cache(
  async (userId: string): Promise<Permission[]> => {
    // Check cache first (5 minute TTL)
    const cached = await prisma.permissionCache.findUnique({
      where: { userId },
    })

    if (cached && Date.now() - cached.updatedAt.getTime() < 5 * 60 * 1000) {
      return cached.permissions as Permission[]
    }

    // Fetch fresh permissions
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    })

    if (!user || !user.role) {
      return []
    }

    const permissions = user.role.permissions.map((p) => p.name as Permission)

    // Update cache
    await prisma.permissionCache.upsert({
      where: { userId },
      update: { permissions: permissions as string[] },
      create: { userId, permissions: permissions as string[] },
    })

    return permissions
  }
)

export async function requirePermission(
  userId: string,
  permission: Permission
): Promise<void> {
  const permissions = await getPermissions(userId)

  if (!permissions.includes(permission)) {
    throw new Error(`Missing required permission: ${permission}`)
  }
}

export async function hasPermission(
  userId: string,
  permission: Permission
): Promise<boolean> {
  const permissions = await getPermissions(userId)
  return permissions.includes(permission)
}

export async function invalidatePermissionCache(userId: string): Promise<void> {
  await prisma.permissionCache.upsert({
    where: { userId },
    update: { updatedAt: new Date(0) }, // Force refresh
    create: { userId, permissions: [] },
  })
}
