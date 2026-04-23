import { auth } from "@/lib/auth/config"
import { userService } from "@/lib/services/user-service"
import { changePasswordSchema } from "@/lib/validations/user"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = changePasswordSchema.parse(body)

    await userService.changeCurrentUserPassword(
      session.user.id as string,
      validatedData
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    if ((error as { name?: string })?.name === "ZodError") {
      return NextResponse.json(
        {
          error: "Validation Error",
          details: (error as { errors?: unknown }).errors,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to change password",
      },
      { status: 500 }
    )
  }
}
