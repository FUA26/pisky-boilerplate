/**
 * Centralized site configuration
 * Edit these values to update links across the entire application
 */

export const siteConfig = {
  // Project URLs
  github: {
    url: "https://github.com/yourorg/pisky-support",
    repository: "yourorg/pisky-support",
  },
  twitter: {
    url: "https://twitter.com/piskysupport",
    handle: "@piskysupport",
  },
  docs: {
    url: "/docs",
  },
  // Project metadata
  name: "Pisky Support",
  description:
    "Support teams with opinionated, production-ready patterns that help them ship faster.",
  // Navigation
  nav: {
    features: "#features",
    docs: "#docs",
    changelog: "#changelog",
    guides: "#guides",
    examples: "#examples",
    support: "#support",
  },
  // Auth routes
  auth: {
    signIn: "/sign-in",
    signUp: "/sign-up",
  },
} as const

export type SiteConfig = typeof siteConfig
