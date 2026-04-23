// apps/web/app/api/permissions/route.ts
import { auth } from "@/lib/auth/config"
import { permissionService } from "@/lib/services/permission-service"
import { requirePermission } from "@/lib/rbac/permissions"
import { createPermissionSchema } from "@/lib/validations/permission"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await requirePermission(session.user.id, "PERMISSION_READ")

    const { searchParams } = new URL(req.url)
    const includeUsage = searchParams.get("includeUsage") === "true"
    const includeStats = searchParams.get("stats") === "true"

    const permissions = await permissionService.listPermissions({
      includeUsage,
    })

    let stats = null
    if (includeStats) {
      stats = await permissionService.getPermissionStats()
    }

    return NextResponse.json({
      permissions,
      stats,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch permissions",
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

    await requirePermission(session.user.id, "PERMISSION_ASSIGN")

    const body = await req.json()
    const validatedData = createPermissionSchema.parse(body)

    const permission = await permissionService.createPermission(validatedData)

    return NextResponse.json(
      {
        permission,
        message: "Permission created successfully",
      },
      { status: 201 }
    )
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        {
          error: "Validation Error",
          details: error.errors,
        },
        { status: 400 }
      )
    }

    if (error.code === "P2002") {
      return NextResponse.json(
        {
          error: "Conflict",
          message: "Permission with this name already exists",
        },
        { status: 409 }
      )
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create permission",
      },
      { status: 500 }
    )
  }
}
