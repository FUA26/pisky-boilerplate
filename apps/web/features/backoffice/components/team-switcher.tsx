"use client"

import * as React from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { useSidebar } from "@workspace/ui/components/sidebar"
import { cn } from "@workspace/ui/lib/utils"
import {
  ChevronsUpDownIcon,
  PlusIcon,
  Building2Icon,
  StoreIcon,
  LayoutDashboardIcon,
} from "lucide-react"

const teams = [
  {
    name: "Zilpo Dev",
    logo: <Building2Icon className="size-4" />,
    plan: "Development",
  },
  {
    name: "Zilpo Staging",
    logo: <StoreIcon className="size-4" />,
    plan: "Staging",
  },
  {
    name: "Zilpo Production",
    logo: <LayoutDashboardIcon className="size-4" />,
    plan: "Production",
  },
]

export function TeamSwitcher() {
  const { isMobile, state } = useSidebar()
  const [activeTeam, setActiveTeam] = React.useState(teams[0])
  const isCollapsed = state === "collapsed"

  if (!activeTeam) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex w-full cursor-pointer items-center gap-2 overflow-hidden rounded-lg p-2 text-left transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground",
            isCollapsed &&
              "justify-center gap-0 p-1.5 hover:scale-105 active:scale-95"
          )}
        >
          <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground transition-transform duration-200">
            {activeTeam.logo}
          </div>
          {!isCollapsed && (
            <>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeTeam.name}</span>
                <span className="truncate text-xs text-sidebar-foreground/70">
                  {activeTeam.plan}
                </span>
              </div>
              <ChevronsUpDownIcon className="ml-auto size-4 shrink-0 opacity-50" />
            </>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 rounded-lg"
        align="start"
        side={isMobile ? "bottom" : "right"}
        sideOffset={4}
      >
        <DropdownMenuLabel className="text-xs text-sidebar-foreground/60">
          Environments
        </DropdownMenuLabel>
        {teams.map((team, index) => (
          <DropdownMenuItem
            key={team.name}
            onClick={() => setActiveTeam(team)}
            className="gap-2 p-2"
          >
            <div className="flex size-6 shrink-0 items-center justify-center rounded-sm border bg-sidebar-accent/50">
              {team.logo}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{team.name}</span>
              <span className="text-xs text-sidebar-foreground/60">
                {team.plan}
              </span>
            </div>
            <DropdownMenuShortcut className="ml-auto">
              ⌘{index + 1}
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2 p-2">
          <div className="flex size-6 shrink-0 items-center justify-center rounded-sm border">
            <PlusIcon className="size-4" />
          </div>
          <div className="font-medium text-sidebar-foreground/70">
            Add environment
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
