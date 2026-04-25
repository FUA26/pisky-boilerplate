"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { getAppIdentity } from "@/lib/config/app-identity"
import { cn } from "@workspace/ui/lib/utils"
import type { ReactNode } from "react"

export function AppIdentityBanner({
  showDescription = false,
  showPattern = false,
}: {
  showDescription?: boolean
  showPattern?: boolean
}) {
  const app = getAppIdentity()

  return (
    <Card
      className={cn(
        "overflow-hidden",
        showPattern && "bg-gradient-to-br from-primary/10 to-transparent"
      )}
    >
      <CardHeader>
        <CardTitle>{app.fullName}</CardTitle>
        {showDescription ? (
          <CardDescription>{app.description}</CardDescription>
        ) : null}
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        {app.name} · {app.version}
      </CardContent>
    </Card>
  )
}

export function PageHeaderWithIdentity({
  title,
  description,
  actions,
}: {
  title: string
  description?: string
  actions?: ReactNode
}) {
  const app = getAppIdentity()
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">
          {description ?? app.description}
        </p>
      </div>
      {actions ? <div>{actions}</div> : null}
    </div>
  )
}
