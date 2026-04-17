import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"

// TODO: Replace with your actual user model and database
// This is a placeholder for demonstration
export async function getUserByEmail(email: string) {
  // Implement your database query here
  // Example: return db.user.findUnique({ where: { email } })
  return null
}

// TODO: Replace with your actual password verification
export async function verifyPassword(password: string, hashedPassword: string) {
  const bcrypt = await import("bcryptjs")
  return bcrypt.compare(password, hashedPassword)
}

// TODO: Replace with your actual password hashing
export async function hashPassword(password: string) {
  const bcrypt = await import("bcryptjs")
  return bcrypt.hash(password, 10)
}

const config = {
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials: unknown) => {
        const parsedCredentials = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
          })
          .safeParse(credentials)

        if (!parsedCredentials.success) {
          return null
        }

        const { email, password } = parsedCredentials.data

        // TODO: Implement actual user authentication
        // const user = await getUserByEmail(email)
        // if (!user) return null
        // const isValidPassword = await verifyPassword(password, user.password)
        // if (!isValidPassword) return null
        // return { id: user.id, email: user.email, name: user.name }

        // Placeholder for demo - remove in production
        console.log("Auth attempt:", email)
        return null
      },
    }),
  ],
  pages: {
    signIn: "/auth/sign-in",
    error: "/auth/sign-in",
  },
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token?.id) {
        session.user.id = token.id as string
      }
      return session
    },
  },
}

// Disable portable type inference for NextAuth exports
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const { handlers, signIn, signOut, auth } = NextAuth(config) as any
