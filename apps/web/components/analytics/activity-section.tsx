import { ActivityChart } from "@/features/dashboard/components/activity-chart"

export function ActivitySection({ dateRange }: { dateRange: string }) {
  return <ActivityChart key={dateRange} />
}
