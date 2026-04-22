// apps/web/lib/services/permission-service.ts
import { prisma } from "@/lib/prisma"

export interface PermissionStats {
  total: number
  byCategory: Record<string, number>
  unused: number
}

export const permissionService = {
  async listPermissions(options?: { includeUsage?: boolean }) {
    const include = options?.includeUsage
      ? {
          _count: {
            select: { rolePermissions: true },
          },
        }
      : {}

    return prisma.permission.findMany({
      include,
      orderBy: [{ category: "asc" }, { name: "asc" }],
    })
  },

  async getPermissionById(id: string) {
    return prisma.permission.findUnique({
      where: { id },
    })
  },

  async createPermission(data: {
    name: string
    category: string
    description?: string
  }) {
    // Check if permission with this name already exists
    const existing = await prisma.permission.findUnique({
      where: { name: data.name },
    })

    if (existing) {
      throw new Error(`Permission with name "${data.name}" already exists`)
    }

    return prisma.permission.create({
      data: {
        name: data.name,
        category: data.category,
        description: data.description || null,
      },
    })
  },

  async updatePermission(
    id: string,
    data: { name?: string; category?: string; description?: string }
  ) {
    const existing = await prisma.permission.findUnique({
      where: { id },
    })

    if (!existing) {
      throw new Error(`Permission with ID "${id}" not found`)
    }

    // If updating name, check for conflicts
    if (data.name && data.name !== existing.name) {
      const nameConflict = await prisma.permission.findUnique({
        where: { name: data.name },
      })

      if (nameConflict) {
        throw new Error(`Permission with name "${data.name}" already exists`)
      }
    }

    return prisma.permission.update({
      where: { id },
      data: {
        name: data.name,
        category: data.category,
        description:
          data.description !== undefined
            ? data.description
            : existing.description,
      },
    })
  },

  async deletePermission(id: string) {
    const existing = await prisma.permission.findUnique({
      where: { id },
      include: {
        _count: {
          select: { rolePermissions: true },
        },
      },
    })

    if (!existing) {
      throw new Error(`Permission with ID "${id}" not found`)
    }

    const usageCount = existing._count.rolePermissions
    if (usageCount > 0) {
      throw new Error(
        `Cannot delete permission "${existing.name}" - it is assigned to ${usageCount} role(s). Remove it from roles first.`
      )
    }

    return prisma.permission.delete({
      where: { id },
    })
  },

  async getPermissionStats(): Promise<PermissionStats> {
    const [total, unused, byCategory] = await Promise.all([
      prisma.permission.count(),
      prisma.permission.count({
        where: {
          rolePermissions: {
            none: {},
          },
        },
      }),
      prisma.permission.groupBy({
        by: ["category"],
        _count: true,
      }),
    ])

    const categoryMap: Record<string, number> = {}
    for (const cat of byCategory) {
      categoryMap[cat.category] = cat._count
    }

    return {
      total,
      unused,
      byCategory: categoryMap,
    }
  },

  async getCategories(): Promise<string[]> {
    const permissions = await prisma.permission.findMany({
      select: { category: true },
      distinct: ["category"],
      orderBy: { category: "asc" },
    })

    return permissions.map((p) => p.category)
  },
}
