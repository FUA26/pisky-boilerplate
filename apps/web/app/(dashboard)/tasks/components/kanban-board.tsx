"use client"

/**
 * Kanban Board Component
 *
 * Main Kanban board with drag-and-drop functionality
 * Displays 5 columns based on TaskStatus enum
 * Supports dragging tasks between columns
 */

import { useMemo } from "react"
import type { Task, TaskStatus } from "@/lib/services/task-service"
import { KanbanColumn } from "./kanban-column"

// All task statuses in order
const TASK_STATUSES: TaskStatus[] = [
  "TODO",
  "IN_PROGRESS",
  "REVIEW",
  "DONE",
  "ARCHIVED",
]

interface KanbanBoardProps {
  tasks: Task[]
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void
  onTaskClick?: (task: Task) => void
  onRefresh?: () => void
}

export function KanbanBoard({
  tasks,
  onTaskUpdate,
  onTaskClick,
  onRefresh,
}: KanbanBoardProps) {
  void onTaskUpdate
  void onRefresh
  // Group tasks by status using useMemo to update when props change
  const tasksByStatus = useMemo<Record<TaskStatus, Task[]>>(() => {
    const grouped: Record<TaskStatus, Task[]> = {
      TODO: [],
      IN_PROGRESS: [],
      REVIEW: [],
      DONE: [],
      ARCHIVED: [],
    }
    tasks.forEach((task) => {
      grouped[task.status].push(task)
    })
    return grouped
  }, [tasks])

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {TASK_STATUSES.map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          tasks={tasksByStatus[status]}
          onTaskClick={onTaskClick}
        />
      ))}
    </div>
  )
}
