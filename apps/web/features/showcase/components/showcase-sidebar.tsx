"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { categories, components } from "../lib/component-data"

export function ShowcaseSidebar() {
  const pathname = usePathname()

  const isCategoryActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + "#")
  }

  const isComponentActive = (path: string) => {
    return pathname.endsWith(path.split("#")[1])
  }

  return (
    <aside className="fixed top-0 left-0 z-30 h-screen w-64 border-r border-border bg-background">
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-2 border-b border-border px-6 py-4">
          <Link href="/components" className="font-semibold text-foreground">
            Components
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-4">
          <ul className="space-y-6">
            {categories.map((category) => (
              <li key={category.path}>
                <Link
                  href={category.path}
                  className={cn(
                    "mb-2 flex items-center gap-1 text-sm font-medium",
                    isCategoryActive(category.path)
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <ChevronRight className="size-4" />
                  {category.name}
                </Link>
                <ul className="ml-6 space-y-1">
                  {category.components.map((componentKey) => {
                    const component = components[componentKey]
                    if (!component) return null
                    return (
                      <li key={componentKey}>
                        <Link
                          href={component.path}
                          className={cn(
                            "block rounded-md px-2 py-1 text-sm transition-colors",
                            isComponentActive(component.path)
                              ? "bg-muted text-foreground"
                              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                          )}
                        >
                          {component.name}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  )
}
