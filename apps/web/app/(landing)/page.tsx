import { SiteHeader } from "@/features/landing/components/site-header"
import { HeroSection } from "@/features/landing/components/hero-section"
import { CodeWalkthrough } from "@/features/landing/components/code-walkthrough"
import { FeatureGrid } from "@/features/landing/components/feature-grid"
import { DocsPreview } from "@/features/landing/components/docs-preview"
import { CTASection } from "@/features/landing/components/cta-section"
import { SiteFooter } from "@/features/landing/components/site-footer"

export default function Page() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <CodeWalkthrough />
        <FeatureGrid />
        <DocsPreview />
        <CTASection />
      </main>
      <SiteFooter />
    </div>
  )
}
