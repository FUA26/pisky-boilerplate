import { hashPassword } from "@/lib/auth"
import { resetPasswordSchema } from "@/lib/auth-validation"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const token = body.token

    if (!token) {
      return NextResponse.json(
        { message: "Token is required" },
        { status: 400 }
      )
    }

    const validatedFields = resetPasswordSchema.safeParse(body)

    if (!validatedFields.success) {
      return NextResponse.json(
        { message: "Invalid fields", errors: validatedFields.error.flatten() },
        { status: 400 }
      )
    }

    const { password } = validatedFields.data

    // TODO: Verify token and update password
    // const reset = await db.passwordReset.findUnique({ where: { token } })
    // if (!reset || reset.expiresAt < new Date()) {
    //   return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 })
    // }
    //
    // const hashedPassword = await hashPassword(password)
    // await db.user.update({
    //   where: { id: reset.userId },
    //   data: { password: hashedPassword }
    // })
    //
    // await db.passwordReset.delete({ where: { token } })

    console.log("Password reset attempt with token")

    return NextResponse.json({ message: "Password reset successfully" })
  } catch {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
}
