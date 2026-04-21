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
                    <a
                      href={item.url}
                      className={cn(
                        "relative flex h-9 items-center gap-3 rounded-lg text-sm font-medium transition-all duration-200 ease-out",
                        "focus-visible:ring-2 focus-visible:ring-sidebar-ring/70 focus-visible:outline-none",
                        isItemActive
                          ? "bg-teal-600 text-white shadow-sm"
                          : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                      )}
                    >
                      <span
                        className={cn(
                          "inline-flex size-4 shrink-0 items-center justify-center transition-all duration-200 ease-out [&_svg]:size-4",
                          isItemActive
                            ? "text-white"
                            : "text-sidebar-primary group-hover/link:scale-110 group-hover/link:text-teal-600 dark:group-hover/link:text-teal-400"
                        )}
                      >
                        {item.icon}
                      </span>
                      <span
                        className={cn(
                          "flex h-full min-w-0 flex-1 items-center truncate text-left text-sm leading-none",
                          isItemActive
                            ? "text-white"
                            : "group-hover/link:text-teal-700 dark:group-hover/link:text-teal-300"
                        )}
                      >
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
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={isItemActive}
                    >
                      <span
                        className={cn(
                          "inline-flex size-4 shrink-0 items-center justify-center transition-all duration-200 ease-out [&_svg]:size-4",
                          isItemActive
                            ? "text-white"
                            : "text-sidebar-primary group-hover/menu-button:scale-110 group-hover/menu-button:text-teal-600 dark:group-hover/menu-button:text-teal-400"
                        )}
                      >
                        {item.icon}
                      </span>
                      <span
                        className={cn(
                          "flex h-full min-w-0 flex-1 items-center truncate text-left text-sm leading-none",
                          isItemActive
                            ? "text-white"
                            : "group-hover/menu-button:text-teal-700 dark:group-hover/menu-button:text-teal-300"
                        )}
                      >
                        {item.title}
                      </span>
                      <span
                        className={cn(
                          "inline-flex size-4 shrink-0 items-center justify-center transition-all duration-300 ease-out [&_svg]:size-4",
                          "text-muted-foreground",
                          isItemActive
                            ? "text-white/80"
                            : "group-hover/menu-button:text-teal-600 dark:group-hover/menu-button:text-teal-400",
                          "group-data-[state=open]/collapsible:rotate-90"
                        )}
                      >
                        <ChevronRightIcon />
                      </span>
                    </SidebarMenuButton>
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
                            <SidebarMenuSubButton
                              tooltip={`${item.title} → ${subItem.title}`}
                              isActive={subItemActive}
                              asChild
                            >
                              <a
                                href={subItem.url}
                                aria-current={
                                  subItemActive ? "page" : undefined
                                }
                                className={cn(
                                  "relative flex h-9 items-center rounded-lg px-3 text-sm font-medium transition-all duration-200 ease-out",
                                  "focus-visible:ring-2 focus-visible:ring-sidebar-ring/70 focus-visible:outline-none",
                                  subItemActive
                                    ? "bg-teal-600 text-white shadow-sm"
                                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                                )}
                              >
                                <span
                                  className={cn(
                                    "transition-transform duration-200",
                                    subItemActive
                                      ? "text-white"
                                      : "group-hover/sublink:scale-105 group-hover/sublink:text-teal-700 dark:group-hover/sublink:text-teal-300"
                                  )}
                                >
                                  {subItem.title}
                                </span>
                              </a>
                            </SidebarMenuSubButton>
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
