import { Role } from "@prisma/client"

declare module "next-auth" {
  interface User {
    role?: Role
    id?: string
  }

  interface Session {
    user: {
      email?: string | null
      name?: string | null
      image?: string | null
      role?: Role
      id?: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role
    id?: string
  }
}
