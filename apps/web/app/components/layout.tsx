import { ShowcaseSidebar } from "@/features/showcase/components/showcase-sidebar"

export default function ComponentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-dvh">
      <ShowcaseSidebar />
      <main className="ml-64 flex-1">{children}</main>
    </div>
  )
}
