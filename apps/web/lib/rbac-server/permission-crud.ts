import { permissionService } from "@/lib/services/permission-service"
import { prisma } from "@/lib/prisma"
import {
  invalidateAllPermissions,
  invalidateUserPermissions,
} from "@/lib/rbac-server/loader"

export const createPermission =
  permissionService.createPermission.bind(permissionService)
export const getPermissionStats =
  permissionService.getPermissionStats.bind(permissionService)
export const getPermissionById =
  permissionService.getPermissionById.bind(permissionService)
export const updatePermission =
  permissionService.updatePermission.bind(permissionService)
export const deletePermission =
  permissionService.deletePermission.bind(permissionService)

export async function getAllPermissions(options?: {
  category?: string
  search?: string
  includeUsage?: boolean
}) {
  const permissions = await prisma.permission.findMany({
    where: {
      ...(options?.category ? { category: options.category } : {}),
      ...(options?.search
        ? {
            name: {
              contains: options.search,
              mode: "insensitive",
            },
          }
        : {}),
    },
    include: options?.includeUsage
      ? {
          _count: {
            select: {
              rolePermissions: true,
            },
          },
        }
      : undefined,
    orderBy: [{ category: "asc" }, { name: "asc" }],
  })

  return permissions.map((permission) => ({
    ...permission,
    category: permission.category?.toUpperCase() ?? permission.category,
  }))
}

export async function getPermissionUsageCount(permissionId: string) {
  return prisma.rolePermission.count({ where: { permissionId } })
}

export { invalidateAllPermissions, invalidateUserPermissions }
