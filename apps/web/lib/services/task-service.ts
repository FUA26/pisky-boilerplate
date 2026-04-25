import { prisma } from "@/lib/prisma"

export type TaskStatus = "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE" | "ARCHIVED"
export type TaskPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT"

export interface TaskTag {
  id: string
  name: string
  color: string | null
}

export interface TaskAssignee {
  id: string
  name: string | null
  email: string
}

export interface Task {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  dueDate: string | Date | null
  createdAt: string | Date
  updatedAt: string | Date
  assigneeId: string | null
  assignee?: TaskAssignee | null
  createdById: string
  ticketId: string | null
  ticket?: { id: string; ticketNumber: string } | null
  tags?: TaskTag[]
  commentCount: number
  attachmentCount: number
}

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

export async function getTasks({
  page,
  pageSize,
}: {
  page: number
  pageSize: number
}): Promise<PaginatedResult<Task>> {
  const [items, total] = await Promise.all([
    prisma.task.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        ticket: { select: { id: true, ticketNumber: true } },
        tags: { include: { tag: true } },
        _count: {
          select: {
            comments: true,
            attachments: true,
          },
        },
      },
    }),
    prisma.task.count(),
  ])

  return {
    items: items.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status as TaskStatus,
      priority: task.priority as TaskPriority,
      dueDate: task.dueDate,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      assigneeId: task.assigneeId,
      assignee: task.assignee,
      createdById: task.createdById,
      ticketId: task.ticketId,
      ticket: task.ticket,
      tags: task.tags.map((link) => ({
        id: link.tag.id,
        name: link.tag.name,
        color: link.tag.color,
      })),
      commentCount: task._count.comments,
      attachmentCount: task._count.attachments,
    })),
    total,
    page,
    pageSize,
  }
}
