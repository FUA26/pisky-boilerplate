"use client"

import * as React from "react"

import { NavMain } from "@/features/backoffice/components/nav-main"
import { TeamSwitcher } from "@/features/backoffice/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@workspace/ui/components/sidebar"
import {
  ShieldCheck,
  LayoutDashboard,
  Ticket,
  CheckSquare,
  UserCog,
  AppWindow,
  ChartLine,
} from "lucide-react"

const data = {
  navMain: [
    {
      title: "Main",
      url: "/dashboard",
      icon: <LayoutDashboard />,
    },
    {
      title: "Task Management",
      icon: <CheckSquare />,
      items: [
        {
          title: "Tasks",
          url: "/tasks",
        },
      ],
    },
    {
      title: "Ticketing",
      icon: <Ticket />,
      items: [
        {
          title: "Tickets",
          url: "/tickets",
        },
        {
          title: "Access Requests",
          url: "/access-requests",
        },
      ],
    },
    {
      title: "Apps & Analytics",
      icon: <AppWindow />,
      items: [
        {
          title: "Apps",
          url: "/apps",
        },
        {
          title: "Analytics",
          url: "/analytics",
        },
      ],
    },
    {
      title: "Access Management",
      icon: <ShieldCheck />,
      items: [
        {
          title: "Users",
          url: "/backoffice/access-management/users",
        },
        {
          title: "Roles",
          url: "/backoffice/access-management/roles",
        },
        {
          title: "Permissions",
          url: "/backoffice/access-management/permissions",
        },
        {
          title: "System Settings",
          url: "/backoffice/settings",
        },
      ],
    },
    {
      title: "Account",
      icon: <UserCog />,
      items: [
        {
          title: "Profile",
          url: "/profile",
        },
        {
          title: "Settings",
          url: "/settings",
        },
      ],
    },
    {
      title: "Demo",
      icon: <ChartLine />,
      items: [
        {
          title: "Advanced Table",
          url: "/demo/advanced-table",
        },
        {
          title: "App Identity Demo",
          url: "/app-identity-demo",
        },
      ],
    },
  ],
}

export function BackofficeSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-sm md:shadow-none"
      {...props}
    >
      <SidebarHeader className="h-16 border-b border-sidebar-border bg-sidebar px-3 group-data-[collapsible=icon]:!h-12 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent className="px-3 py-2 group-data-[collapsible=icon]:px-2">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
