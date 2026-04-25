import type { App, Channel } from "@/lib/types/apps"

export function getIntegrationCode(app: App, channel: Channel) {
  return {
    title: `${app.name} integration`,
    description: `Configure ${channel.name} for ${app.name}.`,
    sections: [
      {
        title: "Create a ticket",
        isCode: true,
        content: `fetch("/api/tickets", { method: "POST" })`,
      },
      {
        title: "Channel details",
        isCode: false,
        content: `Channel type: ${channel.type}`,
      },
    ],
  }
}
