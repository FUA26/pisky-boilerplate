import { prisma } from "@/lib/prisma"

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

    // Invalidate all users with this role
    const users = await prisma.user.findMany({
      where: { roleId: id },
      select: { id: true },
    })

    for (const user of users) {
      await prisma.permissionCache.delete({ where: { userId: user.id } })
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
}
