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
