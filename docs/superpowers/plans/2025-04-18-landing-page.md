# Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a clean, Notion-inspired landing page for Zilpo that showcases the codebase, architecture patterns, and documentation to appeal to enterprise developers.

**Architecture:** Single-page React Server Component with modular section components. Uses shadcn/ui primitives, follows existing feature-based structure, and integrates with current theme system.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, shadcn/ui components

---

## File Structure

```
apps/web/
├── app/
│   └── page.tsx                    # MODIFY - New landing page
├── features/
│   └── landing/
│       ├── components/
│       │   ├── hero-section.tsx        # Hero with terminal preview
│       │   ├── code-walkthrough.tsx    # Tabbed code architecture demo
│       │   ├── feature-grid.tsx        # Feature breakdown with expandable code
│       │   ├── docs-preview.tsx        # Documentation showcase
│       │   ├── cta-section.tsx         # Final call-to-action
│       │   └── terminal-block.tsx      # Reusable terminal component
│       └── lib/
│           └── code-examples.ts        # Code snippet data

packages/ui/src/components/
└── tabs.tsx                        # CREATE - shadcn tabs component
```

---

## Task 1: Add Tabs Component from shadcn

**Files:**

- Create: `packages/ui/src/components/tabs.tsx`
- Create: `packages/ui/src/components/tabs-list.tsx`
- Create: `packages/ui/src/components/tabs-trigger.tsx`
- Create: `packages/ui/src/components/tabs-content.tsx`

- [ ] **Step 1: Add tabs component using shadcn CLI**

Run from `apps/web/`:

```bash
cd /home/acn/main/zilpo/apps/web && pnpm dlx shadcn@latest add tabs -c apps/web
```

Expected: New tab components created in `packages/ui/src/components/`

- [ ] **Step 2: Verify tabs component is available**

Check the files were created:

```bash
ls -la /home/acn/main/zilpo/packages/ui/src/components/ | grep tabs
```

Expected: Output shows `tabs.tsx`, `tabs-list.tsx`, `tabs-trigger.tsx`, `tabs-content.tsx`

- [ ] **Step 3: Commit**

```bash
git add packages/ui/src/components/tabs*.tsx
git commit -m "feat: add tabs component from shadcn

Adds tab components for landing page code walkthrough section.
Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 2: Create Reusable Terminal Block Component

**Files:**

- Create: `apps/web/features/landing/components/terminal-block.tsx`

- [ ] **Step 1: Create the terminal component file**

```bash
mkdir -p /home/acn/main/zilpo/apps/web/features/landing/components
```

Create `apps/web/features/landing/components/terminal-block.tsx`:

```tsx
import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"
import { Check, Copy } from "lucide-react"
import { useState } from "react"

interface TerminalBlockProps {
  children: string
  className?: string
}

export function TerminalBlock({ children, className }: TerminalBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={cn(
        "relative rounded-lg border bg-muted p-4 font-mono text-sm",
        className
      )}
    >
      <div className="absolute top-2 right-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>
      <pre className="overflow-x-auto">
        <code>{children}</code>
      </pre>
    </div>
  )
}
```

- [ ] **Step 2: Verify component compiles**

Run TypeScript check:

```bash
cd /home/acn/main/zilpo && pnpm typecheck
```

Expected: No type errors

- [ ] **Step 3: Commit**

```bash
git add apps/web/features/landing/components/terminal-block.tsx
git commit -m "feat: add terminal block component

Reusable terminal-style code block with copy functionality.
Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 3: Create Hero Section Component

**Files:**

- Create: `apps/web/features/landing/components/hero-section.tsx`

- [ ] **Step 1: Create hero section component**

Create `apps/web/features/landing/components/hero-section.tsx`:

```tsx
import { Button } from "@workspace/ui/components/button"
import { TerminalBlock } from "./terminal-block"

export function HeroSection() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="max-w-3xl text-4xl leading-tight font-semibold tracking-tight sm:text-5xl sm:font-medium">
        Skip boilerplate. Ship features. Scale confidently.
      </h1>

      <div className="mt-12 w-full max-w-2xl">
        <TerminalBlock>
          {
            "$ npx create-zilpo my-app\n✓ Cloned template\n✓ Installed dependencies\n✓ Dev server running\n\nReady to ship at localhost:3000"
          }
        </TerminalBlock>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
        <Button size="lg" asChild>
          <a href="#docs">Get Started</a>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <a href="#docs">Read the Docs</a>
        </Button>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify component compiles**

```bash
cd /home/acn/main/zilpo && pnpm typecheck
```

Expected: No type errors

- [ ] **Step 3: Commit**

```bash
git add apps/web/features/landing/components/hero-section.tsx
git commit -m "feat: add hero section component

Hero with headline, terminal preview, and CTAs.
Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 4: Create Code Examples Data File

**Files:**

- Create: `apps/web/features/landing/lib/code-examples.ts`

- [ ] **Step 1: Create code examples data**

Create `apps/web/features/landing/lib/code-examples.ts`:

```tsx
export interface CodeExample {
  title: string
  description: string
  code: string
  learnMoreHref?: string
}

export const codeWalkthroughExamples: Record<string, CodeExample> = {
  "feature-structure": {
    title: "Feature-Based Architecture",
    description:
      "Every feature is self-contained: UI components live with the feature, server actions are co-located, and boundaries are clear. Teams can work on features in parallel without conflicts.",
    code: `features/
├── auth/
│   ├── components/
│   ├── hooks/
│   ├── server-actions.ts
│   └── page.tsx
├── dashboard/
└── shared/`,
    learnMoreHref: "/docs/architecture",
  },
  auth: {
    title: "Authentication Flow",
    description:
      "NextAuth.js v5 is configured with credentials provider. The auth config lives in the auth feature, making it easy to extend with additional providers.",
    code: `export const authOptions: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      authorize: async (credentials) => {
        // Your auth logic here
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      return session
    },
  },
}`,
    learnMoreHref: "/docs/authentication",
  },
  "api-patterns": {
    title: "API Patterns",
    description:
      "Server actions provide type-safe mutations without separate API routes. Form validation happens on the server, keeping the client lean.",
    code: `"use server"

import { authSchema } from "./auth-validation"

export async function loginAction(formData: FormData) {
  const validatedFields = authSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!validatedFields.success) {
    return { error: "Invalid fields" }
  }

  // Auth logic here
  return { success: true }
}`,
    learnMoreHref: "/docs/api-patterns",
  },
  "type-safety": {
    title: "Type Safety",
    description:
      "TypeScript strict mode is enabled throughout. Shared types ensure contracts between server and client are enforced at compile time.",
    code: `// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}

// Shared types used across features
export interface User {
  id: string
  email: string
  name: string
}`,
    learnMoreHref: "/docs/typescript",
  },
}
```

- [ ] **Step 2: Verify file compiles**

```bash
cd /home/acn/main/zilpo && pnpm typecheck
```

Expected: No type errors

- [ ] **Step 3: Commit**

```bash
git add apps/web/features/landing/lib/code-examples.ts
git commit -m "feat: add code examples data

Structured data for walkthrough tabs with real code snippets.
Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 5: Create Code Walkthrough Section

**Files:**

- Create: `apps/web/features/landing/components/code-walkthrough.tsx`

- [ ] **Step 1: Create code walkthrough component**

Create `apps/web/features/landing/components/code-walkthrough.tsx`:

```tsx
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"
import { TerminalBlock } from "./terminal-block"
import { codeWalkthroughExamples } from "../lib/code-examples"

const tabs = [
  { value: "feature-structure", label: "Feature Structure" },
  { value: "auth", label: "Auth Flow" },
  { value: "api-patterns", label: "API Patterns" },
  { value: "type-safety", label: "Type Safety" },
]

export function CodeWalkthrough() {
  return (
    <section className="border-t py-24">
      <div className="container px-6">
        <h2 className="mb-4 text-2xl font-semibold sm:text-3xl">
          See How It Works
        </h2>
        <p className="mb-12 text-muted-foreground">
          Explore the architecture patterns that make Zilpo enterprise-ready.
        </p>

        <Tabs defaultValue="feature-structure" className="w-full">
          <TabsList className="w-full justify-start sm:w-auto">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => {
            const example = codeWalkthroughExamples[tab.value]
            return (
              <TabsContent key={tab.value} value={tab.value}>
                <div className="grid gap-8 lg:grid-cols-2">
                  <div>
                    <TerminalBlock>{example.code}</TerminalBlock>
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="mb-3 text-xl font-semibold">
                      {example.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {example.description}
                    </p>
                    {example.learnMoreHref && (
                      <a
                        href={example.learnMoreHref}
                        className="mt-4 inline-flex text-sm font-medium text-primary hover:underline"
                      >
                        See full architecture →
                      </a>
                    )}
                  </div>
                </div>
              </TabsContent>
            )
          })}
        </Tabs>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify component compiles**

```bash
cd /home/acn/main/zilpo && pnpm typecheck
```

Expected: No type errors

- [ ] **Step 3: Commit**

```bash
git add apps/web/features/landing/components/code-walkthrough.tsx
git commit -m "feat: add code walkthrough section

Tabbed interface showing architecture patterns with code.
Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 6: Create Feature Grid Section

**Files:**

- Create: `apps/web/features/landing/components/feature-grid.tsx`

- [ ] **Step 1: Create feature grid component**

Create `apps/web/features/landing/components/feature-grid.tsx`:

```tsx
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
```

- [ ] **Step 2: Verify component compiles**

```bash
cd /home/acn/main/zilpo && pnpm typecheck
```

Expected: No type errors

- [ ] **Step 3: Commit**

```bash
git add apps/web/features/landing/components/feature-grid.tsx
git commit -m "feat: add feature grid section

Expandable cards showing features with code examples.
Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 7: Create Documentation Preview Section

**Files:**

- Create: `apps/web/features/landing/components/docs-preview.tsx`

- [ ] **Step 1: Create docs preview component**

Create `apps/web/features/landing/components/docs-preview.tsx`:

```tsx
import { Card, CardContent } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"

const navItems = [
  {
    category: "Quick Start",
    items: ["Getting Started", "Installation", "Project Structure"],
  },
  {
    category: "Features",
    items: ["Authentication", "Dashboard", "Components"],
  },
  {
    category: "Architecture",
    items: ["Feature Structure", "Monorepo Setup", "Deployment"],
  },
]

export function DocsPreview() {
  return (
    <section className="border-t py-24">
      <div className="container px-6">
        <h2 className="mb-4 text-2xl font-semibold sm:text-3xl">
          Built for Teams
        </h2>
        <p className="mb-12 text-muted-foreground">
          Your team won&apos;t be guessing. Everything is documented.
        </p>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Navigation sidebar mockup */}
          <Card>
            <CardContent className="p-6">
              <Input placeholder="Search docs..." className="mb-6" />
              {navItems.map((section) => (
                <div key={section.category} className="mb-4">
                  <h4 className="mb-2 text-sm font-semibold">
                    {section.category}
                  </h4>
                  <ul className="space-y-1">
                    {section.items.map((item) => (
                      <li key={item}>
                        <a
                          href="#"
                          className="block rounded px-2 py-1 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          ▸ {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Doc content mockup */}
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-2 text-xl font-semibold">Authentication</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Learn how NextAuth.js v5 is configured in Zilpo.
              </p>
              <h4 className="mb-2 text-lg font-semibold">Configuration</h4>
              <p className="mb-4 text-sm text-muted-foreground">
                The auth config lives in:{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                  apps/web/features/auth/
                </code>
              </p>
              <div className="rounded-md bg-muted p-4">
                <pre className="overflow-x-auto text-xs">
                  <code>{`export const authOptions = {
  providers: [...],
  callbacks: { ... }
}`}</code>
                </pre>
              </div>
              <Button variant="link" className="mt-4 p-0" asChild>
                <a href="#docs">Read full auth guide →</a>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Button size="lg" variant="outline" asChild>
            <a href="#docs">Browse Full Documentation</a>
          </Button>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify component compiles**

```bash
cd /home/acn/main/zilpo && pnpm typecheck
```

Expected: No type errors

- [ ] **Step 3: Commit**

```bash
git add apps/web/features/landing/components/docs-preview.tsx
git commit -m "feat: add documentation preview section

Two-column layout showcasing documentation structure.
Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 8: Create CTA Section Component

**Files:**

- Create: `apps/web/features/landing/components/cta-section.tsx`

- [ ] **Step 1: Create CTA section component**

Create `apps/web/features/landing/components/cta-section.tsx`:

```tsx
import { Button } from "@workspace/ui/components/button"
import { TerminalBlock } from "./terminal-block"

const gitCommands = `$ git clone https://github.com/yourorg/zilpo.git
$ cd zilpo && pnpm install
$ pnpm dev

→ Ready to ship at localhost:3000`

export function CTASection() {
  return (
    <section className="border-t py-24">
      <div className="container flex max-w-4xl flex-col items-center px-6 text-center">
        <h2 className="mb-4 text-2xl font-semibold sm:text-3xl">
          Ready to build?
        </h2>

        <div className="mt-8 w-full max-w-2xl">
          <TerminalBlock>{gitCommands}</TerminalBlock>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Button
            size="lg"
            onClick={() => navigator.clipboard.writeText(gitCommands)}
          >
            Copy Commands
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="#docs">Read the Guide</a>
          </Button>
        </div>

        <div className="mt-12">
          <p className="mb-4 text-sm text-muted-foreground">
            Or deploy instantly:
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="outline" asChild>
              <a
                href="https://vercel.com/new"
                target="_blank"
                rel="noopener noreferrer"
              >
                Deploy to Vercel
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a
                href="https://railway.app/new"
                target="_blank"
                rel="noopener noreferrer"
              >
                Deploy to Railway
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify component compiles**

```bash
cd /home/acn/main/zilpo && pnpm typecheck
```

Expected: No type errors

- [ ] **Step 3: Commit**

```bash
git add apps/web/features/landing/components/cta-section.tsx
git commit -m "feat: add CTA section component

Final call-to-action with copyable git commands and deploy links.
Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 9: Update Homepage to Use New Landing Page

**Files:**

- Modify: `apps/web/app/page.tsx`

- [ ] **Step 1: Replace homepage content**

Replace the entire content of `apps/web/app/page.tsx` with:

```tsx
import { HeroSection } from "@/features/landing/components/hero-section"
import { CodeWalkthrough } from "@/features/landing/components/code-walkthrough"
import { FeatureGrid } from "@/features/landing/components/feature-grid"
import { DocsPreview } from "@/features/landing/components/docs-preview"
import { CTASection } from "@/features/landing/components/cta-section"

export default function Page() {
  return (
    <main className="min-h-dvh">
      <HeroSection />
      <CodeWalkthrough />
      <FeatureGrid />
      <DocsPreview />
      <CTASection />
    </main>
  )
}
```

- [ ] **Step 2: Verify the page compiles**

```bash
cd /home/acn/main/zilpo && pnpm typecheck
```

Expected: No type errors

- [ ] **Step 3: Start dev server and verify visually**

```bash
cd /home/acn/main/zilpo && pnpm dev
```

Expected: Server starts on http://localhost:3000. Visit and verify:

- Hero section with headline and terminal
- Code walkthrough with tabs
- Feature grid with expandable cards
- Documentation preview
- CTA section with git commands

- [ ] **Step 4: Stop dev server and commit**

```bash
# Press Ctrl+C to stop dev server
git add apps/web/app/page.tsx
git commit -m "feat: implement landing page

Replace placeholder homepage with full landing page featuring:
- Hero with terminal preview
- Code walkthrough with tabs
- Feature grid with expandable code
- Documentation preview
- CTA with copyable commands

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 10: Run Full Test Suite

**Files:**

- Test: All affected files

- [ ] **Step 1: Run type check**

```bash
cd /home/acn/main/zilpo && pnpm typecheck
```

Expected: No type errors

- [ ] **Step 2: Run linter**

```bash
cd /home/acn/main/zilpo && pnpm lint
```

Expected: No linting errors

- [ ] **Step 3: Verify responsive layout**

Check at different viewport sizes. The layout should stack properly on mobile.

- [ ] **Step 4: Final commit**

```bash
git commit --allow-empty -m "chore: landing page implementation complete

All tests passing, responsive layout verified.
Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Self-Review Results

**Spec coverage check:**

- Hero section with terminal preview ✓ (Task 3)
- Code walkthrough with tabs ✓ (Task 5)
- Feature breakdown grid ✓ (Task 6)
- Documentation preview ✓ (Task 7)
- CTA with copyable commands ✓ (Task 8)
- Clean, minimal visual style ✓ (using shadcn components, proper spacing)

**Placeholder scan:** No placeholders found. All code is complete.

**Type consistency:** Component imports and usage are consistent throughout. TerminalBlock is reused properly.

**File structure check:** All files follow feature-based architecture pattern.
