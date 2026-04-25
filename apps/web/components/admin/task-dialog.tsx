"use client"

import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { useState } from "react"

interface TaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit"
  taskId?: string
  onSuccess?: () => void
}

export function TaskDialog({
  open,
  onOpenChange,
  mode,
  taskId,
  onSuccess,
}: TaskDialogProps) {
  return (
    <TaskDialogBody
      key={`${mode}-${taskId ?? "new"}-${open ? "open" : "closed"}`}
      open={open}
      onOpenChange={onOpenChange}
      mode={mode}
      taskId={taskId}
      onSuccess={onSuccess}
    />
  )
}

function TaskDialogBody({
  open,
  onOpenChange,
  mode,
  taskId,
  onSuccess,
}: TaskDialogProps) {
  const [title, setTitle] = useState(
    mode === "edit" && taskId ? `Task ${taskId}` : ""
  )
  const [description, setDescription] = useState("")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Task" : "Edit Task"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Create a new task entry."
              : "Update the selected task."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onOpenChange(false)
              onSuccess?.()
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
