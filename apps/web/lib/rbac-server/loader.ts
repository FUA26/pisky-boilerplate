import { prisma } from "@/lib/prisma"
import { getPermissions } from "@/lib/rbac/permissions"
import type { Permission } from "@workspace/types"

export async function loadUserPermissions(
  userId: string
): Promise<Permission[]> {
  return getPermissions(userId)
}

export async function invalidateUserPermissions(userId: string): Promise<void> {
  await prisma.permissionCache.deleteMany({ where: { userId } })
}

export async function invalidateAllPermissions(): Promise<void> {
  await prisma.permissionCache.deleteMany({})
}
