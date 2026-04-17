import { AppSidebar } from "@/features/dashboard/components/app-sidebar"
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  FileTextIcon,
  UsersIcon,
  LayersIcon,
  TrendingUpIcon,
} from "lucide-react"

export default function DashboardPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* Welcome Section */}
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Welcome back
              </h1>
              <p className="text-muted-foreground">
                Here&apos;s what&apos;s happening with your projects today.
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Projects
                </CardTitle>
                <LayersIcon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  +2 from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Team Members
                </CardTitle>
                <UsersIcon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">
                  +1 new this week
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Documents</CardTitle>
                <FileTextIcon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">47</div>
                <p className="text-xs text-muted-foreground">
                  +12 from last week
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Growth</CardTitle>
                <TrendingUpIcon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+24%</div>
                <p className="text-xs text-muted-foreground">
                  +4% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
                <CardDescription>
                  Your latest projects and their status.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 rounded-lg border p-4">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <LayersIcon className="size-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Website Redesign</p>
                    <p className="text-sm text-muted-foreground">
                      Updated 2 hours ago
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    In Progress
                  </div>
                </div>
                <div className="flex items-center gap-4 rounded-lg border p-4">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <LayersIcon className="size-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Mobile App</p>
                    <p className="text-sm text-muted-foreground">
                      Updated yesterday
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">Review</div>
                </div>
                <div className="flex items-center gap-4 rounded-lg border p-4">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <LayersIcon className="size-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">API Integration</p>
                    <p className="text-sm text-muted-foreground">
                      Updated 2 days ago
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <a
                  href="/dashboard/projects/new"
                  className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex size-8 items-center justify-center rounded-md bg-primary/10">
                    <LayersIcon className="size-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">New Project</p>
                    <p className="text-xs text-muted-foreground">
                      Create a new project
                    </p>
                  </div>
                </a>
                <a
                  href="/dashboard/team/invites"
                  className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex size-8 items-center justify-center rounded-md bg-primary/10">
                    <UsersIcon className="size-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Invite Team</p>
                    <p className="text-xs text-muted-foreground">
                      Add team members
                    </p>
                  </div>
                </a>
                <a
                  href="/dashboard/docs"
                  className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex size-8 items-center justify-center rounded-md bg-primary/10">
                    <FileTextIcon className="size-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">View Docs</p>
                    <p className="text-xs text-muted-foreground">
                      Read documentation
                    </p>
                  </div>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
