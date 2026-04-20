import * as React from "react"

import { cn } from "@workspace/ui/lib/utils"

type ContainerSize = "default" | "sm" | "md" | "lg" | "xl" | "full"

const sizeMap: Record<ContainerSize, string> = {
  default: "max-w-7xl",
  sm: "max-w-md",
  md: "max-w-3xl",
  lg: "max-w-5xl",
  xl: "max-w-6xl",
  full: "max-w-full",
}

function Container({
  className,
  size = "default",
  centered = true,
  ...props
}: React.ComponentProps<"div"> & {
  size?: ContainerSize
  centered?: boolean
}) {
  return (
    <div
      data-slot="container"
      data-size={size}
      className={cn(
        "w-full px-4 sm:px-6 lg:px-8",
        centered && "mx-auto",
        sizeMap[size],
        className
      )}
      {...props}
    />
  )
}

function ContainerInner({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="container-inner"
      className={cn("mx-auto max-w-2xl", className)}
      {...props}
    />
  )
}

export { Container, ContainerInner }
