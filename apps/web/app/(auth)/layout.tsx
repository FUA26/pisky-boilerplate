import type { ReactNode } from "react"
import { FloatingPaths } from "@/components/floating-paths"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-svh overflow-hidden lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      {/* Left: Brand content - warm, inviting, shows confidence */}
      <div className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[oklch(0.985_0.004_165)] via-[oklch(0.978_0.008_165)] to-[oklch(0.965_0.012_165)] p-8 md:p-12 lg:p-16">
        {/* Animated floating paths - adds life and continuity */}
        <div className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-20">
          <FloatingPaths position={1} />
        </div>

        {/* Logo - positioned naturally at top */}
        <div className="relative z-10">
          <a
            href="/"
            className="inline-flex items-center gap-2.5 font-heading font-semibold text-[oklch(0.205_0.006_165)] transition-opacity hover:opacity-70"
          >
            <div className="flex size-8 items-center justify-center rounded-xl bg-[oklch(0.508_0.118_165.612)] text-[oklch(0.979_0.021_166.113)] shadow-lg shadow-[oklch(0.508_0.118_165.612)/20]">
              <span className="text-sm font-bold">Z</span>
            </div>
            <span className="text-lg">Zilpo</span>
          </a>
        </div>

        {/* Brand message - the "why" */}
        <div className="relative z-10 max-w-xl">
          <h1 className="font-heading text-3xl leading-[1.15] font-bold tracking-tight text-[oklch(0.205_0.006_165)] md:text-4xl lg:text-5xl">
            Ship faster with
            <br />
            opinionated patterns
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-[oklch(0.45_0.008_165)] md:text-[oklch(0.42_0.01_165)]">
            Skip the boilerplate and get to building. Modern Next.js
            architecture, shadcn/ui components, and patterns that scale — all
            ready to go.
          </p>
        </div>

        {/* Trust indicators - subtle, not salesy */}
        <div className="relative z-10 flex flex-wrap gap-x-8 gap-y-4 text-sm text-[oklch(0.45_0.008_165)]">
          <div className="flex items-center gap-2 rounded-full border border-[oklch(0.90_0.02_165)] bg-[oklch(0.985_0.004_165)] px-3 py-1.5 shadow-sm">
            <div className="size-1.5 rounded-full bg-[oklch(0.508_0.118_165.612)]" />
            <span className="font-medium">Next.js 16</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[oklch(0.90_0.02_165)] bg-[oklch(0.985_0.004_165)] px-3 py-1.5 shadow-sm">
            <div className="size-1.5 rounded-full bg-[oklch(0.508_0.118_165.612)]" />
            <span className="font-medium">React 19</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[oklch(0.90_0.02_165)] bg-[oklch(0.985_0.004_165)] px-3 py-1.5 shadow-sm">
            <div className="size-1.5 rounded-full bg-[oklch(0.508_0.118_165.612)]" />
            <span className="font-medium">TypeScript</span>
          </div>
        </div>
      </div>

      {/* Right: Auth form - clean, focused, approachable */}
      <div className="relative flex flex-col justify-center bg-[oklch(0.992_0.002_165)] p-6 before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,oklch(0.98_0.008_165)_0%,transparent_100%)] md:p-10 lg:p-12">
        {/* Mobile logo - only shows on small screens */}
        <div className="mb-8 lg:hidden">
          <a
            href="/"
            className="inline-flex items-center gap-2.5 font-heading font-semibold"
          >
            <div className="flex size-7 items-center justify-center rounded-lg bg-[oklch(0.508_0.118_165.612)] text-[oklch(0.979_0.021_166.113)]">
              <span className="text-xs font-bold">Z</span>
            </div>
            <span>Zilpo</span>
          </a>
        </div>

        {/* Form container - constrained width for readability */}
        <div className="relative mx-auto w-full max-w-sm animate-in duration-700 fade-in slide-in-from-bottom-4">
          {children}
        </div>
      </div>
    </div>
  )
}
