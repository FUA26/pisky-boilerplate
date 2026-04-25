"use client"

/**
 * Kanban Column Component
 *
 * Individual column for the Kanban board
 * Displays tasks for a specific status
 * Uses @dnd-kit/sortable for vertical reordering
 * Shows column header with task count
 */

import { Badge } from "@workspace/ui/components/badge"
import type { Task, TaskStatus } from "@/lib/services/task-service"
import { KanbanCard } from "./kanban-card"

interface KanbanColumnProps {
  status: TaskStatus
  tasks: Task[]
  onTaskClick?: (task: Task) => void
}

// Status display names and variants
const statusConfig: Record<
  TaskStatus,
  {
    label: string
    variant: "default" | "secondary" | "outline" | "destructive"
    color: string
  }
> = {
  TODO: { label: "To Do", variant: "secondary", color: "bg-slate-500/10" },
  IN_PROGRESS: {
    label: "In Progress",
    variant: "default",
    color: "bg-blue-500/10",
  },
  REVIEW: { label: "Review", variant: "outline", color: "bg-purple-500/10" },
  DONE: { label: "Done", variant: "outline", color: "bg-green-500/10" },
  ARCHIVED: {
    label: "Archived",
    variant: "secondary",
    color: "bg-gray-500/10",
  },
}

export function KanbanColumn({
  status,
  tasks,
  onTaskClick,
}: KanbanColumnProps) {
  const config = statusConfig[status]

  return (
    <div className="flex w-[280px] max-w-[280px] min-w-[280px] flex-col">
      {/* Column Header */}
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold">{config.label}</h3>
          <Badge variant={config.variant} className="text-xs">
            {tasks.length}
          </Badge>
        </div>
      </div>

      {/* Column Content */}
      <div
        className={`min-h-[200px] flex-1 rounded-lg bg-muted/30 p-2 transition-colors ${tasks.length === 0 ? "flex items-center justify-center" : "space-y-2"} `}
      >
        {tasks.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground">
            No tasks
          </div>
        ) : (
          tasks.map((task) => (
            <KanbanCard key={task.id} task={task} onClick={onTaskClick} />
          ))
        )}
      </div>
    </div>
  )
}
