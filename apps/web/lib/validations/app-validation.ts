import { z } from "zod"

const channelTypeSchema = z.enum([
  "WEB_FORM",
  "PUBLIC_LINK",
  "WIDGET",
  "INTEGRATED_APP",
  "WHATSAPP",
  "TELEGRAM",
])

export const createAppSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
})

export const updateAppSchema = createAppSchema.partial()

export const createChannelSchema = z.object({
  appId: z.string().min(1),
  type: channelTypeSchema,
  name: z.string().min(1),
  slug: z.string().min(1).optional(),
  apiKey: z.string().min(1).optional().nullable(),
  config: z.record(z.unknown()).default({}),
  isActive: z.boolean().default(true),
})

export const updateChannelSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  apiKey: z.string().min(1).optional().nullable(),
  config: z.record(z.unknown()).optional(),
  isActive: z.boolean().optional(),
})
