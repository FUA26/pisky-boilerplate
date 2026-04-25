import { createHmac, randomUUID } from "node:crypto"
import { prisma } from "@/lib/prisma"

export type AccessTokenPurpose =
  | "create_ticket"
  | "view_ticket"
  | "list_tickets"

export interface AccessTokenPayload {
  channelId: string
  channelSlug: string
  appId: string
  purpose: AccessTokenPurpose
  externalUserId?: string
  email?: string
  externalUserName?: string
  ticketId?: string
  identifierType?: "email" | "externalUserId"
  iat: number
  exp: number
  jti: string
}

const TOKEN_TTL_SECONDS = 60 * 30
const RATE_LIMIT_WINDOW_MS = 60 * 1000
const RATE_LIMIT_MAX = 10

type RateLimitState = { count: number; resetAt: number }
const rateLimits = new Map<string, RateLimitState>()

function getSecret() {
  return (
    process.env.INTEGRATED_TOKEN_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    process.env.AUTH_SECRET ||
    "development-secret"
  )
}

function base64UrlEncode(value: string | Buffer) {
  return Buffer.from(value).toString("base64url")
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8")
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("base64url")
}

async function resolveChannel(channelSlug: string) {
  const channel = await prisma.channel.findUnique({
    where: { slug: channelSlug },
    include: { app: true },
  })

  if (!channel) {
    throw new Error("CHANNEL_NOT_FOUND")
  }

  if (!channel.isActive || !channel.app.isActive) {
    throw new Error("CHANNEL_INACTIVE")
  }

  if (channel.type !== "INTEGRATED_APP") {
    throw new Error("INVALID_CHANNEL_TYPE")
  }

  return channel
}

export function checkRateLimit(key: string) {
  const now = Date.now()
  const existing = rateLimits.get(key)

  if (!existing || existing.resetAt <= now) {
    rateLimits.set(key, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    })

    return { success: true, resetAt: now + RATE_LIMIT_WINDOW_MS }
  }

  if (existing.count >= RATE_LIMIT_MAX) {
    return { success: false, resetAt: existing.resetAt }
  }

  existing.count += 1
  rateLimits.set(key, existing)
  return { success: true, resetAt: existing.resetAt }
}

export function cleanupRateLimits() {
  const now = Date.now()
  for (const [key, state] of rateLimits.entries()) {
    if (state.resetAt <= now) {
      rateLimits.delete(key)
    }
  }
}

export async function generateAccessToken(
  channelSlug: string,
  identifier: string,
  purpose: AccessTokenPurpose,
  ticketId?: string,
  identifierType: "email" | "externalUserId" = "email"
) {
  const channel = await resolveChannel(channelSlug)

  if (purpose === "view_ticket" && !ticketId) {
    throw new Error("TICKET_ID_REQUIRED")
  }

  if (ticketId) {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      select: { id: true, channelId: true },
    })

    if (!ticket) {
      throw new Error("TICKET_NOT_FOUND")
    }

    if (ticket.channelId !== channel.id) {
      throw new Error("ACCESS_DENIED")
    }
  }

  const now = Math.floor(Date.now() / 1000)
  const payload: AccessTokenPayload = {
    channelId: channel.id,
    channelSlug: channel.slug || channelSlug,
    appId: channel.appId,
    purpose,
    externalUserId:
      identifierType === "externalUserId" ? identifier : undefined,
    email: identifierType === "email" ? identifier : undefined,
    identifierType,
    ticketId,
    iat: now,
    exp: now + TOKEN_TTL_SECONDS,
    jti: randomUUID(),
  }

  const header = { alg: "HS256", typ: "JWT" }
  const encodedHeader = base64UrlEncode(JSON.stringify(header))
  const encodedPayload = base64UrlEncode(JSON.stringify(payload))
  const signature = sign(`${encodedHeader}.${encodedPayload}`)

  return {
    token: `${encodedHeader}.${encodedPayload}.${signature}`,
    expiresIn: TOKEN_TTL_SECONDS,
  }
}

export async function verifyAccessToken(
  token: string
): Promise<AccessTokenPayload> {
  const parts = token.split(".")
  if (parts.length !== 3) {
    throw new Error("INVALID_TOKEN")
  }

  const [encodedHeader, encodedPayload, signature] = parts
  const expectedSignature = sign(`${encodedHeader}.${encodedPayload}`)
  if (signature !== expectedSignature) {
    throw new Error("INVALID_TOKEN")
  }

  const payload = JSON.parse(
    base64UrlDecode(encodedPayload)
  ) as AccessTokenPayload

  if (
    !payload?.exp ||
    !payload?.channelId ||
    !payload?.appId ||
    !payload?.purpose
  ) {
    throw new Error("INVALID_TOKEN")
  }

  if (payload.exp * 1000 < Date.now()) {
    throw new Error("TOKEN_EXPIRED")
  }

  const channel = await prisma.channel.findUnique({
    where: { id: payload.channelId },
    include: { app: true },
  })

  if (!channel) {
    throw new Error("CHANNEL_NOT_FOUND")
  }

  if (!channel.isActive || !channel.app.isActive) {
    throw new Error("CHANNEL_INACTIVE")
  }

  if (payload.purpose === "view_ticket" && !payload.ticketId) {
    throw new Error("INVALID_TOKEN_PURPOSE")
  }

  return payload
}
