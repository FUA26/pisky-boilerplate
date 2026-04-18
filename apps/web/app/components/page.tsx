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
