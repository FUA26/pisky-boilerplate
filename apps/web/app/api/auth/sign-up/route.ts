import { hashPassword } from "@/lib/auth"
import { signUpSchema } from "@/lib/auth-validation"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validatedFields = signUpSchema.safeParse(body)

    if (!validatedFields.success) {
      return NextResponse.json(
        { message: "Invalid fields", errors: validatedFields.error.flatten() },
        { status: 400 }
      )
    }

    const { name, email, password } = validatedFields.data

    // TODO: Check if user already exists
    // const existingUser = await getUserByEmail(email)
    // if (existingUser) {
    //   return NextResponse.json(
    //     { message: "User already exists" },
    //     { status: 400 }
    //   )
    // }

    // TODO: Create user in database
    // const hashedPassword = await hashPassword(password)
    // const user = await db.user.create({
    //   data: { name, email, password: hashedPassword }
    // })

    console.log("Sign up attempt:", { name, email })

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    )
  } catch {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
}
