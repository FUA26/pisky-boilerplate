import { z } from "zod"

export const assignAppSchema = z.object({
  appId: z.string().min(1),
})

export const accessRequestSchema = z.object({
  appId: z.string().min(1),
  reason: z.string().max(2000).optional().nullable(),
})

export const updateRequestSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  reason: z.string().max(2000).optional().nullable(),
})
