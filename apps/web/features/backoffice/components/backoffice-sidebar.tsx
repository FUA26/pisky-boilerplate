"use client"

import * as React from "react"

import { NavMain } from "@/features/backoffice/components/nav-main"
import { WorkspaceSwitcher } from "@/features/backoffice/components/workspace-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@workspace/ui/components/sidebar"
import {
  ShieldIcon,
  UsersIcon,
  BarChartIcon,
  SettingsIcon,
  FileTextIcon,
  ShoppingCartIcon,
  PackageIcon,
  TagIcon,
  HeadphonesIcon,
  MegaphoneIcon,
  LayoutGridIcon,
  DatabaseIcon,
} from "lucide-react"

const data = {
  workspaces: [
    {
      name: "Backoffice",
      logo: <ShieldIcon />,
      plan: "Admin",
    },
    {
      name: "Main Site",
      logo: <LayoutGridIcon />,
      plan: "Public",
    },
  ],
  navMain: [
    {
      title: "Overview",
      url: "/backoffice",
      icon: <BarChartIcon />,
      isActive: true,
      items: [
        {
          title: "Dashboard",
          url: "/backoffice",
        },
        {
          title: "Analytics",
          url: "/backoffice/analytics",
        },
        {
          title: "Reports",
          url: "/backoffice/reports",
        },
      ],
    },
    {
      title: "Users",
      url: "/backoffice/users",
      icon: <UsersIcon />,
      items: [
        {
          title: "All Users",
          url: "/backoffice/users",
        },
        {
          title: "Roles & Permissions",
          url: "/backoffice/users/roles",
        },
        {
          title: "Activity Log",
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
          title: "Catalog",
          url: "/backoffice/products",
        },
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
          title: "All Orders",
          url: "/backoffice/orders",
        },
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
      title: "Content",
      url: "/backoffice/content",
      icon: <FileTextIcon />,
      items: [
        {
          title: "Pages",
          url: "/backoffice/content/pages",
        },
        {
          title: "Blog",
          url: "/backoffice/content/blog",
        },
        {
          title: "Media Library",
          url: "/backoffice/content/media",
        },
      ],
    },
    {
      title: "Marketing",
      url: "/backoffice/marketing",
      icon: <MegaphoneIcon />,
      items: [
        {
          title: "Campaigns",
          url: "/backoffice/marketing/campaigns",
        },
        {
          title: "SEO",
          url: "/backoffice/marketing/seo",
        },
        {
          title: "Social Media",
          url: "/backoffice/marketing/social",
        },
      ],
    },
    {
      title: "Support",
      url: "/backoffice/support",
      icon: <HeadphonesIcon />,
      items: [
        {
          title: "Tickets",
          url: "/backoffice/support/tickets",
        },
        {
          title: "Knowledge Base",
          url: "/backoffice/support/kb",
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
        {
          title: "Integrations",
          url: "/backoffice/settings/integrations",
        },
        {
          title: "API",
          url: "/backoffice/settings/api",
        },
      ],
    },
  ],
}

export function BackofficeSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <WorkspaceSwitcher workspaces={data.workspaces} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
