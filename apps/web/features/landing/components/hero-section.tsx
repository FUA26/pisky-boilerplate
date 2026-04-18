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
