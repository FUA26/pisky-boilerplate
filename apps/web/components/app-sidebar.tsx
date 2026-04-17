"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@workspace/ui/components/sidebar"
import {
  ShieldIcon,
  LayersIcon,
  UsersIcon,
  FileTextIcon,
  Settings2Icon,
  FrameIcon,
  PieChartIcon,
  HomeIcon,
} from "lucide-react"

const data = {
  user: {
    name: "User",
    email: "user@example.com",
    avatar: "/avatars/user.jpg",
  },
  teams: [
    {
      name: "Zilpo Workspace",
      logo: <ShieldIcon />,
      plan: "Pro",
    },
    {
      name: "Personal",
      logo: <HomeIcon />,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <HomeIcon />,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/dashboard",
        },
        {
          title: "Analytics",
          url: "/dashboard/analytics",
        },
      ],
    },
    {
      title: "Projects",
      url: "/dashboard/projects",
      icon: <LayersIcon />,
      items: [
        {
          title: "All Projects",
          url: "/dashboard/projects",
        },
        {
          title: "Archived",
          url: "/dashboard/projects/archived",
        },
      ],
    },
    {
      title: "Team",
      url: "/dashboard/team",
      icon: <UsersIcon />,
      items: [
        {
          title: "Members",
          url: "/dashboard/team/members",
        },
        {
          title: "Roles",
          url: "/dashboard/team/roles",
        },
        {
          title: "Invites",
          url: "/dashboard/team/invites",
        },
      ],
    },
    {
      title: "Documentation",
      url: "/dashboard/docs",
      icon: <FileTextIcon />,
      items: [
        {
          title: "Getting Started",
          url: "/dashboard/docs/getting-started",
        },
        {
          title: "API Reference",
          url: "/dashboard/docs/api",
        },
        {
          title: "Guides",
          url: "/dashboard/docs/guides",
        },
      ],
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: <Settings2Icon />,
      items: [
        {
          title: "Profile",
          url: "/dashboard/settings/profile",
        },
        {
          title: "Account",
          url: "/dashboard/settings/account",
        },
        {
          title: "Security",
          url: "/dashboard/settings/security",
        },
        {
          title: "Billing",
          url: "/dashboard/settings/billing",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "/dashboard/projects/design",
      icon: <FrameIcon />,
    },
    {
      name: "Analytics",
      url: "/dashboard/projects/analytics",
      icon: <PieChartIcon />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
