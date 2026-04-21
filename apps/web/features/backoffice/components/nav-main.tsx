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
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@workspace/ui/components/sidebar"
import { ChevronRightIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@workspace/ui/lib/utils"
import * as React from "react"

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
      <SidebarGroupLabel className="text-xs font-medium text-muted-foreground group-data-[collapsible=icon]/sidebar-wrapper:hidden">
        Navigation
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="gap-2">
          {items.map((item, index) => {
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
                <SidebarMenuItem
                  key={item.title}
                  className="menu-item-enter"
                  style={
                    {
                      "--animation-delay": `${index * 50}ms`,
                    } as React.CSSProperties
                  }
                >
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={isItemActive}
                    asChild
                  >
                    <a href={item.url}>
                      <span
                        className={cn(
                          "inline-flex size-4 shrink-0 items-center justify-center transition-all duration-200 ease-out [&_svg]:size-4",
                          isItemActive
                            ? "text-primary-foreground"
                            : "text-sidebar-primary"
                        )}
                      >
                        {item.icon}
                      </span>
                      <span className="flex h-full min-w-0 flex-1 items-center truncate text-left text-sm leading-none">
                        {item.title}
                      </span>
                    </a>
                  </SidebarMenuButton>
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
                <SidebarMenuItem
                  className="menu-item-enter"
                  style={
                    {
                      "--animation-delay": `${index * 50}ms`,
                    } as React.CSSProperties
                  }
                >
                  <CollapsibleTrigger asChild>
                    <button
                      type="button"
                      aria-expanded={isItemActive}
                      aria-label={`${isItemActive ? "Collapse" : "Expand"} ${item.title} menu`}
                      className={cn(
                        "group/link relative flex h-9 w-full items-center gap-3 rounded-lg px-2.5 text-sm font-medium transition-all duration-200 ease-out",
                        "group-data-[collapsible=icon]:size-7 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:p-0",
                        "focus-visible:ring-2 focus-visible:ring-sidebar-ring/70 focus-visible:outline-none",
                        "hover:scale-[1.01] hover:shadow-sm",
                        "group-data-[collapsible=icon]:hover:scale-110",
                        isItemActive
                          ? "active-enter cursor-pointer bg-primary text-primary-foreground shadow-sm group-data-[collapsible=icon]:bg-primary"
                          : "cursor-pointer text-sidebar-foreground/80 group-data-[collapsible=icon]:bg-transparent hover:bg-sidebar-accent hover:text-sidebar-foreground"
                      )}
                    >
                      <span
                        className={cn(
                          "inline-flex size-4 shrink-0 items-center justify-center transition-all duration-200 ease-out [&_svg]:size-4",
                          "group-hover/link:scale-110",
                          isItemActive
                            ? "text-primary-foreground"
                            : "text-sidebar-primary"
                        )}
                      >
                        {item.icon}
                      </span>
                      <span className="flex h-full min-w-0 flex-1 items-center truncate text-left text-sm leading-none group-data-[collapsible=icon]:hidden">
                        {item.title}
                      </span>
                      <span
                        className={cn(
                          "inline-flex size-4 shrink-0 items-center justify-center transition-all duration-300 ease-out group-data-[collapsible=icon]:hidden [&_svg]:size-4",
                          "text-muted-foreground group-hover/link:group-hover/collapsible:text-foreground",
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
                      {item.items?.map((subItem, subIndex) => {
                        const subItemActive = matchesPath(pathname, subItem.url)

                        return (
                          <SidebarMenuSubItem
                            key={subItem.title}
                            className="sub-item-enter"
                            style={
                              {
                                "--animation-delay": `${subIndex * 40}ms`,
                              } as React.CSSProperties
                            }
                          >
                            <a
                              href={subItem.url}
                              aria-current={subItemActive ? "page" : undefined}
                              className={cn(
                                "group/sublink relative flex h-9 items-center rounded-lg px-3 text-sm font-medium transition-all duration-200 ease-out",
                                "focus-visible:ring-2 focus-visible:ring-sidebar-ring/70 focus-visible:outline-none",
                                "hover:translate-x-0.5 hover:scale-[1.01]",
                                subItemActive
                                  ? "active-enter cursor-pointer bg-primary text-primary-foreground shadow-sm"
                                  : "cursor-pointer text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                              )}
                            >
                              <span className="transition-transform duration-200 group-hover/sublink:scale-105">
                                {subItem.title}
                              </span>
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
