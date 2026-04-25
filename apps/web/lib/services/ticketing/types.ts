export interface TicketMessageAttachment {
  url: string
  name: string
  type?: string
  size?: number
}

export interface TicketWithRelations {
  id: string
  ticketNumber: string
  subject: string
  status: string
  priority: string
  createdAt: string | Date
  updatedAt: string | Date
  app: { name: string; slug?: string }
  channel: { type: string }
  customer: {
    guestName?: string | null
    guestEmail?: string | null
    user?: { name?: string | null; email?: string | null }
  }
  user?: { name?: string | null; email?: string | null } | null
  guestName?: string | null
  guestEmail?: string | null
  assignedToUser?: {
    id?: string
    name?: string | null
    email?: string | null
  } | null
  assignedTo?: {
    id?: string
    name?: string | null
    email?: string | null
  } | null
  attachments?: Array<{
    file: {
      serveUrl?: string | null
      cdnUrl?: string | null
      storagePath?: string | null
      originalFilename?: string | null
      mimeType?: string | null
      size?: number | null
    }
  }>
  messages?: Array<{
    id: string
    sender: string
    message: string
    isInternal: boolean
    createdAt: string | Date
    attachments?: TicketMessageAttachment[]
  }>
}
