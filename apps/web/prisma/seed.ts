import { seedPermissions } from "./seed-permissions.js"
import { seedRoles } from "./seed-roles.js"
import { seedAdmin } from "./seed-admin.js"
import { seedSystemSettings } from "./seed-system-settings.js"
import { seedTicketing } from "./seed-ticketing.js"
import { seedTickets } from "./seed-tickets.js"

async function main() {
  console.log("🌱 Starting database seed...")

  try {
    // Seed in order
    await seedPermissions()
    await seedRoles()
    await seedAdmin()
    await seedSystemSettings()
    await seedTicketing()
    await seedTickets()

    console.log("✅ Seed completed successfully!")
  } catch (error) {
    console.error("❌ Seed failed:", error)
    throw error
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    // Prisma Client handles connection pooling internally
    process.exit(0)
  })
