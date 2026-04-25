import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function check() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, roleId: true },
  })
  console.log("Users:", JSON.stringify(users, null, 2))

  if (users.length > 0) {
    const user = await prisma.user.findFirst({
      where: { email: users[0].email },
      include: { role: true },
    })
    console.log("Password exists:", !!user?.password)
    if (user?.password) {
      console.log("Hash format:", user.password.substring(0, 10) + "...")
      const isBcrypt =
        user.password.startsWith("$2a$") || user.password.startsWith("$2b$")
      console.log("Is bcrypt format:", isBcrypt)
    }
    console.log("Role:", user?.role)
  } else {
    console.log("No users found. Creating test user...")
    const password = await bcrypt.hash("password123", 10)
    const role = await prisma.role.findFirst()
    if (!role) {
      console.log("No roles found. Creating role first...")
      const newRole = await prisma.role.create({ data: { name: "Admin" } })
      console.log("Created role:", newRole)
    }
    const userRole = await prisma.role.findFirst()
    const newUser = await prisma.user.create({
      data: {
        email: "test@example.com",
        name: "Test User",
        password: password,
        roleId: userRole!.id,
      },
    })
    console.log("Created user:", newUser)
    console.log("Login with: test@example.com / password123")
  }

  await prisma.$disconnect()
}

check().catch(console.error)
