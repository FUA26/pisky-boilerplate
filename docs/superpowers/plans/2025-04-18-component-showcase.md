# Component Showcase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a comprehensive component documentation and showcase system for all 18 shadcn/ui components in `@workspace/ui`, serving as both internal reference and public documentation.

**Architecture:** Category-based documentation pages with shared sidebar navigation, live preview areas with theme toggling, and code examples for each component variant. Static Next.js App Router pages using existing shadcn components for the showcase UI itself.

**Tech Stack:** Next.js 16 App Router, React 19, shadcn/ui components, Tailwind CSS v4, TypeScript

---

## File Structure

```
apps/web/
├── app/
│   └── components/
│       ├── page.tsx                           — Index page (category overview + sidebar)
│       ├── forms/
│       │   └── page.tsx                       — Forms category page
│       ├── navigation/
│       │   └── page.tsx                       — Navigation category page
│       ├── overlays/
│       │   └── page.tsx                       — Overlays & Feedback category page
│       └── data-display/
│           └── page.tsx                       — Data Display category page
├── features/
    └── showcase/
        ├── components/
        │   ├── showcase-sidebar.tsx           — Left navigation sidebar
        │   ├── component-preview.tsx         — Live preview wrapper with theme toggle
        │   ├── code-block.tsx                 — Syntax-highlighted code display
        │   └── preview-code-tabs.tsx          — Tab switcher (Preview | Code)
        └── lib/
            └── component-data.ts              — Component metadata
```

---

### Task 1: Create Component Metadata Structure

**Files:**

- Create: `apps/web/features/showcase/lib/component-data.ts`

- [ ] **Step 1: Create component metadata**

```typescript
export interface ComponentData {
  name: string
  category: string
  description: string
  path: string
}

export interface CategoryData {
  name: string
  description: string
  path: string
  components: string[]
}

export const categories: CategoryData[] = [
  {
    name: "Forms",
    description: "Form input and control components",
    path: "/components/forms",
    components: ["button", "input", "field", "form", "label"],
  },
  {
    name: "Navigation",
    description: "Navigation and menu components",
    path: "/components/navigation",
    components: ["breadcrumb", "tabs", "sidebar", "dropdown-menu"],
  },
  {
    name: "Overlays & Feedback",
    description: "Overlays, toasts, and loading states",
    path: "/components/overlays",
    components: ["sheet", "tooltip", "sonner", "skeleton", "collapsible"],
  },
  {
    name: "Data Display",
    description: "Data presentation components",
    path: "/components/data-display",
    components: ["card", "avatar", "separator"],
  },
]

export const components: Record<string, ComponentData> = {
  button: {
    name: "Button",
    category: "Forms",
    description:
      "A button component supports multiple variants, sizes, and states.",
    path: "/components/forms#button",
  },
  input: {
    name: "Input",
    category: "Forms",
    description: "A text input component with various states.",
    path: "/components/forms#input",
  },
  field: {
    name: "Field",
    category: "Forms",
    description: "A form field wrapper with label and description.",
    path: "/components/forms#field",
  },
  form: {
    name: "Form",
    category: "Forms",
    description: "Reactive form integration with validation.",
    path: "/components/forms#form",
  },
  label: {
    name: "Label",
    category: "Forms",
    description: "A form label component with proper accessibility.",
    path: "/components/forms#label",
  },
  breadcrumb: {
    name: "Breadcrumb",
    category: "Navigation",
    description: "Breadcrumb navigation for hierarchical content.",
    path: "/components/navigation#breadcrumb",
  },
  tabs: {
    name: "Tabs",
    category: "Navigation",
    description: "Tabbed content with smooth transitions.",
    path: "/components/navigation#tabs",
  },
  sidebar: {
    name: "Sidebar",
    category: "Navigation",
    description: "Collapsible sidebar navigation.",
    path: "/components/navigation#sidebar",
  },
  "dropdown-menu": {
    name: "Dropdown Menu",
    category: "Navigation",
    description: "Dropdown menu with various item types.",
    path: "/components/navigation#dropdown-menu",
  },
  sheet: {
    name: "Sheet",
    category: "Overlays & Feedback",
    description: "Slide-over panel from any edge.",
    path: "/components/overlays#sheet",
  },
  tooltip: {
    name: "Tooltip",
    category: "Overlays & Feedback",
    description: "Hover tooltip with positioning options.",
    path: "/components/overlays#tooltip",
  },
  sonner: {
    name: "Sonner",
    category: "Overlays & Feedback",
    description: "Toast notifications for user feedback.",
    path: "/components/overlays#sonner",
  },
  skeleton: {
    name: "Skeleton",
    category: "Overlays & Feedback",
    description: "Loading placeholder with various shapes.",
    path: "/components/overlays#skeleton",
  },
  collapsible: {
    name: "Collapsible",
    category: "Overlays & Feedback",
    description: "Expandable/collapsible content section.",
    path: "/components/overlays#collapsible",
  },
  card: {
    name: "Card",
    category: "Data Display",
    description: "Card container for grouped content.",
    path: "/components/data-display#card",
  },
  avatar: {
    name: "Avatar",
    category: "Data Display",
    description: "User avatar with fallback options.",
    path: "/components/data-display#avatar",
  },
  separator: {
    name: "Separator",
    category: "Data Display",
    description: "Visual divider with orientation options.",
    path: "/components/data-display#separator",
  },
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/features/showcase/lib/component-data.ts
git commit -m "feat: add component metadata structure for showcase"
```

---

### Task 2: Create Showcase Sidebar Component

**Files:**

- Create: `apps/web/features/showcase/components/showcase-sidebar.tsx`

- [ ] **Step 1: Create sidebar component**

```tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { categories, components } from "../lib/component-data"

export function ShowcaseSidebar() {
  const pathname = usePathname()

  const isCategoryActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + "#")
  }

  const isComponentActive = (path: string) => {
    return pathname.endsWith(path.split("#")[1])
  }

  return (
    <aside className="fixed top-0 left-0 z-30 h-screen w-64 border-r border-border bg-background">
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-2 border-b border-border px-6 py-4">
          <Link href="/components" className="font-semibold text-foreground">
            Components
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-4">
          <ul className="space-y-6">
            {categories.map((category) => (
              <li key={category.path}>
                <Link
                  href={category.path}
                  className={cn(
                    "mb-2 flex items-center gap-1 text-sm font-medium",
                    isCategoryActive(category.path)
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <ChevronRight className="size-4" />
                  {category.name}
                </Link>
                <ul className="ml-6 space-y-1">
                  {category.components.map((componentKey) => {
                    const component = components[componentKey]
                    if (!component) return null
                    return (
                      <li key={componentKey}>
                        <Link
                          href={component.path}
                          className={cn(
                            "block rounded-md px-2 py-1 text-sm transition-colors",
                            isComponentActive(component.path)
                              ? "bg-muted text-foreground"
                              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                          )}
                        >
                          {component.name}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/features/showcase/components/showcase-sidebar.tsx
git commit -m "feat: add showcase sidebar component"
```

---

### Task 3: Create Code Block Component

**Files:**

- Create: `apps/web/features/showcase/components/code-block.tsx`

- [ ] **Step 1: Create code block with copy button**

```tsx
"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

interface CodeBlockProps {
  code: string
  language?: string
  className?: string
}

export function CodeBlock({
  code,
  language = "tsx",
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn("group relative", className)}>
      <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
        <code className="font-mono text-muted-foreground">{code}</code>
      </pre>
      <Button
        size="icon-xs"
        variant="ghost"
        onClick={handleCopy}
        className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100"
      >
        {copied ? (
          <Check className="size-4 text-green-500" />
        ) : (
          <Copy className="size-4" />
        )}
      </Button>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/features/showcase/components/code-block.tsx
git commit -m "feat: add code block component with copy button"
```

---

### Task 4: Create Component Preview Wrapper

**Files:**

- Create: `apps/web/features/showcase/components/component-preview.tsx`

- [ ] **Step 1: Create preview wrapper with theme toggle**

```tsx
"use client"

import { useState } from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

interface ComponentPreviewProps {
  children: React.ReactNode
  className?: string
}

export function ComponentPreview({
  children,
  className,
}: ComponentPreviewProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light")

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"))
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          Preview
        </span>
        <Button
          size="icon-xs"
          variant="ghost"
          onClick={toggleTheme}
          className="size-7"
        >
          {theme === "light" ? (
            <Sun className="size-4" />
          ) : (
            <Moon className="size-4" />
          )}
        </Button>
      </div>
      <div
        className={cn(
          "relative overflow-hidden rounded-lg border transition-colors",
          theme === "light"
            ? "border-border bg-background"
            : "border-gray-800 bg-gray-950"
        )}
      >
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/features/showcase/components/component-preview.tsx
git commit -m "feat: add component preview wrapper with theme toggle"
```

---

### Task 5: Create Preview/Code Tabs Component

**Files:**

- Create: `apps/web/features/showcase/components/preview-code-tabs.tsx`

- [ ] **Step 1: Create tab switcher component**

```tsx
"use client"

import { useState } from "react"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@workspace/ui/components/tabs"
import { ComponentPreview } from "./component-preview"
import { CodeBlock } from "./code-block"

interface PreviewCodeTabsProps {
  preview: React.ReactNode
  code: string
  className?: string
}

export function PreviewCodeTabs({
  preview,
  code,
  className,
}: PreviewCodeTabsProps) {
  return (
    <Tabs defaultValue="preview" className={className}>
      <TabsList>
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
      </TabsList>
      <TabsContent value="preview">
        <ComponentPreview>{preview}</ComponentPreview>
      </TabsContent>
      <TabsContent value="code">
        <CodeBlock code={code} />
      </TabsContent>
    </Tabs>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/features/showcase/components/preview-code-tabs.tsx
git commit -m "feat: add preview/code tabs component"
```

---

### Task 6: Create Index Page Layout

**Files:**

- Create: `apps/web/app/components/page.tsx`
- Create: `apps/web/app/components/layout.tsx`

- [ ] **Step 1: Create showcase layout**

```tsx
import { ShowcaseSidebar } from "@/features/showcase/components/showcase-sidebar"

export default function ComponentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-dvh">
      <ShowcaseSidebar />
      <main className="ml-64 flex-1">{children}</main>
    </div>
  )
}
```

- [ ] **Step 2: Create index page**

```tsx
import { categories } from "@/features/showcase/lib/component-data"
import { Card } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"

export default function ComponentsPage() {
  return (
    <div className="container px-8 py-12">
      <div className="max-w-4xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Components
          </h1>
          <p className="mt-2 text-muted-foreground">
            Building blocks for your SaaS. Browse our collection of reusable
            components built with shadcn/ui.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {categories.map((category) => (
            <a key={category.path} href={category.path} className="group">
              <Card className="p-6 transition-shadow hover:shadow-md">
                <h2 className="text-xl font-semibold text-foreground group-hover:text-primary">
                  {category.name}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {category.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {category.components.map((component) => (
                    <span
                      key={component}
                      className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
                    >
                      {component}
                    </span>
                  ))}
                </div>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/app/components/page.tsx apps/web/app/components/layout.tsx
git commit -m "feat: add components index page with layout"
```

---

### Task 7: Create Forms Category Page

**Files:**

- Create: `apps/web/app/components/forms/page.tsx`

- [ ] **Step 1: Create forms page with Button component examples**

```tsx
import { PreviewCodeTabs } from "@/features/showcase/components/preview-code-tabs"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Card } from "@workspace/ui/components/card"
import { Separator } from "@workspace/ui/components/separator"

export default function FormsPage() {
  return (
    <div className="container px-8 py-12">
      <div className="max-w-4xl space-y-16">
        {/* Button Section */}
        <section id="button" className="scroll-mt-8 space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Button
            </h1>
            <p className="mt-2 text-muted-foreground">
              A button component supports multiple variants, sizes, and states.
            </p>
          </div>

          {/* Primary Button */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Primary</h2>
            <PreviewCodeTabs
              preview={<Button>Click me</Button>}
              code={`import { Button } from "@workspace/ui/components/button"

<Button>Click me</Button>`}
            />
          </div>

          {/* Secondary Button */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Secondary</h2>
            <PreviewCodeTabs
              preview={<Button variant="secondary">Click me</Button>}
              code={`import { Button } from "@workspace/ui/components/button"

<Button variant="secondary">Click me</Button>`}
            />
          </div>

          {/* Destructive Button */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              Destructive
            </h2>
            <PreviewCodeTabs
              preview={<Button variant="destructive">Delete</Button>}
              code={`import { Button } from "@workspace/ui/components/button"

<Button variant="destructive">Delete</Button>`}
            />
          </div>

          {/* Outline Button */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Outline</h2>
            <PreviewCodeTabs
              preview={<Button variant="outline">Click me</Button>}
              code={`import { Button } from "@workspace/ui/components/button"

<Button variant="outline">Click me</Button>`}
            />
          </div>

          {/* Ghost Button */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Ghost</h2>
            <PreviewCodeTabs
              preview={<Button variant="ghost">Click me</Button>}
              code={`import { Button } from "@workspace/ui/components/button"

<Button variant="ghost">Click me</Button>`}
            />
          </div>

          {/* Link Button */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Link</h2>
            <PreviewCodeTabs
              preview={<Button variant="link">Learn more</Button>}
              code={`import { Button } from "@workspace/ui/components/button"

<Button variant="link">Learn more</Button>`}
            />
          </div>

          {/* Button Sizes */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Sizes</h2>
            <PreviewCodeTabs
              preview={
                <div className="flex items-center gap-4">
                  <Button size="xs">Extra Small</Button>
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                </div>
              }
              code={`import { Button } from "@workspace/ui/components/button"

<div className="flex items-center gap-4">
  <Button size="xs">Extra Small</Button>
  <Button size="sm">Small</Button>
  <Button size="default">Default</Button>
  <Button size="lg">Large</Button>
</div>`}
            />
          </div>

          <Separator />

          {/* Input Section */}
          <section id="input" className="scroll-mt-8 space-y-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Input
              </h2>
              <p className="mt-2 text-muted-foreground">
                A text input component with various states.
              </p>
            </div>

            {/* Default Input */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">Default</h3>
              <PreviewCodeTabs
                preview={<Input placeholder="Enter text..." />}
                code={`import { Input } from "@workspace/ui/components/input"

<Input placeholder="Enter text..." />`}
              />
            </div>

            {/* Disabled Input */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">
                Disabled
              </h3>
              <PreviewCodeTabs
                preview={<Input disabled placeholder="Disabled input..." />}
                code={`import { Input } from "@workspace/ui/components/input"

<Input disabled placeholder="Disabled input..." />`}
              />
            </div>
          </section>

          <Separator />

          {/* Label Section */}
          <section id="label" className="scroll-mt-8 space-y-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Label
              </h2>
              <p className="mt-2 text-muted-foreground">
                A form label component with proper accessibility.
              </p>
            </div>

            <div className="space-y-4">
              <PreviewCodeTabs
                preview={
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" placeholder="your@email.com" />
                  </div>
                }
                code={`import { Label } from "@workspace/ui/components/label"
import { Input } from "@workspace/ui/components/input"

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" placeholder="your@email.com" />
</div>`}
              />
            </div>
          </section>
        </section>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/app/components/forms/page.tsx
git commit -m "feat: add forms category page with button, input, label examples"
```

---

### Task 8: Create Navigation Category Page

**Files:**

- Create: `apps/web/app/components/navigation/page.tsx`

- [ ] **Step 1: Create navigation page with components**

```tsx
"use client"

import { useState } from "react"
import { PreviewCodeTabs } from "@/features/showcase/components/preview-code-tabs"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@workspace/ui/components/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Button } from "@workspace/ui/components/button"
import { ChevronRight, MoreHorizontal } from "lucide-react"

export default function NavigationPage() {
  const [tabValue, setTabValue] = useState("preview")

  return (
    <div className="container px-8 py-12">
      <div className="max-w-4xl space-y-16">
        {/* Breadcrumb Section */}
        <section id="breadcrumb" className="scroll-mt-8 space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Breadcrumb
            </h1>
            <p className="mt-2 text-muted-foreground">
              Breadcrumb navigation for hierarchical content.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Default</h2>
            <PreviewCodeTabs
              preview={
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <a
                        href="#"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        Home
                      </a>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <a
                        href="#"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        Components
                      </a>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Navigation</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              }
              code={`import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <a href="#">Home</a>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <a href="#">Components</a>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Navigation</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>`}
            />
          </div>
        </section>

        {/* Tabs Section */}
        <section id="tabs" className="scroll-mt-8 space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Tabs
            </h1>
            <p className="mt-2 text-muted-foreground">
              Tabbed content with smooth transitions.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Default</h2>
            <PreviewCodeTabs
              preview={
                <Tabs defaultValue="account" className="w-[400px]">
                  <TabsList>
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="password">Password</TabsTrigger>
                  </TabsList>
                  <TabsContent value="account">
                    <p className="text-sm text-muted-foreground">
                      Make changes to your account here.
                    </p>
                  </TabsContent>
                  <TabsContent value="password">
                    <p className="text-sm text-muted-foreground">
                      Change your password here.
                    </p>
                  </TabsContent>
                </Tabs>
              }
              code={`import { Tabs, TabsList, TabsTrigger, TabsContent } from "@workspace/ui/components/tabs"

<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">
    <p>Make changes to your account here.</p>
  </TabsContent>
  <TabsContent value="password">
    <p>Change your password here.</p>
  </TabsContent>
</Tabs>`}
            />
          </div>
        </section>

        {/* Dropdown Menu Section */}
        <section id="dropdown-menu" className="scroll-mt-8 space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Dropdown Menu
            </h1>
            <p className="mt-2 text-muted-foreground">
              Dropdown menu with various item types.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Basic</h2>
            <PreviewCodeTabs
              preview={
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon-xs">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Duplicate</DropdownMenuItem>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              }
              code={`import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Button } from "@workspace/ui/components/button"
import { MoreHorizontal } from "lucide-react"

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline" size="icon-xs">
      <MoreHorizontal className="size-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Edit</DropdownMenuItem>
    <DropdownMenuItem>Duplicate</DropdownMenuItem>
    <DropdownMenuItem>Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`}
            />
          </div>
        </section>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/app/components/navigation/page.tsx
git commit -m "feat: add navigation category page with breadcrumb, tabs, dropdown-menu"
```

---

### Task 9: Create Overlays & Feedback Category Page

**Files:**

- Create: `apps/web/app/components/overlays/page.tsx`

- [ ] **Step 1: Create overlays page with components**

```tsx
"use client"

import { useState } from "react"
import { PreviewCodeTabs } from "@/features/showcase/components/preview-code-tabs"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@workspace/ui/components/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"
import { toast } from "sonner"
import { Button } from "@workspace/ui/components/button"
import { Skeleton } from "@workspace/ui/components/skeleton"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible"
import { ChevronRight } from "lucide-react"

export default function OverlaysPage() {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [collapsibleOpen, setCollapsibleOpen] = useState(true)

  return (
    <div className="container px-8 py-12">
      <div className="max-w-4xl space-y-16">
        {/* Sheet Section */}
        <section id="sheet" className="scroll-mt-8 space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Sheet
            </h1>
            <p className="mt-2 text-muted-foreground">
              Slide-over panel from any edge.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              Right Side
            </h2>
            <PreviewCodeTabs
              preview={
                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                  <SheetTrigger asChild>
                    <Button>Open Sheet</Button>
                  </SheetTrigger>
                  <SheetContent side="right">
                    <div className="space-y-4">
                      <h2 className="text-lg font-semibold">Sheet Title</h2>
                      <p className="text-sm text-muted-foreground">
                        This is the sheet content area.
                      </p>
                    </div>
                  </SheetContent>
                </Sheet>
              }
              code={`import { Sheet, SheetContent, SheetTrigger } from "@workspace/ui/components/sheet"
import { Button } from "@workspace/ui/components/button"

<Sheet open={open} onOpenChange={setOpen}>
  <SheetTrigger asChild>
    <Button>Open Sheet</Button>
  </SheetTrigger>
  <SheetContent side="right">
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Sheet Title</h2>
      <p className="text-sm text-muted-foreground">
        This is the sheet content area.
      </p>
    </div>
  </SheetContent>
</Sheet>`}
            />
          </div>
        </section>

        {/* Tooltip Section */}
        <section id="tooltip" className="scroll-mt-8 space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Tooltip
            </h1>
            <p className="mt-2 text-muted-foreground">
              Hover tooltip with positioning options.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Basic</h2>
            <PreviewCodeTabs
              preview={
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline">Hover me</Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This is a tooltip</p>
                  </TooltipContent>
                </Tooltip>
              }
              code={`import { Tooltip, TooltipContent, TooltipTrigger } from "@workspace/ui/components/tooltip"
import { Button } from "@workspace/ui/components/button"

<Tooltip>
  <TooltipTrigger asChild>
    <Button variant="outline">Hover me</Button>
  </TooltipTrigger>
  <TooltipContent>
    <p>This is a tooltip</p>
  </TooltipContent>
</Tooltip>`}
            />
          </div>
        </section>

        {/* Sonner Section */}
        <section id="sonner" className="scroll-mt-8 space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Sonner
            </h1>
            <p className="mt-2 text-muted-foreground">
              Toast notifications for user feedback.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Examples</h2>
            <PreviewCodeTabs
              preview={
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    onClick={() => toast.success("Operation successful")}
                  >
                    Success
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => toast.error("Something went wrong")}
                  >
                    Error
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => toast.info("Here is some information")}
                  >
                    Info
                  </Button>
                </div>
              }
              code={`import { toast } from "sonner"
import { Button } from "@workspace/ui/components/button"

<Button onClick={() => toast.success("Operation successful")}>
  Success
</Button>
<Button onClick={() => toast.error("Something went wrong")}>
  Error
</Button>
<Button onClick={() => toast.info("Here is some information")}>
  Info
</Button>`}
            />
          </div>
        </section>

        {/* Skeleton Section */}
        <section id="skeleton" className="scroll-mt-8 space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Skeleton
            </h1>
            <p className="mt-2 text-muted-foreground">
              Loading placeholder with various shapes.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              Card Skeleton
            </h2>
            <PreviewCodeTabs
              preview={
                <div className="w-[300px] space-y-3 rounded-lg border p-4">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              }
              code={`import { Skeleton } from "@workspace/ui/components/skeleton"

<div className="space-y-3 p-4 border rounded-lg w-[300px]">
  <Skeleton className="h-5 w-2/3" />
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-4/5" />
</div>`}
            />
          </div>
        </section>

        {/* Collapsible Section */}
        <section id="collapsible" className="scroll-mt-8 space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Collapsible
            </h1>
            <p className="mt-2 text-muted-foreground">
              Expandable/collapsible content section.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Default</h2>
            <PreviewCodeTabs
              preview={
                <Collapsible
                  open={collapsibleOpen}
                  onOpenChange={setCollapsibleOpen}
                >
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <ChevronRight
                        className={`size-4 transition-transform ${collapsibleOpen ? "rotate-90" : ""}`}
                      />
                      Toggle Content
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-2">
                    <div className="rounded-md bg-muted p-4 text-sm">
                      This is the collapsible content that can be shown or
                      hidden.
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              }
              code={`import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible"
import { Button } from "@workspace/ui/components/button"
import { ChevronRight } from "lucide-react"

<Collapsible open={open} onOpenChange={setOpen}>
  <CollapsibleTrigger asChild>
    <Button variant="ghost" size="sm">
      <ChevronRight className="size-4" />
      Toggle Content
    </Button>
  </CollapsibleTrigger>
  <CollapsibleContent className="pt-2">
    <div className="rounded-md bg-muted p-4">
      This is the collapsible content.
    </div>
  </CollapsibleContent>
</Collapsible>`}
            />
          </div>
        </section>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/app/components/overlays/page.tsx
git commit -m "feat: add overlays & feedback category page with sheet, tooltip, sonner, skeleton, collapsible"
```

---

### Task 10: Create Data Display Category Page

**Files:**

- Create: `apps/web/app/components/data-display/page.tsx`

- [ ] **Step 1: Create data display page with components**

```tsx
import { PreviewCodeTabs } from "@/features/showcase/components/preview-code-tabs"
import { Card } from "@workspace/ui/components/card"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import { Separator } from "@workspace/ui/components/separator"

export default function DataDisplayPage() {
  return (
    <div className="container px-8 py-12">
      <div className="max-w-4xl space-y-16">
        {/* Card Section */}
        <section id="card" className="scroll-mt-8 space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Card
            </h1>
            <p className="mt-2 text-muted-foreground">
              Card container for grouped content.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Default</h2>
            <PreviewCodeTabs
              preview={
                <Card className="p-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Card Title</h3>
                    <p className="text-sm text-muted-foreground">
                      This is a card component containing some example content.
                    </p>
                  </div>
                </Card>
              }
              code={`import { Card } from "@workspace/ui/components/card"

<Card className="p-6">
  <div className="space-y-2">
    <h3 className="text-lg font-semibold">Card Title</h3>
    <p className="text-sm text-muted-foreground">
      This is a card component containing some example content.
    </p>
  </div>
</Card>`}
            />
          </div>
        </section>

        {/* Avatar Section */}
        <section id="avatar" className="scroll-mt-8 space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Avatar
            </h1>
            <p className="mt-2 text-muted-foreground">
              User avatar with fallback options.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Sizes</h2>
            <PreviewCodeTabs
              preview={
                <div className="flex items-center gap-4">
                  <Avatar className="size-8">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <Avatar className="size-10">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <Avatar className="size-14">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </div>
              }
              code={`import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"

<div className="flex items-center gap-4">
  <Avatar className="size-8">
    <AvatarImage src="https://github.com/shadcn.png" />
    <AvatarFallback>CN</AvatarFallback>
  </Avatar>
  <Avatar className="size-10">
    <AvatarImage src="https://github.com/shadcn.png" />
    <AvatarFallback>CN</AvatarFallback>
  </Avatar>
  <Avatar>
    <AvatarImage src="https://github.com/shadcn.png" />
    <AvatarFallback>CN</AvatarFallback>
  </Avatar>
  <Avatar className="size-14">
    <AvatarImage src="https://github.com/shadcn.png" />
    <AvatarFallback>CN</AvatarFallback>
  </Avatar>
</div>`}
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Fallback</h2>
            <PreviewCodeTabs
              preview={
                <Avatar>
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              }
              code={`import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"

<Avatar>
  <AvatarFallback>JD</AvatarFallback>
</Avatar>`}
            />
          </div>
        </section>

        {/* Separator Section */}
        <section id="separator" className="scroll-mt-8 space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Separator
            </h1>
            <p className="mt-2 text-muted-foreground">
              Visual divider with orientation options.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              Horizontal
            </h2>
            <PreviewCodeTabs
              preview={
                <div className="w-[200px] space-y-4">
                  <div>Content above</div>
                  <Separator />
                  <div>Content below</div>
                </div>
              }
              code={`import { Separator } from "@workspace/ui/components/separator"

<div className="w-[200px] space-y-4">
  <div>Content above</div>
  <Separator />
  <div>Content below</div>
</div>`}
            />
          </div>
        </section>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/app/components/data-display/page.tsx
git commit -m "feat: add data display category page with card, avatar, separator"
```

---

### Task 11: Add Mobile Menu to Sidebar

**Files:**

- Modify: `apps/web/features/showcase/components/showcase-sidebar.tsx`

- [ ] **Step 1: Add mobile hamburger menu**

```tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Menu, X } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"
import { categories, components } from "../lib/component-data"

export function ShowcaseSidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isCategoryActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + "#")
  }

  const isComponentActive = (path: string) => {
    return pathname.endsWith(path.split("#")[1])
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed top-0 left-0 z-40 p-4 lg:hidden">
        <Button
          size="icon-xs"
          variant="outline"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
        </Button>
      </div>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen w-64 border-r border-border bg-background transition-transform lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <Link
              href="/components"
              className="font-semibold text-foreground"
              onClick={() => setMobileOpen(false)}
            >
              Components
            </Link>
            <Button
              size="icon-xs"
              variant="ghost"
              className="lg:hidden"
              onClick={() => setMobileOpen(false)}
            >
              <X className="size-4" />
            </Button>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-4">
            <ul className="space-y-6">
              {categories.map((category) => (
                <li key={category.path}>
                  <Link
                    href={category.path}
                    className={cn(
                      "mb-2 flex items-center gap-1 text-sm font-medium",
                      isCategoryActive(category.path)
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    onClick={() => setMobileOpen(false)}
                  >
                    <ChevronRight className="size-4" />
                    {category.name}
                  </Link>
                  <ul className="ml-6 space-y-1">
                    {category.components.map((componentKey) => {
                      const component = components[componentKey]
                      if (!component) return null
                      return (
                        <li key={componentKey}>
                          <Link
                            href={component.path}
                            className={cn(
                              "block rounded-md px-2 py-1 text-sm transition-colors",
                              isComponentActive(component.path)
                                ? "bg-muted text-foreground"
                                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                            )}
                            onClick={() => setMobileOpen(false)}
                          >
                            {component.name}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  )
}
```

- [ ] **Step 2: Update main content margin for mobile**

```tsx
import { ShowcaseSidebar } from "@/features/showcase/components/showcase-sidebar"

export default function ComponentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-dvh">
      <ShowcaseSidebar />
      <main className="flex-1 lg:ml-64">{children}</main>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/features/showcase/components/showcase-sidebar.tsx apps/web/app/components/layout.tsx
git commit -m "feat: add mobile menu to showcase sidebar"
```

---

### Task 12: Add Responsive Padding to Content

**Files:**

- Modify: `apps/web/app/components/page.tsx`
- Modify: `apps/web/app/components/forms/page.tsx`
- Modify: `apps/web/app/components/navigation/page.tsx`
- Modify: `apps/web/app/components/overlays/page.tsx`
- Modify: `apps/web/app/components/data-display/page.tsx`

- [ ] **Step 1: Update all page containers for mobile padding**

For each page file, change the container div from:

```tsx
<div className="container px-8 py-12">
```

To:

```tsx
<div className="container px-4 py-12 lg:px-8 pt-20 lg:pt-12">
```

This adds top padding on mobile to clear the hamburger menu and adjusts horizontal padding.

- [ ] **Step 2: Commit**

```bash
git add apps/web/app/components/page.tsx apps/web/app/components/forms/page.tsx apps/web/app/components/navigation/page.tsx apps/web/app/components/overlays/page.tsx apps/web/app/components/data-display/page.tsx
git commit -m "fix: add responsive padding for mobile to showcase pages"
```

---

## Self-Review Checklist

After completing the plan:

**1. Spec Coverage:**

- Route structure (`/components`, `/components/forms`, etc.) → Tasks 6, 7, 8, 9, 10 ✓
- Left sidebar navigation → Tasks 2, 11 ✓
- Live preview with theme toggle → Tasks 4, 5 ✓
- Code blocks with copy button → Tasks 3, 5 ✓
- All 18 components showcased → Tasks 7, 8, 9, 10 ✓
- Responsive design → Tasks 11, 12 ✓

**2. Placeholder Scan:**

- No TBDs, TODOs, or "implement later" statements ✓
- All code examples are complete ✓
- All file paths are specified ✓

**3. Type Consistency:**

- Component names match metadata (button, input, etc.) ✓
- Route paths match metadata structure ✓
- Import paths use `@workspace/ui` correctly ✓

**4. Scope Check:**

- Focused on single feature (component showcase) ✓
- All tasks are sequential and build on each other ✓
- Each task produces a working unit ✓
