import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: {
        id: string
        name: string
        permissions: string[]
      }
    }
  }
}
