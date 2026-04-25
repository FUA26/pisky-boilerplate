// Test the authorize function directly
import { PrismaClient } from "@prisma/client"
import { verifyPassword } from "./lib/auth/password"

const prisma = new PrismaClient()

async function testAuthorize() {
  const credentials = {
    email: "admin@example.com",
    password: "admin123",
  }

  console.log("[AUTH] Attempting login for:", credentials.email)

  const user = await prisma.user.findUnique({
    where: { email: credentials.email },
    include: {
      role: {
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      },
    },
  })

  if (!user) {
    console.log("[AUTH] User not found:", credentials.email)
    return
  }

  if (!user.password) {
    console.log("[AUTH] User has no password set")
    return
  }

  console.log("[AUTH] User found, verifying password...")

  const isValid = await verifyPassword(credentials.password, user.password)

  if (!isValid) {
    console.log("[AUTH] Invalid password for:", credentials.email)
    return
  }

  console.log("[AUTH] Login successful for:", credentials.email)

  const permissions = user.role.permissions
    .map((rp) => rp.permission?.name)
    .filter((p): p is string => p !== undefined)

  console.log("[AUTH] Permissions loaded:", permissions.length)

  const authUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.avatarUrl ?? user.image,
    role: {
      id: user.role.id,
      name: user.role.name,
      permissions,
    },
  }

  console.log("[AUTH] Auth user object:", JSON.stringify(authUser, null, 2))

  await prisma.$disconnect()
}

testAuthorize().catch(console.error)
