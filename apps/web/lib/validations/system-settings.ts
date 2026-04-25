import { z } from "zod"

export const systemSettingsSchema = z.object({
  allowRegistration: z.boolean(),
  requireEmailVerification: z.boolean(),
  defaultUserRoleId: z.string().min(1, "Default role is required"),
  emailVerificationExpiryHours: z.number().int().min(1).max(168),
  minPasswordLength: z.number().int().min(8).max(128),
  requireStrongPassword: z.boolean(),
  siteName: z.string().min(1).max(120),
  siteDescription: z.string().optional().nullable(),
  siteLogoId: z.string().optional().nullable(),
  siteSubtitle: z.string().optional().nullable(),
  citizenName: z.string().optional().nullable(),
  heroBackgroundId: z.string().optional().nullable(),
  contactAddress: z.string().optional().nullable(),
  contactPhones: z.array(z.string()).optional().nullable(),
  contactEmails: z.array(z.string()).optional().nullable(),
  socialFacebook: z.string().optional().nullable(),
  socialTwitter: z.string().optional().nullable(),
  socialInstagram: z.string().optional().nullable(),
  socialYouTube: z.string().optional().nullable(),
  copyrightText: z.string().optional().nullable(),
  versionNumber: z.string().optional().nullable(),
})

export type SystemSettingsInput = z.infer<typeof systemSettingsSchema>
