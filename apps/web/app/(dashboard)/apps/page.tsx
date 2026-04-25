import { requireAuth } from "@/lib/rbac/permissions"
import { requirePermission } from "@/lib/rbac/permissions"
import { AppsClient } from "./apps-client"

export default async function AppsPage() {
  const session = await requireAuth()
  await requirePermission(session.user.id, "TICKET_APP_VIEW")

  return <AppsClient />
}
