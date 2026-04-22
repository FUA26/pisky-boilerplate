import { auth } from "@/lib/auth/config"
import { requirePermission } from "@/lib/rbac/permissions"
import { roleService } from "@/lib/services/role-service"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await requirePermission(session.user.id, "ADMIN_ROLES_MANAGE")

    const { searchParams } = new URL(req.url)
    const includeStats = searchParams.get("stats") === "true"

    const roles = await roleService.listRoles()

    let stats = null
    if (includeStats) {
      stats = await roleService.getRoleStats()
    }

    return NextResponse.json({
      roles,
      stats,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch roles",
      },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await requirePermission(session.user.id, "ROLE_CREATE")

    const body = await req.json()
    const role = await roleService.createRole(body)

    return NextResponse.json(role, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create role",
      },
      { status: 500 }
    )
  }
}
