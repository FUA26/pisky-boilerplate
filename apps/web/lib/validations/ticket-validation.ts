import { z } from "zod"

const ticketStatusSchema = z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"])
const ticketPrioritySchema = z.enum(["LOW", "NORMAL", "HIGH", "URGENT"])
const channelTypeSchema = z.enum([
  "WEB_FORM",
  "PUBLIC_LINK",
  "WIDGET",
  "INTEGRATED_APP",
  "WHATSAPP",
  "TELEGRAM",
])

export const ticketAttachmentSchema = z.object({
  id: z.string().optional(),
  url: z.string().min(1),
  name: z.string().min(1),
  type: z.string().optional(),
  size: z.number().int().nonnegative().optional(),
})

export const baseCreateTicketSchema = z.object({
  appSlug: z.string().optional(),
  channelType: channelTypeSchema.optional(),
  subject: z.string().min(1).max(500),
  description: z.string().max(10_000).optional().nullable(),
  message: z.string().min(1).max(10_000),
  priority: ticketPrioritySchema.default("NORMAL"),
  guestEmail: z.string().email().optional(),
  guestName: z.string().max(255).optional().nullable(),
  guestPhone: z.string().max(50).optional().nullable(),
  externalUserId: z.string().max(255).optional().nullable(),
  externalUserName: z.string().max(255).optional().nullable(),
  externalUserEmail: z.string().email().optional().nullable(),
  attachments: z.array(ticketAttachmentSchema).optional(),
})

export const createTicketSchema = baseCreateTicketSchema.extend({
  appSlug: z.string().min(1),
  channelType: channelTypeSchema,
  guestEmail: z.string().email(),
})

export const integratedTicketSchema = z.object({
  subject: z.string().min(1).max(500),
  description: z.string().max(10_000).optional().nullable(),
  message: z.string().min(1).max(10_000),
  priority: ticketPrioritySchema.default("NORMAL"),
  externalUserId: z.string().max(255).optional().nullable(),
  externalUserName: z.string().max(255).optional().nullable(),
  externalUserEmail: z.string().email().optional().nullable(),
})

export const tokenRequestSchema = z
  .object({
    channelSlug: z.string().min(1),
    email: z.string().email().optional(),
    externalUserId: z.string().max(255).optional(),
    purpose: z.enum(["create_ticket", "view_ticket", "list_tickets"]),
    ticketId: z.string().optional(),
  })
  .refine((value) => Boolean(value.email || value.externalUserId), {
    message: "Either email or externalUserId is required",
    path: ["email"],
  })
  .refine(
    (value) => value.purpose !== "view_ticket" || Boolean(value.ticketId),
    {
      message: "ticketId is required for view_ticket purpose",
      path: ["ticketId"],
    }
  )

export const listTicketsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional(),
  status: ticketStatusSchema.optional(),
  priority: ticketPrioritySchema.optional(),
  assigneeId: z.string().optional(),
  sortBy: z
    .enum(["createdAt", "updatedAt", "priority", "status"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
})

export const listMessagesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
})

export const addMessageSchema = z.object({
  message: z.string().min(1).max(5000),
  attachments: z.array(ticketAttachmentSchema).optional(),
  isInternal: z.boolean().optional(),
})

export const updateTicketSchema = z.object({
  status: ticketStatusSchema.optional(),
  assignedTo: z.string().nullable().optional(),
  priority: ticketPrioritySchema.optional(),
  subject: z.string().min(1).max(500).optional(),
  description: z.string().max(10_000).nullable().optional(),
})
