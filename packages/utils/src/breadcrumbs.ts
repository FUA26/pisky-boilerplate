export interface Breadcrumb {
  label: string
  href?: string
}

export function generateBreadcrumbs(pathname: string): Breadcrumb[] {
  const segments = pathname.split("/").filter(Boolean)
  const breadcrumbs: Breadcrumb[] = []

  segments.forEach((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/")
    breadcrumbs.push({
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
      href,
    })
  })

  return breadcrumbs
}
