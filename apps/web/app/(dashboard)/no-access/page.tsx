import { requireAuth } from "@/lib/rbac/permissions"
import { NoAppAccess } from "@/components/dashboard/no-app-access"

export default async function NoAccessPage() {
  await requireAuth()
  return <NoAppAccess />
}
