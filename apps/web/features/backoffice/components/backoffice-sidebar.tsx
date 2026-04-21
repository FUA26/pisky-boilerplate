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
  UsersIcon,
  BarChartIcon,
  SettingsIcon,
  PackageIcon,
  ShoppingCartIcon,
} from "lucide-react"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/backoffice",
      icon: <BarChartIcon />,
      isActive: true,
    },
    {
      title: "Users",
      url: "/backoffice/users",
      icon: <UsersIcon />,
      items: [
        {
          title: "Roles",
          url: "/backoffice/users/roles",
        },
        {
          title: "Activity",
          url: "/backoffice/users/activity",
        },
      ],
    },
    {
      title: "Products",
      url: "/backoffice/products",
      icon: <PackageIcon />,
      items: [
        {
          title: "Inventory",
          url: "/backoffice/products/inventory",
        },
        {
          title: "Categories",
          url: "/backoffice/products/categories",
        },
      ],
    },
    {
      title: "Orders",
      url: "/backoffice/orders",
      icon: <ShoppingCartIcon />,
      items: [
        {
          title: "Pending",
          url: "/backoffice/orders/pending",
        },
        {
          title: "Fulfilled",
          url: "/backoffice/orders/fulfilled",
        },
      ],
    },
    {
      title: "Settings",
      url: "/backoffice/settings",
      icon: <SettingsIcon />,
      items: [
        {
          title: "General",
          url: "/backoffice/settings/general",
        },
        {
          title: "Billing",
          url: "/backoffice/settings/billing",
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
      className="border-r border-[oklch(0.92_0.002_165)] bg-[oklch(0.998_0.001_165)] text-sidebar-foreground shadow-sm md:shadow-none"
      {...props}
    >
      <SidebarHeader className="h-16 border-b border-[oklch(0.92_0.002_165)] bg-[oklch(0.998_0.001_165)] px-3 group-data-[collapsible=icon]:!h-12 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent className="px-3 py-2 group-data-[collapsible=icon]:px-2">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
