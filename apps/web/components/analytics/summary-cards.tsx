import { StatCard } from "@/features/dashboard/components/stat-card"
import { MessageSquare, Users, ShieldCheck, Activity } from "lucide-react"

export function SummaryCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard title="Tickets" value="128" icon={MessageSquare} />
      <StatCard title="Users" value="42" icon={Users} />
      <StatCard title="Open Roles" value="8" icon={ShieldCheck} />
      <StatCard title="Activity" value="95%" icon={Activity} />
    </div>
  )
}
