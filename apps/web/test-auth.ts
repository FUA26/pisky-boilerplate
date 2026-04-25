import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function testAuth() {
  const email = "admin@example.com"
  const password = "admin123"

  console.log("Testing authentication for:", email)

  const user = await prisma.user.findUnique({
    where: { email },
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
    console.log("User not found")
    return
  }

  if (!user.password) {
    console.log("User has no password set")
    return
  }

  const isValid = await bcrypt.compare(password, user.password)
  console.log("Password valid:", isValid)

  if (isValid) {
    const permissions = user.role.permissions
      .map((rp) => rp.permission?.name)
      .filter((p): p is string => p !== undefined)

    console.log("User:", user.email)
    console.log("Name:", user.name)
    console.log("Role:", user.role.name)
    console.log("Permissions:", permissions)
  }

  await prisma.$disconnect()
}

testAuth().catch(console.error)
