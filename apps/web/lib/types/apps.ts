export type ChannelType =
  | "WEB_FORM"
  | "PUBLIC_LINK"
  | "WIDGET"
  | "INTEGRATED_APP"
  | "WHATSAPP"
  | "TELEGRAM"

export interface Channel {
  id: string
  type: ChannelType
  name: string
  slug?: string | null
  apiKey?: string | null
  config?: Record<string, unknown>
  isActive: boolean
}

export interface App {
  id: string
  name: string
  slug: string
  description?: string | null
  isActive: boolean
  channels: Channel[]
  _count: {
    tickets: number
  }
}

export interface DeleteDialogState {
  open: boolean
  type: "app" | "channel"
  item: App | Channel | null
  app: App | null
}
