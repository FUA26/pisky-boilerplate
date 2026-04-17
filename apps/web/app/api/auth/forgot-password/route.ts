import { forgotPasswordSchema } from "@/lib/auth-validation"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validatedFields = forgotPasswordSchema.safeParse(body)

    if (!validatedFields.success) {
      return NextResponse.json(
        { message: "Invalid email", errors: validatedFields.error.flatten() },
        { status: 400 }
      )
    }

    const { email } = validatedFields.data

    // TODO: Check if user exists and generate reset token
    // const user = await getUserByEmail(email)
    // if (!user) {
    //   // Still return success to prevent email enumeration
    //   return NextResponse.json({ message: "Reset email sent" })
    // }
    //
    // const token = generateResetToken()
    // await db.passwordReset.create({
    //   data: { userId: user.id, token, expiresAt: new Date(Date.now() + 3600000) }
    // })
    //
    // await sendResetEmail(email, token)

    console.log("Password reset requested for:", email)

    return NextResponse.json({ message: "Reset email sent" })
  } catch {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
}
