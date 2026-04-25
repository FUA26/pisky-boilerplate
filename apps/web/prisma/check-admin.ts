import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

async function main() {
  const admin = await prisma.user.findUnique({
    where: { email: "admin@example.com" },
  })
  console.log("User:", admin?.email, admin?.name)
  console.log("Has password:", !!admin?.password)
  console.log("Password length:", admin?.password?.length)
  console.log("Password starts with:", admin?.password?.substring(0, 10))
  console.log("Email verified:", admin?.emailVerified)
  console.log("Role ID:", admin?.roleId)

  // Check if password matches
  const bcrypt = await import("bcryptjs")
  const isValid = await bcrypt.default.compare(
    "admin123",
    admin?.password || ""
  )
  console.log("Password valid:", isValid)

  await prisma.$disconnect()
}

main().catch(console.error)
