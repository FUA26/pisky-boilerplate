import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/permissions"
import { requirePermission } from "@/lib/auth/permissions"
import { createChannel as createChannelService } from "@/lib/services/ticketing/app-service"
import { createChannelSchema } from "@/lib/validations/app-validation"

/**
 * POST /api/channels - Create a new channel
 */
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth()
    await requirePermission(session.user.id, "TICKET_APP_MANAGE")

    const body = await request.json()

    // Validate input
    const validated = createChannelSchema.parse(body)

    const channel = await createChannelService(
      {
        appId: validated.appId,
        type: validated.type,
        name: validated.name,
        slug: validated.slug,
        config: validated.config,
        isActive: validated.isActive,
      },
      session.user.id
    )

    return NextResponse.json(channel, { status: 201 })
  } catch (error) {
    console.error("Error creating channel:", error)
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create channel",
      },
      { status: 400 }
    )
  }
}
