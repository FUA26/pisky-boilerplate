"use client"

import { Button } from "@workspace/ui/components/button"
import { TerminalBlock } from "./terminal-block"
import { ArrowRight, Copy, Check } from "lucide-react"
import { useState } from "react"

const gitCommands = `$ git clone https://github.com/yourorg/zilpo.git
$ cd zilpo && pnpm install
$ pnpm dev

→ Ready to ship at localhost:3000`

export function CTASection() {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(gitCommands)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="border-t bg-muted/30 py-16 sm:py-20 md:py-28 lg:py-36">
      <div className="container">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="animate-in px-4 text-center duration-700 fade-in slide-in-from-bottom-4 sm:px-6">
            <h2 className="heading-hero text-balance">Ready to build?</h2>
            <p className="text-body-lg mt-6 text-muted-foreground">
              Three commands. That&apos;s all it takes to get started.
            </p>
          </div>

          {/* Terminal - prominent display */}
          <div className="relative mx-auto mt-8 max-w-2xl animate-in delay-200 duration-500 zoom-in-95 fade-in sm:mt-12">
            {/* Decorative glow */}
            <div className="absolute -inset-2 -z-10 rounded-xl bg-primary/5 blur-xl sm:-inset-3" />

            <TerminalBlock className="text-xs sm:text-sm" showCopy={false}>
              {gitCommands}
            </TerminalBlock>

            {/* Copy button floating on terminal */}
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 flex items-center gap-1.5 rounded-lg bg-background px-2.5 py-1.5 text-xs font-medium shadow-md transition-all hover:bg-muted sm:top-4 sm:right-4 sm:gap-2 sm:px-3 sm:py-2 sm:text-sm"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-green-500 sm:h-4 sm:w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Copy
                </>
              )}
            </button>
          </div>

          {/* Primary action */}
          <div className="mt-8 flex animate-in justify-center delay-300 duration-700 fade-in slide-in-from-bottom-4 sm:mt-10">
            <Button size="lg" className="group" asChild>
              <a href="#docs">
                Explore Documentation
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
          </div>

          {/* Deploy options - secondary */}
          <div className="mt-12 animate-in delay-500 duration-700 fade-in slide-in-from-bottom-4 sm:mt-16">
            <p className="mb-4 text-center text-xs text-muted-foreground sm:mb-6 sm:text-sm">
              Or deploy instantly to your favorite platform
            </p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              <Button variant="outline" size="sm" asChild>
                <a
                  href="https://vercel.com/new"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2L2 19.5h5.5l2-3.5h5l2 3.5H22L12 2zm0 3.5L15.5 12h-7L12 5.5zM8.5 17.5l-2 3.5h11l-2-3.5H8.5z" />
                  </svg>
                  Vercel
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a
                  href="https://railway.app/new"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M4.5 2h15L22 8.5 12 22 2 8.5 4.5 2zm0 3L3 8.5 12 19l9-10.5L19.5 5h-15z" />
                  </svg>
                  Railway
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a
                  href="https://netlify.com/drop"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                  Netlify
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
