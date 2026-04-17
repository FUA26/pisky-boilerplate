import { signIn } from "@/lib/auth"
import { signInSchema } from "@/lib/auth-validation"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validatedFields = signInSchema.safeParse(body)

    if (!validatedFields.success) {
      return NextResponse.json(
        { message: "Invalid fields", errors: validatedFields.error.flatten() },
        { status: 400 }
      )
    }

    const { email, password } = validatedFields.data

    // Use NextAuth's signIn with credentials
    // Note: This will be handled by the NextAuth handler
    // This endpoint is a convenience wrapper for client-side calls
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      )
    }

    return NextResponse.json({ message: "Signed in successfully" })
  } catch {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
}
