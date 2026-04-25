import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { StatCard } from "@/features/dashboard/components/stat-card"
import { Users, UserPlus, UserCheck } from "lucide-react"

export function UserStatsSection({ dateRange }: { dateRange: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Stats ({dateRange}d)</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        <StatCard title="Active" value="32" icon={Users} />
        <StatCard title="New" value="8" icon={UserPlus} />
        <StatCard title="Verified" value="29" icon={UserCheck} />
      </CardContent>
    </Card>
  )
}
