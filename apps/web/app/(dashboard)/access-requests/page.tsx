import { requireAuth } from "@/lib/rbac/permissions"
import { requirePermission } from "@/lib/rbac/permissions"
import { AccessRequestsClient } from "./access-requests-client"

export default async function AccessRequestsPage() {
  const session = await requireAuth()
  await requirePermission(session.user.id, "TICKET_APP_APPROVE")

  return <AccessRequestsClient />
}
