import type { LucideIcon } from "lucide-react"
import {
  Globe,
  Smartphone,
  Webhook,
  Megaphone,
  MessageSquare,
  Bot,
} from "lucide-react"

export type ChannelType =
  | "WEB_FORM"
  | "PUBLIC_LINK"
  | "WIDGET"
  | "INTEGRATED_APP"
  | "WHATSAPP"
  | "TELEGRAM"

export interface ChannelConfig {
  label: string
  description: string
  icon: LucideIcon
  color: string
  bgLight: string
  bgDark: string
}

export const CHANNEL_TYPE_OPTIONS: Array<{
  value: ChannelType
  label: string
  icon: LucideIcon
  color: string
}> = [
  { value: "WEB_FORM", label: "Web Form", icon: Globe, color: "text-blue-600" },
  {
    value: "PUBLIC_LINK",
    label: "Public Link",
    icon: Megaphone,
    color: "text-emerald-600",
  },
  {
    value: "WIDGET",
    label: "Widget",
    icon: Smartphone,
    color: "text-violet-600",
  },
  {
    value: "INTEGRATED_APP",
    label: "Integrated App",
    icon: Webhook,
    color: "text-orange-600",
  },
  {
    value: "WHATSAPP",
    label: "WhatsApp",
    icon: MessageSquare,
    color: "text-green-600",
  },
  { value: "TELEGRAM", label: "Telegram", icon: Bot, color: "text-sky-600" },
]

export function getChannelConfig(type: ChannelType): ChannelConfig {
  switch (type) {
    case "WEB_FORM":
      return {
        label: "Web Form",
        description: "Embed a support form on your website.",
        icon: Globe,
        color: "text-blue-600",
        bgLight: "bg-blue-500/10",
        bgDark: "dark:bg-blue-500/10",
      }
    case "PUBLIC_LINK":
      return {
        label: "Public Link",
        description: "Share a public support link.",
        icon: Megaphone,
        color: "text-emerald-600",
        bgLight: "bg-emerald-500/10",
        bgDark: "dark:bg-emerald-500/10",
      }
    case "WIDGET":
      return {
        label: "Widget",
        description: "Drop in a website widget.",
        icon: Smartphone,
        color: "text-violet-600",
        bgLight: "bg-violet-500/10",
        bgDark: "dark:bg-violet-500/10",
      }
    case "INTEGRATED_APP":
      return {
        label: "Integrated App",
        description: "Third-party app integration.",
        icon: Webhook,
        color: "text-orange-600",
        bgLight: "bg-orange-500/10",
        bgDark: "dark:bg-orange-500/10",
      }
    case "WHATSAPP":
      return {
        label: "WhatsApp",
        description: "Route support messages from WhatsApp.",
        icon: MessageSquare,
        color: "text-green-600",
        bgLight: "bg-green-500/10",
        bgDark: "dark:bg-green-500/10",
      }
    case "TELEGRAM":
      return {
        label: "Telegram",
        description: "Route support messages from Telegram.",
        icon: Bot,
        color: "text-sky-600",
        bgLight: "bg-sky-500/10",
        bgDark: "dark:bg-sky-500/10",
      }
  }
}
