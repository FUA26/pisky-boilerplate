import { ActivityAction, Prisma, SenderType } from "@prisma/client"
import { randomUUID } from "node:crypto"
import { prisma } from "@/lib/prisma"
import type { TicketWithRelations, TicketMessageAttachment } from "./types"

type TicketAttachmentInput = {
  id?: string
  url: string
  name: string
  type?: string
  size?: number
}

type CreateTicketInput = {
  appId: string
  channelId: string
  subject: string
  message: string
  description?: string | null
  priority?: "LOW" | "NORMAL" | "HIGH" | "URGENT"
  userId?: string
  guestInfo?: { email: string; name?: string; phone?: string }
  attachments?: TicketAttachmentInput[]
  createdBy?: string
  externalUserId?: string | null
}

type UpdateTicketInput = {
  status?: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED"
  assignedTo?: string | null
  priority?: "LOW" | "NORMAL" | "HIGH" | "URGENT"
  subject?: string
  description?: string | null
}

type ListTicketsInput = {
  page?: number
  pageSize?: number
  search?: string
  status?: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED"
  priority?: "LOW" | "NORMAL" | "HIGH" | "URGENT"
  assigneeId?: string
  sortBy?: "createdAt" | "updatedAt" | "priority" | "status"
  sortOrder?: "asc" | "desc"
}

function ticketNumberFromId(id: string) {
  return `TICKET-${id.slice(0, 8).toUpperCase()}`
}

function buildAttachmentUrl(file: {
  id: string
  isPublic: boolean
  cdnUrl: string | null
  storagePath: string
}) {
  return (
    file.cdnUrl ||
    (file.isPublic
      ? `/api/public/files/${file.id}/serve`
      : `/api/files/${file.id}/serve`)
  )
}

function mapAttachments(
  attachments: Array<{
    file: {
      id: string
      isPublic: boolean
      cdnUrl: string | null
      storagePath: string
      originalFilename: string
      mimeType: string
      size: number
    }
  }>
) {
  return attachments.map((attachment) => ({
    file: {
      serveUrl: buildAttachmentUrl(attachment.file),
      cdnUrl: attachment.file.cdnUrl,
      storagePath: attachment.file.storagePath,
      originalFilename: attachment.file.originalFilename,
      mimeType: attachment.file.mimeType,
      size: attachment.file.size,
    },
  }))
}

function mapTicket(ticket: {
  id: string
  ticketNumber: string
  subject: string
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED"
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT"
  createdAt: Date
  updatedAt: Date
  guestName: string | null
  guestEmail: string | null
  app: { name: string; slug: string }
  channel: { type: string }
  user: { name: string | null; email: string } | null
  assignedToUser: { id: string; name: string | null; email: string } | null
  attachments: Array<{
    file: {
      id: string
      isPublic: boolean
      cdnUrl: string | null
      storagePath: string
      originalFilename: string
      mimeType: string
      size: number
    }
  }>
  messages?: Array<{
    id: string
    sender: string
    message: string
    isInternal: boolean
    createdAt: Date
    attachments: Prisma.JsonValue | null
  }>
}): TicketWithRelations {
  return {
    id: ticket.id,
    ticketNumber: ticket.ticketNumber,
    subject: ticket.subject,
    status: ticket.status,
    priority: ticket.priority,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
    app: {
      name: ticket.app.name,
      slug: ticket.app.slug,
    },
    channel: {
      type: ticket.channel.type,
    },
    customer: {
      guestName: ticket.guestName,
      guestEmail: ticket.guestEmail,
      user: ticket.user
        ? { name: ticket.user.name, email: ticket.user.email }
        : undefined,
    },
    user: ticket.user
      ? { name: ticket.user.name, email: ticket.user.email }
      : null,
    guestName: ticket.guestName,
    guestEmail: ticket.guestEmail,
    assignedToUser: ticket.assignedToUser
      ? {
          id: ticket.assignedToUser.id,
          name: ticket.assignedToUser.name,
          email: ticket.assignedToUser.email,
        }
      : null,
    assignedTo: ticket.assignedToUser
      ? {
          id: ticket.assignedToUser.id,
          name: ticket.assignedToUser.name,
          email: ticket.assignedToUser.email,
        }
      : null,
    attachments: mapAttachments(ticket.attachments ?? []),
    messages: ticket.messages?.map((message) => ({
      id: message.id,
      sender: message.sender,
      message: message.message,
      isInternal: message.isInternal,
      createdAt: message.createdAt,
      attachments:
        (message.attachments as TicketMessageAttachment[] | null) ?? undefined,
    })),
  }
}

async function createInitialAttachments(
  ticketId: string,
  attachments?: TicketAttachmentInput[]
) {
  const fileIds = attachments
    ?.map((attachment) => attachment.id)
    .filter((id): id is string => Boolean(id))

  if (!fileIds || fileIds.length === 0) {
    return
  }

  await prisma.ticketAttachment.createMany({
    data: fileIds.map((fileId) => ({
      ticketId,
      fileId,
    })),
  })
}

export async function createTicket(input: CreateTicketInput) {
  const ticket = await prisma.ticket.create({
    data: {
      ticketNumber: ticketNumberFromId(randomUUID()),
      appId: input.appId,
      channelId: input.channelId,
      subject: input.subject,
      description: input.description,
      priority: input.priority ?? "NORMAL",
      userId: input.userId,
      guestEmail: input.guestInfo?.email,
      guestName: input.guestInfo?.name,
      guestPhone: input.guestInfo?.phone,
      externalUserId: input.externalUserId ?? undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  })

  await createInitialAttachments(ticket.id, input.attachments)

  await prisma.ticketMessage.create({
    data: {
      ticketId: ticket.id,
      sender: SenderType.CUSTOMER,
      userId: input.createdBy ?? input.userId,
      message: input.message,
      attachments: input.attachments?.length ? input.attachments : undefined,
      isInternal: false,
    },
  })

  await prisma.ticketActivity.create({
    data: {
      ticketId: ticket.id,
      action: ActivityAction.CREATED,
      userId: input.createdBy ?? input.userId,
    },
  })

  const loaded = await prisma.ticket.findUnique({
    where: { id: ticket.id },
    include: {
      app: { select: { name: true, slug: true } },
      channel: { select: { type: true } },
      user: { select: { name: true, email: true } },
      assignedToUser: { select: { id: true, name: true, email: true } },
      attachments: { include: { file: true } },
    },
  })

  if (!loaded) {
    throw new Error("TICKET_NOT_FOUND")
  }

  return mapTicket(loaded)
}

export async function getTicketById(id: string) {
  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      app: { select: { name: true, slug: true } },
      channel: { select: { type: true } },
      user: { select: { name: true, email: true } },
      assignedToUser: { select: { id: true, name: true, email: true } },
      attachments: { include: { file: true } },
      messages: {
        select: {
          id: true,
          sender: true,
          message: true,
          isInternal: true,
          createdAt: true,
          attachments: true,
        },
        orderBy: { createdAt: "asc" },
      },
    },
  })

  if (!ticket) {
    throw new Error("TICKET_NOT_FOUND")
  }

  return mapTicket(ticket)
}

export async function updateTicket(
  id: string,
  data: UpdateTicketInput,
  userId: string
) {
  const existing = await prisma.ticket.findUnique({
    where: { id },
  })

  if (!existing) {
    throw new Error("TICKET_NOT_FOUND")
  }

  const changes: Record<string, unknown> = {}
  const updateData: Record<string, unknown> = {}

  if (data.subject !== undefined) updateData.subject = data.subject
  if (data.description !== undefined) updateData.description = data.description

  if (data.priority !== undefined && data.priority !== existing.priority) {
    updateData.priority = data.priority
    changes.priority = { from: existing.priority, to: data.priority }
    await prisma.ticketActivity.create({
      data: {
        ticketId: id,
        action: ActivityAction.PRIORITY_CHANGED,
        userId,
        changes: changes as Prisma.InputJsonValue,
      },
    })
  }

  if (data.status !== undefined && data.status !== existing.status) {
    updateData.status = data.status
    updateData.resolvedAt =
      data.status === "RESOLVED"
        ? new Date()
        : data.status === "CLOSED"
          ? (existing.resolvedAt ?? new Date())
          : null
    updateData.closedAt = data.status === "CLOSED" ? new Date() : null
    changes.status = { from: existing.status, to: data.status }

    await prisma.ticketActivity.create({
      data: {
        ticketId: id,
        action: ActivityAction.STATUS_CHANGED,
        userId,
        changes: changes as Prisma.InputJsonValue,
      },
    })
  }

  if (
    data.assignedTo !== undefined &&
    data.assignedTo !== existing.assignedTo
  ) {
    updateData.assignedTo = data.assignedTo
    updateData.assignedAt = data.assignedTo ? new Date() : null
    changes.assignedTo = { from: existing.assignedTo, to: data.assignedTo }

    await prisma.ticketActivity.create({
      data: {
        ticketId: id,
        action: ActivityAction.ASSIGNED,
        userId,
        changes: changes as Prisma.InputJsonValue,
      },
    })
  }

  const updated = await prisma.ticket.update({
    where: { id },
    data: updateData,
    include: {
      app: { select: { name: true, slug: true } },
      channel: { select: { type: true } },
      user: { select: { name: true, email: true } },
      assignedToUser: { select: { id: true, name: true, email: true } },
      attachments: { include: { file: true } },
    },
  })

  return mapTicket(updated)
}

export async function closeTicket(id: string, userId: string) {
  return updateTicket(id, { status: "CLOSED" }, userId)
}

export async function reopenTicket(id: string, userId: string) {
  return updateTicket(id, { status: "IN_PROGRESS" }, userId)
}

export async function listTickets(
  params: ListTicketsInput,
  _currentUserId: string
) {
  const where: Prisma.TicketWhereInput = {}

  if (params.status) where.status = params.status
  if (params.priority) where.priority = params.priority
  if (params.assigneeId) where.assignedTo = params.assigneeId

  if (params.search) {
    where.OR = [
      { subject: { contains: params.search, mode: "insensitive" } },
      { description: { contains: params.search, mode: "insensitive" } },
      { guestName: { contains: params.search, mode: "insensitive" } },
      { guestEmail: { contains: params.search, mode: "insensitive" } },
    ]
  }

  const page = params.page ?? 1
  const pageSize = params.pageSize ?? 20
  const skip = (page - 1) * pageSize
  const orderBy: Prisma.TicketOrderByWithRelationInput = params.sortBy
    ? { [params.sortBy]: params.sortOrder ?? "desc" }
    : { createdAt: "desc" }

  const [tickets, total] = await Promise.all([
    prisma.ticket.findMany({
      where,
      skip,
      take: pageSize,
      orderBy,
      include: {
        app: { select: { name: true, slug: true } },
        channel: { select: { type: true } },
        user: { select: { name: true, email: true } },
        assignedToUser: { select: { id: true, name: true, email: true } },
        attachments: { include: { file: true } },
      },
    }),
    prisma.ticket.count({ where }),
  ])

  return {
    items: tickets.map(mapTicket),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  }
}

export async function getTicketStats(appId?: string) {
  const where: Prisma.TicketWhereInput = appId ? { appId } : {}

  const [
    total,
    open,
    inProgress,
    resolved,
    closed,
    urgent,
    high,
    unassigned,
    overdue,
    todayCount,
    weekCount,
    monthCount,
  ] = await Promise.all([
    prisma.ticket.count({ where }),
    prisma.ticket.count({ where: { ...where, status: "OPEN" } }),
    prisma.ticket.count({ where: { ...where, status: "IN_PROGRESS" } }),
    prisma.ticket.count({ where: { ...where, status: "RESOLVED" } }),
    prisma.ticket.count({ where: { ...where, status: "CLOSED" } }),
    prisma.ticket.count({ where: { ...where, priority: "URGENT" } }),
    prisma.ticket.count({ where: { ...where, priority: "HIGH" } }),
    prisma.ticket.count({ where: { ...where, assignedTo: null } }),
    prisma.ticket.count({
      where: {
        ...where,
        status: { not: "CLOSED" },
        createdAt: { lt: new Date(Date.now() - 48 * 60 * 60 * 1000) },
      },
    }),
    prisma.ticket.count({
      where: {
        ...where,
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
    }),
    prisma.ticket.count({
      where: {
        ...where,
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    }),
    prisma.ticket.count({
      where: {
        ...where,
        createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
    }),
  ])

  return {
    total,
    open,
    inProgress,
    resolved,
    closed,
    urgent,
    high,
    unassigned,
    overdue,
    todayCount,
    weekCount,
    monthCount,
  }
}
