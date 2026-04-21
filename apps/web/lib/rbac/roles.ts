import { prisma } from "@/lib/prisma"
import type { Permission, RoleName } from "@workspace/types"

const DEFAULT_PERMISSIONS: Record<RoleName, Permission[]> = {
  ADMIN: [
    "USER_READ",
    "USER_CREATE",
    "USER_UPDATE",
    "USER_DELETE",
    "ROLE_READ",
    "ROLE_CREATE",
    "ROLE_UPDATE",
    "ROLE_DELETE",
    "PERMISSION_READ",
    "PERMISSION_ASSIGN",
    "FILE_UPLOAD",
    "FILE_READ",
    "FILE_DELETE",
    "DASHBOARD_ACCESS",
  ],
  USER: ["DASHBOARD_ACCESS"],
  MODERATOR: [
    "USER_READ",
    "ROLE_READ",
    "PERMISSION_READ",
    "FILE_UPLOAD",
    "FILE_READ",
    "DASHBOARD_ACCESS",
  ],
}

export async function seedRoles() {
  const existingRoles = await prisma.role.findMany()

  if (existingRoles.length > 0) {
    return existingRoles
  }

  const roles = await Promise.all(
    Object.entries(DEFAULT_PERMISSIONS).map(async ([name, permissions]) => {
      return prisma.role.upsert({
        where: { name },
        update: {},
        create: {
          name,
          permissions: {
            connectOrCreate: permissions.map((p) => ({
              where: { name: p },
              create: {
                name: p,
                category: p.split("_")[0],
              },
            })),
          },
        },
        include: { permissions: true },
      })
    })
  )

  return roles
}

export async function getDefaultRole() {
  return prisma.role.findUnique({
    where: { name: "USER" },
  })
}

export async function getAdminRole() {
  return prisma.role.findUnique({
    where: { name: "ADMIN" },
  })
}
