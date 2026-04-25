"use client"

import { Button } from "@workspace/ui/components/button"

interface FilterBarProps {
  onDateRangeChange: (range: string) => void
  onRefresh: () => void
  isRefreshing: boolean
}

export function FilterBar({
  onDateRangeChange,
  onRefresh,
  isRefreshing,
}: FilterBarProps) {
  const ranges = [
    { label: "7d", value: "7" },
    { label: "30d", value: "30" },
    { label: "90d", value: "90" },
  ]

  return (
    <div className="flex flex-wrap items-center gap-2">
      {ranges.map((range) => (
        <Button
          key={range.value}
          variant="outline"
          size="sm"
          onClick={() => onDateRangeChange(range.value)}
        >
          {range.label}
        </Button>
      ))}
      <Button size="sm" onClick={onRefresh} disabled={isRefreshing}>
        {isRefreshing ? "Refreshing..." : "Refresh"}
      </Button>
    </div>
  )
}
