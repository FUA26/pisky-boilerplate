import { prisma } from "@/lib/prisma"
import type { Metadata } from "next"
import { requireAuth } from "@/lib/rbac/permissions"
import { DashboardClient } from "./app/(dashboard)/dashboard-client"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Overview and statistics",
}

export default async function DashboardPage() {
  await requireAuth()
  const userCount = await prisma.user.count()

  return <DashboardClient initialUserCount={userCount} />
}
