import { Prisma, SenderType } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import type { TicketMessageAttachment } from "./types"

type CreateTicketMessageInput = {
  ticketId: string
  sender: SenderType
  message: string
  userId?: string
  attachments?: TicketMessageAttachment[]
  isInternal?: boolean
}

function normalizeAttachments(attachments?: TicketMessageAttachment[]) {
  return attachments?.length ? attachments : undefined
}

export async function addTicketMessage(input: CreateTicketMessageInput) {
  const ticket = await prisma.ticket.findUnique({
    where: { id: input.ticketId },
    select: { id: true },
  })

  if (!ticket) {
    throw new Error("TICKET_NOT_FOUND")
  }

  const message = await prisma.ticketMessage.create({
    data: {
      ticketId: input.ticketId,
      sender: input.sender,
      userId: input.userId,
      message: input.message,
      attachments: normalizeAttachments(input.attachments) as
        | Prisma.InputJsonValue
        | undefined,
      isInternal: input.isInternal ?? false,
    },
  })

  await prisma.ticketActivity.create({
    data: {
      ticketId: input.ticketId,
      action:
        input.sender === SenderType.AGENT
          ? "AGENT_REPLIED"
          : input.sender === SenderType.SYSTEM
            ? "NOTE_ADDED"
            : "CUSTOMER_REPLIED",
      userId: input.userId,
    },
  })

  return message
}

export async function getTicketMessages(ticketId: string) {
  return prisma.ticketMessage.findMany({
    where: { ticketId },
    orderBy: { createdAt: "asc" },
  })
}
