import { auth } from "@/lib/auth/config"
import { requirePermission } from "@/lib/rbac/permissions"
import { userService } from "@/lib/services/user-service"
import { updateUserSchema } from "@/lib/validations/user"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await requirePermission(session.user.id, "USER_READ")

    const { id } = await params
    const user = await userService.getUserById(id)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch user",
      },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await requirePermission(session.user.id, "USER_UPDATE")

    const { id } = await params
    const body = await req.json()

    const validatedData = updateUserSchema.parse(body)
    const user = await userService.updateUser(id, validatedData)

    return NextResponse.json({ user })
  } catch (error) {
    if ((error as any)?.name === "ZodError") {
      return NextResponse.json(
        {
          error: "Validation Error",
          details: (error as any).errors,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to update user",
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await requirePermission(session.user.id, "USER_DELETE")

    const { id } = await params
    await userService.deleteUser(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to delete user",
      },
      { status: 500 }
    )
  }
}
