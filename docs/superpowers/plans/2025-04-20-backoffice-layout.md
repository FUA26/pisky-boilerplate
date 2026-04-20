# Backoffice Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refresh the backoffice layout with an adaptive sidebar, header with search/notifications, and updated dashboard page.

**Architecture:** Update existing backoffice layout to add search input and notification bell to the header, create reusable dashboard components (stat-card, activity-chart, recent-activity), and refresh the dashboard page with the new components.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, lucide-react

---

## File Structure

```
apps/web/
├── app/(backoffice)/
│   ├── layout.tsx                           # MODIFY: Add search, notifications to header
│   └── dashboard/
│       └── page.tsx                         # MODIFY: Use new components, add chart
│
└── features/backoffice/
    └── components/
        ├── backoffice-sidebar.tsx           # MODIFY: Update styling
        ├── nav-main.tsx                     # MODIFY: Update styling
        ├── header-nav-user.tsx              # KEEP: No changes
        ├── header-search.tsx                # CREATE: Search input component
        ├── header-notifications.tsx         # CREATE: Bell + dropdown component
        ├── stat-card.tsx                    # CREATE: Reusable stat card
        ├── activity-chart.tsx               # CREATE: Activity chart component
        └── recent-activity.tsx              # CREATE: Recent activity table
```

---

## Task 1: Create Header Search Component

**Files:**

- Create: `apps/web/features/backoffice/components/header-search.tsx`

- [ ] **Step 1: Create the header search component**

Create `apps/web/features/backoffice/components/header-search.tsx`:

```tsx
"use client"

import { SearchIcon } from "lucide-react"
import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"

export function HeaderSearch() {
  return (
    <div className="relative hidden md:block">
      <SearchIcon className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search..."
        className="h-9 w-64 rounded-full bg-background pr-4 pl-9 md:w-72 lg:w-80"
      />
    </div>
  )
}

// Mobile search trigger
export function HeaderSearchMobile() {
  return (
    <Button variant="ghost" size="icon" className="md:hidden">
      <SearchIcon className="size-5" />
      <span className="sr-only">Search</span>
    </Button>
  )
}
```

- [ ] **Step 2: Type check the component**

Run: `cd apps/web && pnpm typecheck`
Expected: No type errors

- [ ] **Step 3: Commit**

```bash
git add apps/web/features/backoffice/components/header-search.tsx
git commit -m "feat: add header search component

Add search input component for backoffice header.
Includes desktop and mobile variants.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 2: Create Header Notifications Component

**Files:**

- Create: `apps/web/features/backoffice/components/header-notifications.tsx`

- [ ] **Step 1: Create the header notifications component**

Create `apps/web/features/backoffice/components/header-notifications.tsx`:

```tsx
"use client"

import * as React from "react"
import {
  BellIcon,
  CheckIcon,
  UserIcon,
  ShoppingCartIcon,
  PackageIcon,
  AlertTriangleIcon,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Badge } from "@workspace/ui/components/badge"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { Separator } from "@workspace/ui/components/separator"

const notifications = [
  {
    id: "1",
    title: "New user registration",
    description: "John Doe signed up 2 hours ago",
    time: "2 hours ago",
    icon: <UserIcon className="size-4" />,
    read: false,
  },
  {
    id: "2",
    title: "Order placed",
    description: "Order #1234 awaiting processing",
    time: "3 hours ago",
    icon: <ShoppingCartIcon className="size-4" />,
    read: false,
  },
  {
    id: "3",
    title: "Low stock alert",
    description: "Widget X has 3 remaining",
    time: "5 hours ago",
    icon: <AlertTriangleIcon className="size-4" />,
    read: true,
  },
  {
    id: "4",
    title: "Product updated",
    description: "Widget Y inventory changed",
    time: "1 day ago",
    icon: <PackageIcon className="size-4" />,
    read: true,
  },
]

export function HeaderNotifications() {
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <BellIcon className="size-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full p-0 text-[10px]"
            >
              {unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-80 rounded-lg"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="flex items-center justify-between px-4">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-auto p-0 text-xs">
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-80">
          <DropdownMenuGroup>
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="flex flex-col items-start gap-1 px-4 py-3"
                >
                  <div className="flex w-full items-start gap-3">
                    <div className="mt-0.5 shrink-0 text-muted-foreground">
                      {notification.icon}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm leading-none font-medium">
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notification.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {notification.time}
                        </span>
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 text-xs text-muted-foreground"
                          >
                            <CheckIcon className="mr-1 size-3" />
                            Mark read
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  {notification.id !==
                    notifications[notifications.length - 1]?.id && (
                    <Separator className="mt-2" />
                  )}
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuGroup>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

- [ ] **Step 2: Add missing shadcn components (scroll-area, badge)**

Run: `pnpm dlx shadcn@latest add scroll-area badge -c apps/web`

- [ ] **Step 3: Type check the component**

Run: `cd apps/web && pnpm typecheck`
Expected: No type errors

- [ ] **Step 4: Commit**

```bash
git add apps/web/features/backoffice/components/header-notifications.tsx apps/web/components.json packages/ui/src/components/
git commit -m "feat: add header notifications component

Add notification bell with dropdown menu showing mock notifications.
Includes badge count, mark as read action, and scrollable list.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 3: Update Backoffice Layout Header

**Files:**

- Modify: `apps/web/app/(backoffice)/layout.tsx`

- [ ] **Step 1: Update the backoffice layout to include new header components**

Modify `apps/web/app/(backoffice)/layout.tsx`:

```tsx
import { BackofficeSidebar } from "@/features/backoffice/components/backoffice-sidebar"
import { HeaderNavUser } from "@/features/backoffice/components/header-nav-user"
import {
  HeaderSearch,
  HeaderSearchMobile,
} from "@/features/backoffice/components/header-search"
import { HeaderNotifications } from "@/features/backoffice/components/header-notifications"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"
import { Separator } from "@workspace/ui/components/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar"

export default function BackofficeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <BackofficeSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex flex-1 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/backoffice">Backoffice</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-2 px-4">
            <HeaderSearch />
            <HeaderSearchMobile />
            <HeaderNotifications />
            <HeaderNavUser />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
```

- [ ] **Step 2: Type check**

Run: `cd apps/web && pnpm typecheck`
Expected: No type errors

- [ ] **Step 3: Commit**

```bash
git add apps/web/app/\(backoffice\)/layout.tsx
git commit -m "feat: add search and notifications to backoffice header

Integrate header search and notification components into the backoffice layout.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 4: Create Stat Card Component

**Files:**

- Create: `apps/web/features/backoffice/components/stat-card.tsx`

- [ ] **Step 1: Create the stat card component**

Create `apps/web/features/backoffice/components/stat-card.tsx`:

```tsx
import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { TrendingUpIcon, TrendingDownIcon, MinusIcon } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    period?: string
  }
  className?: string
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  className,
}: StatCardProps) {
  const trendIcon =
    trend?.value && trend.value > 0
      ? TrendingUpIcon
      : trend?.value && trend.value < 0
        ? TrendingDownIcon
        : MinusIcon

  const trendColor =
    trend?.value && trend.value > 0
      ? "text-green-600 dark:text-green-500"
      : trend?.value && trend.value < 0
        ? "text-red-600 dark:text-red-500"
        : "text-muted-foreground"

  const TrendIcon = trendIcon

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="size-5 text-primary" />
          </div>
          {trend && (
            <div
              className={cn(
                "flex items-center gap-0.5 text-xs font-medium",
                trendColor
              )}
            >
              {trend.value !== 0 && <TrendIcon className="size-3" />}
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        <div className="mt-4">
          <div className="text-2xl font-bold tracking-tight tabular-nums">
            {value}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{title}</p>
          {trend?.period && (
            <p className="mt-1 text-xs text-muted-foreground">
              from last {trend.period}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 2: Type check**

Run: `cd apps/web && pnpm typecheck`
Expected: No type errors

- [ ] **Step 3: Commit**

```bash
git add apps/web/features/backoffice/components/stat-card.tsx
git commit -m "feat: add stat card component

Reusable stat card with icon, value, title, and trend indicator.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 5: Create Activity Chart Component

**Files:**

- Create: `apps/web/features/backoffice/components/activity-chart.tsx`

- [ ] **Step 1: Create the activity chart component**

Create `apps/web/features/backoffice/components/activity-chart.tsx`:

```tsx
"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

type TimePeriod = "7d" | "30d" | "90d"

const chartData = {
  "7d": [
    { day: "Mon", value: 12 },
    { day: "Tue", value: 19 },
    { day: "Wed", value: 15 },
    { day: "Thu", value: 25 },
    { day: "Fri", value: 32 },
    { day: "Sat", value: 18 },
    { day: "Sun", value: 14 },
  ],
  "30d": [
    { day: "Week 1", value: 85 },
    { day: "Week 2", value: 102 },
    { day: "Week 3", value: 98 },
    { day: "Week 4", value: 124 },
  ],
  "90d": [
    { day: "Month 1", value: 320 },
    { day: "Month 2", value: 412 },
    { day: "Month 3", value: 489 },
  ],
}

export function ActivityChart() {
  const [period, setPeriod] = React.useState<TimePeriod>("7d")
  const data = chartData[period]
  const maxValue = Math.max(...data.map((d) => d.value))

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Activity Overview</CardTitle>
            <CardDescription>Daily activity metrics over time</CardDescription>
          </div>
          <div className="flex gap-1">
            {(["7d", "30d", "90d"] as TimePeriod[]).map((p) => (
              <Button
                key={p}
                variant={period === p ? "default" : "outline"}
                size="sm"
                onClick={() => setPeriod(p)}
                className="h-8"
              >
                {p === "7d" ? "7 days" : p === "30d" ? "30 days" : "90 days"}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex h-48 items-end justify-between gap-2">
          {data.map((item, index) => {
            const height = (item.value / maxValue) * 100
            return (
              <div
                key={index}
                className="flex flex-1 flex-col items-center gap-2"
              >
                <div className="relative w-full">
                  <div
                    className={cn(
                      "mx-auto w-full max-w-[60px] rounded-t-lg bg-primary transition-all duration-500",
                      "hover:opacity-80"
                    )}
                    style={{ height: `${height}%`, minHeight: "4px" }}
                  />
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium tabular-nums opacity-0 transition-opacity hover:opacity-100">
                    {item.value}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {item.day}
                </span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 2: Type check**

Run: `cd apps/web && pnpm typecheck`
Expected: No type errors

- [ ] **Step 3: Commit**

```bash
git add apps/web/features/backoffice/components/activity-chart.tsx
git commit -m "feat: add activity chart component

Simple CSS bar chart with period selector (7d, 30d, 90d).
Shows activity metrics over time with hover values.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 6: Create Recent Activity Component

**Files:**

- Create: `apps/web/features/backoffice/components/recent-activity.tsx`

- [ ] **Step 1: Create the recent activity component**

Create `apps/web/features/backoffice/components/recent-activity.tsx`:

```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import {
  ShoppingCartIcon,
  UserIcon,
  PackageIcon,
  HeadphonesIcon,
} from "lucide-react"

type ActivityStatus = "completed" | "pending" | "failed"

interface ActivityItem {
  id: string
  type: string
  description: string
  date: string
  status: ActivityStatus
}

const activities: ActivityItem[] = [
  {
    id: "1",
    type: "Order",
    description: "#1234 placed by Jane Smith",
    date: "Today",
    status: "completed",
  },
  {
    id: "2",
    type: "User",
    description: "New user: Mike Johnson",
    date: "Today",
    status: "completed",
  },
  {
    id: "3",
    type: "Product",
    description: "Widget Y updated",
    date: "Yesterday",
    status: "completed",
  },
  {
    id: "4",
    type: "Order",
    description: "#1233 shipped",
    date: "Yesterday",
    status: "completed",
  },
  {
    id: "5",
    type: "Support",
    description: "Ticket #567 resolved",
    date: "2 days ago",
    status: "completed",
  },
  {
    id: "6",
    type: "Order",
    description: "#1235 pending payment",
    date: "3 days ago",
    status: "pending",
  },
]

const typeIcons: Record<string, React.ReactNode> = {
  Order: <ShoppingCartIcon className="size-4" />,
  User: <UserIcon className="size-4" />,
  Product: <PackageIcon className="size-4" />,
  Support: <HeadphonesIcon className="size-4" />,
}

const statusVariants: Record<
  ActivityStatus,
  "default" | "secondary" | "destructive"
> = {
  completed: "default",
  pending: "secondary",
  failed: "destructive",
}

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates across your system</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No recent activity
                </TableCell>
              </TableRow>
            ) : (
              activities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="text-muted-foreground">
                        {typeIcons[activity.type]}
                      </div>
                      <span className="font-medium">{activity.type}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {activity.description}
                  </TableCell>
                  <TableCell>{activity.date}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariants[activity.status]}>
                      {activity.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 2: Add table component**

Run: `pnpm dlx shadcn@latest add table -c apps/web`

- [ ] **Step 3: Type check**

Run: `cd apps/web && pnpm typecheck`
Expected: No type errors

- [ ] **Step 4: Commit**

```bash
git add apps/web/features/backoffice/components/recent-activity.tsx apps/web/components.json packages/ui/src/components/
git commit -m "feat: add recent activity component

Table component showing recent activity with type icons and status badges.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 7: Update Dashboard Page

**Files:**

- Modify: `apps/web/app/(backoffice)/dashboard/page.tsx`

- [ ] **Step 1: Update the dashboard page to use new components**

Replace the entire content of `apps/web/app/(backoffice)/dashboard/page.tsx` with:

```tsx
import { StatCard } from "@/features/backoffice/components/stat-card"
import { ActivityChart } from "@/features/backoffice/components/activity-chart"
import { RecentActivity } from "@/features/backoffice/components/recent-activity"
import {
  UsersIcon,
  ShoppingCartIcon,
  DollarSignIcon,
  PackageIcon,
} from "lucide-react"

export default function BackofficeDashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s what&apos;s happening in your admin panel
          today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value="2,543"
          icon={UsersIcon}
          trend={{ value: 12, period: "month" }}
        />
        <StatCard
          title="Total Orders"
          value="1,234"
          icon={ShoppingCartIcon}
          trend={{ value: 8, period: "month" }}
        />
        <StatCard
          title="Revenue"
          value="$45,678"
          icon={DollarSignIcon}
          trend={{ value: 23, period: "month" }}
        />
        <StatCard
          title="Active Products"
          value="156"
          icon={PackageIcon}
          trend={{ value: 5, period: "month" }}
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid gap-4 lg:grid-cols-3">
        <ActivityChart />
        <RecentActivity />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Type check**

Run: `cd apps/web && pnpm typecheck`
Expected: No type errors

- [ ] **Step 3: Commit**

```bash
git add apps/web/app/\(backoffice\)/dashboard/page.tsx
git commit -m "feat: update dashboard page with new components

Use stat-card, activity-chart, and recent-activity components.
Updated layout and styling to match new design.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 8: Update Sidebar Styling

**Files:**

- Modify: `apps/web/features/backoffice/components/nav-main.tsx`

- [ ] **Step 1: Update nav-main styling for rounded corners and better hover states**

Modify `apps/web/features/backoffice/components/nav-main.tsx`:

```tsx
"use client"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@workspace/ui/components/sidebar"
import { ChevronRightIcon } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

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
    }[]
  }[]
}) {
  return (
    <SidebarMenu className="gap-1">
      {items.map((item) => (
        <Collapsible
          key={item.title}
          asChild
          defaultOpen={item.isActive}
          className="group/collapsible"
        >
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton
                tooltip={item.title}
                className={cn(
                  "rounded-lg px-3 py-2 transition-all duration-150",
                  "hover:bg-accent/50",
                  item.isActive &&
                    "bg-primary/10 text-primary hover:bg-primary/15"
                )}
              >
                {item.icon}
                <span>{item.title}</span>
                <ChevronRightIcon className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {item.items?.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.title}>
                    <SidebarMenuSubButton
                      asChild
                      className={cn(
                        "rounded-md px-3 py-1.5 transition-all duration-150",
                        "hover:bg-accent/50"
                      )}
                    >
                      <a href={subItem.url}>
                        <span>{subItem.title}</span>
                      </a>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      ))}
    </SidebarMenu>
  )
}
```

- [ ] **Step 2: Type check**

Run: `cd apps/web && pnpm typecheck`
Expected: No type errors

- [ ] **Step 3: Commit**

```bash
git add apps/web/features/backoffice/components/nav-main.tsx
git commit -m "style: update sidebar nav styling

Add rounded corners, improved hover states, and active indicators.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 9: Update Backoffice Sidebar Styling

**Files:**

- Modify: `apps/web/features/backoffice/components/backoffice-sidebar.tsx`

- [ ] **Step 1: Update backoffice-sidebar to add theme-aware CSS variables**

Modify `apps/web/features/backoffice/components/backoffice-sidebar.tsx`:

```tsx
"use client"

import * as React from "react"

import { NavMain } from "@/features/backoffice/components/nav-main"
import { WorkspaceSwitcher } from "@/features/backoffice/components/workspace-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
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
    <Sidebar
      collapsible="icon"
      className="border-r bg-sidebar text-sidebar-foreground"
      {...props}
    >
      <SidebarHeader className="border-b border-sidebar-border">
        <WorkspaceSwitcher workspaces={data.workspaces} />
      </SidebarHeader>
      <SidebarSeparator className="bg-sidebar-border" />
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
```

- [ ] **Step 2: Type check**

Run: `cd apps/web && pnpm typecheck`
Expected: No type errors

- [ ] **Step 3: Commit**

```bash
git add apps/web/features/backoffice/components/backoffice-sidebar.tsx
git commit -m "style: add theme-aware sidebar CSS variables

Add sidebar-specific CSS variable classes for theme adaptability.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 10: Add Sidebar CSS Variables to Global Styles

**Files:**

- Modify: `packages/ui/src/styles/globals.css`

- [ ] **Step 1: Add sidebar CSS variables to globals.css**

Add the following to `packages/ui/src/styles/globals.css` (find the :root section and add the sidebar variables):

```css
:root {
  /* ... existing variables ... */

  /* Sidebar */
  --sidebar-background: 0 0% 98%;
  --sidebar-foreground: 240 10% 3.9%;
  --sidebar-primary: 240 5.9% 10%;
  --sidebar-primary-foreground: 0 0% 98%;
  --sidebar-accent: 240 4.8% 95.9%;
  --sidebar-accent-foreground: 240 5.9% 10%;
  --sidebar-border: 220 13% 91%;
  --sidebar-ring: 217.2 91.2% 59.8%;
}

.dark {
  /* ... existing dark variables ... */

  /* Sidebar */
  --sidebar-background: 240 5.9% 10%;
  --sidebar-foreground: 240 4.8% 95.9%;
  --sidebar-primary: 224.3 76.3% 48%;
  --sidebar-primary-foreground: 0 0% 100%;
  --sidebar-accent: 240 3.7% 15.9%;
  --sidebar-accent-foreground: 240 4.8% 95.9%;
  --sidebar-border: 240 3.7% 15.9%;
  --sidebar-ring: 217.2 91.2% 59.8%;
}
```

Note: Insert these alongside the existing CSS variables, maintaining the existing format.

- [ ] **Step 2: Build to verify CSS**

Run: `pnpm build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add packages/ui/src/styles/globals.css
git commit -m "style: add sidebar CSS variables

Add theme-aware sidebar color variables for light and dark modes.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 11: Verify Implementation

**Files:**

- None (verification task)

- [ ] **Step 1: Type check all packages**

Run: `pnpm typecheck`
Expected: No type errors across all packages

- [ ] **Step 2: Lint all packages**

Run: `pnpm lint`
Expected: No linting errors

- [ ] **Step 3: Build all packages**

Run: `pnpm build`
Expected: Build succeeds

- [ ] **Step 4: Start dev server and test manually**

Run: `cd apps/web && pnpm dev`

Verify:

- [ ] Header shows search input, notification bell, and user menu
- [ ] Search input has pill shape and focus state
- [ ] Notification bell shows badge count
- [ ] Notification dropdown shows mock notifications
- [ ] Sidebar has rounded corners and hover states
- [ ] Dashboard shows 4 stat cards with trends
- [ ] Activity chart shows bars and period selector
- [ ] Recent activity table displays correctly
- [ ] Theme switching (light/dark) works correctly
- [ ] Mobile responsive behavior works

- [ ] **Step 5: Final commit**

```bash
git add .
git commit -m "feat: complete backoffice layout refresh

All components implemented and tested:
- Header with search, notifications, user menu
- Adaptive sidebar with theme-aware styling
- Dashboard with stat cards, activity chart, recent activity

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Self-Review Checklist

- [ ] Spec coverage: All requirements from design spec are implemented
- [ ] Placeholder scan: No TBD, TODO, or missing implementations
- [ ] Type consistency: All component interfaces match usage
- [ ] Dependencies: All required shadcn components included (scroll-area, badge, table)
