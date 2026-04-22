import { prisma } from "@/lib/prisma"
import { invalidatePermissionCache } from "@/lib/rbac/permissions"

export interface CreateRoleInput {
  name: string
  permissionIds: string[]
}

export const roleService = {
  async listRoles() {
    return prisma.role.findMany({
      include: { permissions: true },
      orderBy: { name: "asc" },
    })
  },

  async getRoleById(id: string) {
    return prisma.role.findUnique({
      where: { id },
      include: { permissions: true },
    })
  },

  async createRole(data: CreateRoleInput) {
    return prisma.role.create({
      data: {
        name: data.name,
        permissions: {
          connect: data.permissionIds.map((id) => ({ id })),
        },
      },
      include: { permissions: true },
    })
  },

  async updateRole(id: string, data: CreateRoleInput) {
    // Update role name and permissions
    const role = await prisma.role.update({
      where: { id },
      data: {
        name: data.name,
        permissions: {
          set: [], // Clear existing
          connect: data.permissionIds.map((pid) => ({ id: pid })),
        },
      },
      include: { permissions: true },
    })

    // Invalidate permission caches for all users with this role
    const users = await prisma.user.findMany({
      where: { roleId: id },
      select: { id: true },
    })

    for (const user of users) {
      await invalidatePermissionCache(user.id)
    }

    return role
  },

  async deleteRole(id: string) {
    // Check if role is being used
    const userCount = await prisma.user.count({ where: { roleId: id } })
    if (userCount > 0) {
      throw new Error("Cannot delete role that is assigned to users")
    }

    return prisma.role.delete({
      where: { id },
    })
  },

  async getRoleStats() {
    const [total, rolesWithUsers] = await Promise.all([
      prisma.role.count(),
      prisma.role.findMany({
        where: {
          users: {
            some: {},
          },
        },
        select: { id: true },
      }),
    ])

    return {
      total,
      withUsers: rolesWithUsers.length,
      withoutUsers: total - rolesWithUsers.length,
    }
  },

  async cloneRole(sourceRoleId: string, newName: string) {
    // Check if source role exists
    const sourceRole = await prisma.role.findUnique({
      where: { id: sourceRoleId },
      include: {
        permissions: {
          select: {
            permissionId: true,
          },
        },
      },
    })

    if (!sourceRole) {
      throw new Error("Source role not found")
    }

    // Check if new name already exists
    const nameConflict = await prisma.role.findUnique({
      where: { name: newName },
    })

    if (nameConflict) {
      throw new Error("Role with this name already exists")
    }

    // Create cloned role with same permissions
    return prisma.role.create({
      data: {
        name: newName,
        permissions: {
          create: sourceRole.permissions.map((rp) => ({
            permissionId: rp.permissionId,
          })),
        },
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    })
  },

  async getRoleWithUserCount(id: string) {
    return prisma.role.findUnique({
      where: { id },
      include: {
        _count: {
          select: { users: true },
        },
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    })
  },
}
