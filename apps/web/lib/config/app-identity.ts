import { LifeBuoy } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export interface AppIdentityMetric {
  id: string
  label: string
  icon: string
}

export interface AppIdentity {
  name: string
  fullName: string
  version: string
  category: string
  industry: string
  icon: LucideIcon
  features: string[]
  targetUsers: string[]
  defaultMetrics: AppIdentityMetric[]
  theme: {
    style: string
    mood: string
    primaryColorFamily: string
    borderStyle: string
    animationStyle: string
  }
  description: string
}

const appIdentity: AppIdentity = {
  name: "Pisky Support",
  fullName: "Pisky Support",
  version: "1.0.0",
  category: "support",
  industry: "Customer support platform",
  icon: LifeBuoy,
  features: [
    "Unified ticket handling",
    "Multi-channel intake",
    "Role-based access control",
  ],
  targetUsers: ["Agents", "Admins", "Supervisors"],
  defaultMetrics: [
    { id: "tickets", label: "Tickets", icon: "ticket" },
    { id: "alerts", label: "Alerts", icon: "alert-circle" },
    { id: "resolved", label: "Resolved", icon: "check-circle" },
    { id: "response", label: "Response Time", icon: "clock" },
  ],
  theme: {
    style: "editorial",
    mood: "calm",
    primaryColorFamily: "navy",
    borderStyle: "rounded",
    animationStyle: "subtle",
  },
  description:
    "A branded support workspace for managing apps, tickets, users, and settings.",
}

export function getAppIdentity() {
  return appIdentity
}
