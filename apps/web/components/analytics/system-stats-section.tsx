import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { StatCard } from "@/features/dashboard/components/stat-card"
import { Server, Database, ShieldAlert } from "lucide-react"

export function SystemStatsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Stats</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        <StatCard title="API Uptime" value="99.9%" icon={Server} />
        <StatCard title="DB Health" value="Healthy" icon={Database} />
        <StatCard title="Alerts" value="2" icon={ShieldAlert} />
      </CardContent>
    </Card>
  )
}
