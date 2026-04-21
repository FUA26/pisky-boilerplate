"use client"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@workspace/ui/components/sidebar"
import { ChevronRightIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@workspace/ui/lib/utils"

function matchesPath(pathname: string, url: string) {
  return pathname === url || pathname.startsWith(`${url}/`)
}

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: React.ReactNode
    isActive?: boolean
    items?: {
      title: string
      url: string
      isActive?: boolean
    }[]
  }[]
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:p-0">
      <SidebarGroupLabel className="text-xs font-medium text-sidebar-foreground/70 group-data-[collapsible=icon]/sidebar-wrapper:hidden">
        Navigation
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="gap-2">
          {items.map((item) => {
            const hasSubItems = Boolean(item.items?.length)
            const isLeafActive = matchesPath(pathname, item.url)
            const isSubItemActive = item.items?.some((subItem) =>
              matchesPath(pathname, subItem.url)
            )
            const isItemActive = Boolean(
              item.isActive || isLeafActive || isSubItemActive
            )

            if (!hasSubItems) {
              return (
                <SidebarMenuItem key={item.title}>
                  <a
                    href={item.url}
                    className={cn(
                      "flex h-8 items-center gap-3 rounded-lg text-sm font-medium transition-all duration-200",
                      "focus-visible:ring-2 focus-visible:ring-sidebar-ring/70 focus-visible:outline-none",
                      isItemActive
                        ? "cursor-pointer bg-primary px-2 text-primary-foreground shadow-sm hover:opacity-90"
                        : "cursor-pointer px-4 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-sm"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-flex size-4 shrink-0 items-center justify-center transition-colors [&_svg]:size-4",
                        isItemActive
                          ? "text-primary-foreground"
                          : "text-sidebar-foreground/90"
                      )}
                    >
                      {item.icon}
                    </span>
                    <span className="flex h-full min-w-0 flex-1 items-center truncate text-left text-[15px] leading-none group-data-[collapsible=icon]:hidden">
                      {item.title}
                    </span>
                  </a>
                </SidebarMenuItem>
              )
            }

            return (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={isItemActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <button
                      className={cn(
                        "flex h-8 w-full items-center gap-3 rounded-lg px-2 text-sm font-medium transition-all duration-200",
                        "focus-visible:ring-2 focus-visible:ring-sidebar-ring/70 focus-visible:outline-none",
                        isItemActive
                          ? "cursor-pointer bg-primary text-primary-foreground shadow-sm hover:opacity-90"
                          : "cursor-pointer text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-sm"
                      )}
                    >
                      <span
                        className={cn(
                          "inline-flex size-4 shrink-0 items-center justify-center transition-colors [&_svg]:size-4",
                          isItemActive
                            ? "text-primary-foreground"
                            : "text-sidebar-foreground/90"
                        )}
                      >
                        {item.icon}
                      </span>
                      <span className="flex h-full min-w-0 flex-1 items-center truncate text-left text-[15px] leading-none group-data-[collapsible=icon]/sidebar-wrapper:hidden">
                        {item.title}
                      </span>
                      <span
                        className={cn(
                          "inline-flex size-4 shrink-0 items-center justify-center transition-transform duration-200 group-data-[collapsible=icon]:hidden [&_svg]:size-4",
                          "text-sidebar-foreground/40 group-hover/collapsible:text-sidebar-foreground/60",
                          isItemActive && "text-primary-foreground/80",
                          "group-data-[state=open]/collapsible:rotate-90"
                        )}
                      >
                        <ChevronRightIcon />
                      </span>
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub className="mt-1 px-2">
                      {item.items?.map((subItem) => {
                        const subItemActive = matchesPath(pathname, subItem.url)

                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <a
                              href={subItem.url}
                              className={cn(
                                "flex h-9 items-center rounded-lg px-3 text-sm font-medium transition-colors",
                                "focus-visible:ring-2 focus-visible:ring-sidebar-ring/70 focus-visible:outline-none",
                                subItemActive
                                  ? "cursor-pointer bg-primary text-primary-foreground shadow-sm hover:opacity-90"
                                  : "cursor-pointer text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                              )}
                            >
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubItem>
                        )
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
