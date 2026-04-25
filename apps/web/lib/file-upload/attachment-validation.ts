import { z } from "zod"

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024
export const MAX_ATTACHMENTS_PER_MESSAGE = 3
export const MAX_ATTACHMENTS_PER_TICKET = 3

const attachmentMimeTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
]

export function isImageAttachment(type: string) {
  return type.startsWith("image/")
}

export const attachmentFileSchema = z.object({
  name: z.string().min(1),
  size: z.number().int().nonnegative().max(MAX_FILE_SIZE_BYTES),
  type: z
    .string()
    .min(1)
    .refine(
      (value) =>
        isImageAttachment(value) ||
        attachmentMimeTypes.includes(value) ||
        value === "application/octet-stream",
      "Unsupported attachment type"
    ),
})
