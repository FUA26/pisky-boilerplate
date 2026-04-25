import type { Metadata } from "next"
import { requireAuth } from "@/lib/rbac/permissions"
import { DashboardClient } from "../dashboard-client"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Overview and statistics",
}

export default async function DashboardPage() {
  await requireAuth()

  return <DashboardClient />
}
