"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

interface Feature {
  title: string
  description: string
  code: string
}

const features: Feature[] = [
  {
    title: "Authentication",
    description: "NextAuth.js v5 with credentials and OAuth providers",
    code: `export const authOptions: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      authorize: async (credentials) => {
        // Your auth logic
      }
    })
  ]
}`,
  },
  {
    title: "Dashboard",
    description: "Collapsible sidebar, team switching, and stats cards",
    code: `export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <NavProjects />
      </SidebarContent>
    </Sidebar>
  )
}`,
  },
  {
    title: "shadcn/ui",
    description: "Pre-built components with custom theming",
    code: `import { Button } from "@workspace/ui/components/button"

export function MyComponent() {
  return <Button>Click me</Button>
}`,
  },
  {
    title: "Turborepo",
    description: "Monorepo management with intelligent build caching",
    code: `{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**"]
    }
  }
}`,
  },
  {
    title: "TypeScript",
    description: "Strict mode enabled with full type coverage",
    code: `{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true
  }
}`,
  },
  {
    title: "Tailwind CSS v4",
    description: "PostCSS integration with CSS variables",
    code: `@import "tailwindcss";

@theme inline {
  --color-primary: oklch(0.508 0.118 165.612);
}`,
  },
]

export function FeatureGrid() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  return (
    <section className="border-t py-24">
      <div className="container px-6">
        <h2 className="mb-4 text-2xl font-semibold sm:text-3xl">
          What&apos;s Inside
        </h2>
        <p className="mb-12 text-muted-foreground">
          Production-ready features you can extend with confidence.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const isExpanded = expandedIndex === index
            return (
              <Card key={feature.title}>
                <CardHeader>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between"
                    onClick={() => setExpandedIndex(isExpanded ? null : index)}
                  >
                    {isExpanded ? "Hide code" : "View code"}
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                  {isExpanded && (
                    <div className="mt-4 rounded-md bg-muted p-3">
                      <pre className="overflow-x-auto text-xs">
                        <code>{feature.code}</code>
                      </pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
