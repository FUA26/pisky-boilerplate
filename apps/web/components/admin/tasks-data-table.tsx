"use client"

import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent } from "@workspace/ui/components/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { useMemo } from "react"
import type { Task } from "@/lib/services/task-service"

interface TasksDataTableProps {
  tasks: Task[]
  onRefresh: () => void
  onTaskCreated: (task: Task) => void
  onTaskUpdated: (task: Task) => void
  onTaskDeleted: (taskId: string) => void
}

export function TasksDataTable({ tasks, onRefresh }: TasksDataTableProps) {
  const visibleTasks = useMemo(() => tasks.slice(0, 10), [tasks])

  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex items-center justify-between border-b p-4">
          <div>
            <div className="font-medium">Tasks</div>
            <div className="text-sm text-muted-foreground">
              {tasks.length} loaded
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onRefresh}>
            Refresh
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Assignee</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleTasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.title}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{task.status}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{task.priority}</Badge>
                </TableCell>
                <TableCell>
                  {task.assignee?.name || task.assignee?.email || "Unassigned"}
                </TableCell>
              </TableRow>
            ))}
            {visibleTasks.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-8 text-center text-muted-foreground"
                >
                  No tasks found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
