/**
 * Add Message to Ticket API Route
 * POST /api/integrated/tickets/[id]/messages
 *
 * Allows external app users to add messages to their tickets using JWT token.
 *
 * Request body:
 * {
 *   "message": "I need to add more info...",
 *   "attachments": [...] // optional
 * }
 *
 * Query params:
 * - token: JWT token for authentication
 *
 * Response:
 * {
 *   "success": true,
 *   "message": { ... }
 * }
 */

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAccessToken } from "@/lib/services/ticketing/integration-service"
import { addTicketMessage } from "@/lib/services/ticketing/ticket-message-service"
import type { TicketMessageAttachment } from "@/lib/services/ticketing/types"
import { SenderType } from "@prisma/client"

interface RouteParams {
  params: Promise<{ id: string }>
}

// Validation schema for add message
const addMessageSchema = {
  message: (val: string) =>
    typeof val === "string" && val.length >= 1 && val.length <= 5000,
  attachments: (val: unknown) => !val || Array.isArray(val),
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: ticketId } = await params
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    // Token is required
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "TOKEN_REQUIRED",
          message: "Token akses diperlukan",
        },
        { status: 401 }
      )
    }

    // Verify token - accept create_ticket, list_tickets, and view_ticket
    let tokenPayload: Awaited<ReturnType<typeof verifyAccessToken>> | null =
      null
    try {
      tokenPayload = await verifyAccessToken(token)

      // Accept any valid token purpose for adding messages
      const validPurposes = ["view_ticket", "create_ticket", "list_tickets"]
      if (!validPurposes.includes(tokenPayload.purpose)) {
        return NextResponse.json(
          {
            success: false,
            error: "INVALID_TOKEN_PURPOSE",
            message: "Token tidak valid untuk mengirim pesan",
          },
          { status: 401 }
        )
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "INVALID_TOKEN"
      if (
        message === "TOKEN_EXPIRED" ||
        message === "INVALID_TOKEN" ||
        message === "INVALID_TOKEN_PURPOSE" ||
        message === "CHANNEL_NOT_FOUND" ||
        message === "CHANNEL_INACTIVE"
      ) {
        return NextResponse.json(
          {
            success: false,
            error: message,
            message:
              message === "TOKEN_EXPIRED"
                ? "Token akses telah kadaluarsa"
                : "Token akses tidak valid",
          },
          { status: 401 }
        )
      }
      throw error
    }

    // Parse and validate request body
    const body = await request.json()
    const { message, attachments } = body

    // Validate message
    if (!addMessageSchema.message(message)) {
      return NextResponse.json(
        {
          success: false,
          error: "VALIDATION_ERROR",
          message: "Pesan harus 1-5000 karakter",
        },
        { status: 400 }
      )
    }

    // Validate attachments if provided
    if (attachments && !addMessageSchema.attachments(attachments)) {
      return NextResponse.json(
        {
          success: false,
          error: "VALIDATION_ERROR",
          message: "Lampiran harus berupa array",
        },
        { status: 400 }
      )
    }

    // Get ticket to verify ownership
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    })

    if (!ticket) {
      return NextResponse.json(
        {
          success: false,
          error: "TICKET_NOT_FOUND",
          message: "Tiket tidak ditemukan",
        },
        { status: 404 }
      )
    }

    // Verify ticket belongs to the channel
    if (!tokenPayload || ticket.channelId !== tokenPayload.channelId) {
      return NextResponse.json(
        {
          success: false,
          error: "ACCESS_DENIED",
          message: "Anda tidak memiliki akses ke tiket ini",
        },
        { status: 403 }
      )
    }

    // Verify user ownership
    const externalUserIdMatch =
      tokenPayload.externalUserId &&
      ticket.externalUserId === tokenPayload.externalUserId
    const emailMatch =
      tokenPayload.email && ticket.guestEmail === tokenPayload.email

    if (!externalUserIdMatch && !emailMatch) {
      return NextResponse.json(
        {
          success: false,
          error: "ACCESS_DENIED",
          message: "Anda tidak memiliki akses ke tiket ini",
        },
        { status: 403 }
      )
    }

    // Add the message
    const newMessage = await addTicketMessage({
      ticketId,
      sender: SenderType.CUSTOMER,
      message,
      attachments: attachments || undefined,
      isInternal: false,
    })

    return NextResponse.json(
      {
        success: true,
        message: {
          id: newMessage.id,
          message: newMessage.message,
          sender: newMessage.sender,
          attachments: newMessage.attachments as
            | TicketMessageAttachment[]
            | null,
          createdAt: newMessage.createdAt.toISOString(),
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error adding message:", error)
    return NextResponse.json(
      {
        success: false,
        error: "INTERNAL_ERROR",
        message: "Terjadi kesalahan saat mengirim pesan",
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/integrated/tickets/[id]/messages
 *
 * Get all messages for a ticket (non-internal only)
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: ticketId } = await params
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    // Token is required
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "TOKEN_REQUIRED",
          message: "Token akses diperlukan",
        },
        { status: 401 }
      )
    }

    // Verify token
    let tokenPayload: Awaited<ReturnType<typeof verifyAccessToken>> | null =
      null
    try {
      tokenPayload = await verifyAccessToken(token)

      const validPurposes = ["view_ticket", "create_ticket", "list_tickets"]
      if (!validPurposes.includes(tokenPayload.purpose)) {
        return NextResponse.json(
          {
            success: false,
            error: "INVALID_TOKEN_PURPOSE",
            message: "Token tidak valid",
          },
          { status: 401 }
        )
      }
    } catch (error: unknown) {
      return NextResponse.json(
        {
          success: false,
          error:
            error instanceof Error && error.message === "TOKEN_EXPIRED"
              ? "TOKEN_EXPIRED"
              : "INVALID_TOKEN",
          message: "Token tidak valid",
        },
        { status: 401 }
      )
    }

    // Get ticket to verify ownership
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    })

    if (!ticket) {
      return NextResponse.json(
        {
          success: false,
          error: "TICKET_NOT_FOUND",
          message: "Tiket tidak ditemukan",
        },
        { status: 404 }
      )
    }

    // Verify ownership
    if (ticket.channelId !== tokenPayload.channelId) {
      return NextResponse.json(
        {
          success: false,
          error: "ACCESS_DENIED",
          message: "Anda tidak memiliki akses ke tiket ini",
        },
        { status: 403 }
      )
    }

    const externalUserIdMatch =
      tokenPayload.externalUserId &&
      ticket.externalUserId === tokenPayload.externalUserId
    const emailMatch =
      tokenPayload.email && ticket.guestEmail === tokenPayload.email

    if (!externalUserIdMatch && !emailMatch) {
      return NextResponse.json(
        {
          success: false,
          error: "ACCESS_DENIED",
          message: "Anda tidak memiliki akses ke tiket ini",
        },
        { status: 403 }
      )
    }

    // Get messages
    const messages = await prisma.ticketMessage.findMany({
      where: {
        ticketId,
        isInternal: false,
      },
      orderBy: {
        createdAt: "asc",
      },
    })

    return NextResponse.json({
      success: true,
      messages: messages.map((msg) => ({
        id: msg.id,
        message: msg.message,
        sender: msg.sender,
        attachments: msg.attachments,
        createdAt: msg.createdAt.toISOString(),
      })),
    })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json(
      {
        success: false,
        error: "INTERNAL_ERROR",
        message: "Terjadi kesalahan saat memuat pesan",
      },
      { status: 500 }
    )
  }
}
