import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  UsersIcon,
  ShoppingCartIcon,
  PackageIcon,
  TrendingUpIcon,
  ActivityIcon,
  DollarSignIcon,
} from "lucide-react"

export default function BackofficeDashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      {/* Welcome Section */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Backoffice Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s what&apos;s happening in your admin panel
            today.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSignIcon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCartIcon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">
              +201 since last hour
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <PackageIcon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,340</div>
            <p className="text-xs text-muted-foreground">+19 new products</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <ActivityIcon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">
              +201 since last hour
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              You made 265 sales this month. Your revenue is $45,231.89.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                id: "ORD-001",
                customer: "Olivia Martin",
                email: "olivia@example.com",
                amount: "$1,999.00",
              },
              {
                id: "ORD-002",
                customer: "Jackson Lee",
                email: "jackson@example.com",
                amount: "$39.00",
              },
              {
                id: "ORD-003",
                customer: "Isabella Nguyen",
                email: "isabella@example.com",
                amount: "$299.00",
              },
              {
                id: "ORD-004",
                customer: "William Kim",
                email: "will@example.com",
                amount: "$99.00",
              },
              {
                id: "ORD-005",
                customer: "Sofia Davis",
                email: "sofia@example.com",
                amount: "$39.00",
              },
            ].map((order) => (
              <div
                key={order.id}
                className="flex items-center gap-4 rounded-lg border p-4"
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <ShoppingCartIcon className="size-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{order.customer}</p>
                  <p className="text-sm text-muted-foreground">{order.email}</p>
                </div>
                <div className="text-sm font-medium">{order.amount}</div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common administrative tasks and shortcuts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <a
              href="/backoffice/products/new"
              className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
            >
              <div className="flex size-8 items-center justify-center rounded-md bg-primary/10">
                <PackageIcon className="size-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Add Product</p>
                <p className="text-xs text-muted-foreground">
                  Create a new product
                </p>
              </div>
            </a>
            <a
              href="/backoffice/users/new"
              className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
            >
              <div className="flex size-8 items-center justify-center rounded-md bg-primary/10">
                <UsersIcon className="size-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Add User</p>
                <p className="text-xs text-muted-foreground">
                  Invite a team member
                </p>
              </div>
            </a>
            <a
              href="/backoffice/reports"
              className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
            >
              <div className="flex size-8 items-center justify-center rounded-md bg-primary/10">
                <TrendingUpIcon className="size-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">View Reports</p>
                <p className="text-xs text-muted-foreground">
                  Generate sales reports
                </p>
              </div>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
