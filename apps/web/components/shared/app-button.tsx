"use client"

import { Button } from "@workspace/ui/components/button"
import type { ComponentProps } from "react"

type BaseProps = Omit<ComponentProps<typeof Button>, "variant"> & {
  variant?:
    | ComponentProps<typeof Button>["variant"]
    | "primary"
    | "app-ghost"
    | "app-outline"
}

export function AppButton({
  className,
  variant = "default",
  ...props
}: BaseProps) {
  const resolvedVariant =
    variant === "primary"
      ? "default"
      : variant === "app-ghost"
        ? "ghost"
        : variant === "app-outline"
          ? "outline"
          : variant

  return <Button variant={resolvedVariant} className={className} {...props} />
}

export function AppActionButton(props: BaseProps) {
  return <Button variant="default" {...props} />
}

export function AppIconButton(props: BaseProps) {
  return <Button variant="outline" size="icon" {...props} />
}
