import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function testPasswords() {
  const user = await prisma.user.findUnique({
    where: { email: "admin@example.com" },
    include: { role: true },
  })

  if (!user) {
    console.log("User not found")
    return
  }

  console.log("User:", user.email)
  console.log("Full hash:", user.password)

  // Test common passwords
  const passwords = [
    "admin",
    "password",
    "admin123",
    "password123",
    "Admin123!",
  ]

  for (const pwd of passwords) {
    const isValid = await bcrypt.compare(pwd, user.password!)
    if (isValid) {
      console.log("✓ Password found:", pwd)
    }
  }

  await prisma.$disconnect()
}

testPasswords().catch(console.error)
