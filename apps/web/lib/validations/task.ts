import { z } from "zod"

const taskStatusSchema = z.enum([
  "TODO",
  "IN_PROGRESS",
  "REVIEW",
  "DONE",
  "ARCHIVED",
])
const taskPrioritySchema = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"])

export const taskQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional(),
  status: taskStatusSchema.optional(),
  priority: taskPrioritySchema.optional(),
  assigneeId: z.string().optional(),
  sortBy: z
    .enum(["createdAt", "updatedAt", "priority", "status"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
})

export const createTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(10_000).optional().nullable(),
  status: taskStatusSchema.default("TODO"),
  priority: taskPrioritySchema.default("MEDIUM"),
  dueDate: z.coerce.date().optional().nullable(),
  assigneeId: z.string().optional().nullable(),
  tagIds: z.array(z.string()).optional(),
})

export const updateTaskSchema = createTaskSchema.partial()

export const taskCommentSchema = z.object({
  content: z.string().min(1).max(10_000),
  attachmentId: z.string().optional().nullable(),
})

export const bulkUpdateTaskStatusSchema = z.object({
  taskIds: z.array(z.string().min(1)).min(1),
  status: taskStatusSchema,
})

export const bulkDeleteTasksSchema = z.object({
  taskIds: z.array(z.string().min(1)).min(1),
})
