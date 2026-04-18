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
