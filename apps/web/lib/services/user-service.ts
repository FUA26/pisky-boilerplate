import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/lib/auth/password"
import { getDefaultRole } from "./role-service"
import { invalidatePermissionCache } from "@/lib/rbac/permissions"

export interface CreateUserInput {
  email: string
  name?: string
  password: string
  roleId?: string
}

export interface UpdateUserInput {
  name?: string
  email?: string
  roleId?: string
}

export interface ListUsersOptions {
  page?: number
  pageSize?: number
  search?: string
}

export const userService = {
  async listUsers({ page = 1, pageSize = 10, search }: ListUsersOptions = {}) {
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { role: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ])

    return {
      users,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    }
  },

  async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: { role: { include: { permissions: true } } },
    })
  },

  async createUser(data: CreateUserInput) {
    const defaultRole = data.roleId
      ? await prisma.role.findUnique({ where: { id: data.roleId } })
      : await getDefaultRole()

    if (!defaultRole) {
      throw new Error("Default role not found")
    }

    const hashedPassword = await hashPassword(data.password)

    return prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
        roleId: defaultRole.id,
      },
      include: { role: true },
    })
  },

  async updateUser(id: string, data: UpdateUserInput) {
    const user = await prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        roleId: data.roleId,
      },
      include: { role: true },
    })

    // Invalidate permission cache if role changed
    if (data.roleId) {
      await invalidatePermissionCache(id)
    }

    return user
  },

  async deleteUser(id: string) {
    return prisma.user.delete({
      where: { id },
    })
  },

  async getUserPermissions(userId: string) {
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

    return user?.role.permissions.map((p) => p.name) ?? []
  },
}
