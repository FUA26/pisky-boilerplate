import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"
import { TerminalBlock } from "./terminal-block"
import { codeWalkthroughExamples, type CodeExample } from "../lib/code-examples"

const tabs = [
  { value: "feature-structure", label: "Feature Structure" },
  { value: "auth", label: "Auth Flow" },
  { value: "api-patterns", label: "API Patterns" },
  { value: "type-safety", label: "Type Safety" },
] as const

type TabValue = (typeof tabs)[number]["value"]

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
            const example = codeWalkthroughExamples[tab.value] as
              | CodeExample
              | undefined
            if (!example) return null

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
