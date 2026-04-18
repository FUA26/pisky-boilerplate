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
