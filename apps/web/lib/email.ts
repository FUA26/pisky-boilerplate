// apps/web/lib/email.ts
/**
 * Email utilities
 *
 * For E2E testing, this provides a mock implementation.
 * In production, this would connect to an email service.
 */

export interface EmailResult {
  success: boolean
  error?: string
  messageId?: string
}

interface SendTemplateOptions {
  to: string
  subject: string
  data: Record<string, unknown>
}

/**
 * Send an email using a template
 * For E2E testing, this just logs to console
 */
export async function sendTemplate(
  template: string,
  options: SendTemplateOptions
): Promise<EmailResult> {
  // In development/testing, just log the email
  if (process.env.NODE_ENV === "development" || process.env.CI) {
    console.log(`[EMAIL MOCK] Template: ${template}`)
    console.log(`[EMAIL MOCK] To: ${options.to}`)
    console.log(`[EMAIL MOCK] Subject: ${options.subject}`)
    console.log(`[EMAIL MOCK] Data:`, JSON.stringify(options.data, null, 2))
    return { success: true, messageId: "mock-" + Date.now() }
  }

  // In production, integrate with actual email service
  // For now, return success
  return { success: true, messageId: "prod-" + Date.now() }
}

/**
 * Send a plain text email
 */
export async function sendEmail(
  to: string,
  subject: string,
  text: string
): Promise<EmailResult> {
  if (process.env.NODE_ENV === "development" || process.env.CI) {
    console.log(`[EMAIL MOCK] To: ${to}`)
    console.log(`[EMAIL MOCK] Subject: ${subject}`)
    console.log(`[EMAIL MOCK] Body: ${text}`)
    return { success: true, messageId: "mock-" + Date.now() }
  }

  return { success: true, messageId: "prod-" + Date.now() }
}
