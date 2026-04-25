import {
  PrismaClient,
  Priority,
  SenderType,
  TicketStatus,
  ChannelType,
} from "@prisma/client"
import { randomBytes } from "node:crypto"

const prisma = new PrismaClient()

/**
 * Generate a secure API key
 */
function generateApiKey(): string {
  return randomBytes(32).toString("hex")
}

/**
 * Generate a unique ticket number
 */
function generateTicketNumber(appSlug: string, count: number): string {
  const num = String(count + 1).padStart(5, "0")
  return `${appSlug.toUpperCase()}-${num}`
}

/**
 * Sample ticket data templates
 */
const ticketTemplates = [
  {
    subject: "Login issue with my account",
    description:
      "I'm unable to log in to my account. I've tried resetting my password but haven't received the email.",
    priority: Priority.HIGH,
  },
  {
    subject: "Feature request: Dark mode",
    description:
      "Would love to see a dark mode option for the application. It would be easier on the eyes during evening use.",
    priority: Priority.NORMAL,
  },
  {
    subject: "Payment not reflected in my account",
    description:
      "I made a payment yesterday but my account still shows as unpaid. Transaction ID: TXN123456",
    priority: Priority.URGENT,
  },
  {
    subject: "How do I export my data?",
    description:
      "I'd like to export all my data from the platform. Is there a way to do this?",
    priority: Priority.LOW,
  },
  {
    subject: "Bug report: Page not loading",
    description:
      "The dashboard page doesn't load properly on Chrome. I just see a blank screen.",
    priority: Priority.HIGH,
  },
  {
    subject: "Request for API access",
    description:
      "I need API access to integrate your service with our internal tools.",
    priority: Priority.NORMAL,
  },
  {
    subject: "Billing cycle question",
    description:
      "When does my billing cycle start? I want to make sure I'm charged on the correct date.",
    priority: Priority.LOW,
  },
  {
    subject: "Unable to upload files",
    description:
      "I'm getting an error when trying to upload files. The error says 'File too large' but it's only 2MB.",
    priority: Priority.NORMAL,
  },
]

const guestNames = [
  "John Doe",
  "Jane Smith",
  "Bob Wilson",
  "Alice Brown",
  "Charlie Davis",
]
const guestEmails = [
  "john.doe@example.com",
  "jane.smith@example.com",
  "bob.wilson@example.com",
  "alice.brown@example.com",
  "charlie.davis@example.com",
]

/**
 * Apps configuration with channels
 */
const appsConfig = [
  {
    name: "Support",
    slug: "support",
    description: "General customer support and help desk",
    channels: [
      {
        type: ChannelType.WEB_FORM,
        name: "Website Form",
        slug: "website-form",
        config: { welcomeMessage: "How can we help you today?" },
      },
      {
        type: ChannelType.INTEGRATED_APP,
        name: "In-App Support",
        slug: "inapp-support",
        apiKey: generateApiKey(),
        config: { widgetPosition: "bottom-right" },
      },
      {
        type: ChannelType.PUBLIC_LINK,
        name: "Public Support Link",
        slug: "public-support",
        config: { welcomeMessage: "Submit a support ticket" },
      },
    ],
    ticketCount: 8,
  },
  {
    name: "Sales",
    slug: "sales",
    description: "Sales inquiries and product information",
    channels: [
      {
        type: ChannelType.WEB_FORM,
        name: "Contact Sales",
        slug: "contact-sales",
        config: { welcomeMessage: "Interested in our services? Let us know!" },
      },
      {
        type: ChannelType.WIDGET,
        name: "Sales Widget",
        slug: "sales-widget",
        apiKey: generateApiKey(),
        config: { color: "#10b981" },
      },
    ],
    ticketCount: 5,
  },
  {
    name: "Billing",
    slug: "billing",
    description: "Billing, invoices, and payment support",
    channels: [
      {
        type: ChannelType.WEB_FORM,
        name: "Billing Inquiry",
        slug: "billing-inquiry",
        config: {
          welcomeMessage: "Have a billing question? We're here to help.",
        },
      },
      {
        type: ChannelType.PUBLIC_LINK,
        name: "Billing Portal",
        slug: "billing-portal",
        config: { welcomeMessage: "Submit billing inquiries" },
      },
    ],
    ticketCount: 6,
  },
  {
    name: "Technical",
    slug: "technical",
    description: "Technical support and API assistance",
    channels: [
      {
        type: ChannelType.WEB_FORM,
        name: "Tech Support",
        slug: "tech-support",
        config: { welcomeMessage: "Need technical help? Our team is here." },
      },
      {
        type: ChannelType.INTEGRATED_APP,
        name: "Developer Portal",
        slug: "dev-portal",
        apiKey: generateApiKey(),
        config: { documentationUrl: "https://docs.example.com" },
      },
    ],
    ticketCount: 7,
  },
  {
    name: "Bluem",
    slug: "bluem",
    description: "Bluem platform services and support",
    channels: [
      {
        type: ChannelType.WEB_FORM,
        name: "Bluem Support Form",
        slug: "bluem-support",
        config: {
          welcomeMessage: "Welcome to Bluem Support! How can we help you?",
        },
      },
      {
        type: ChannelType.INTEGRATED_APP,
        name: "Bluem In-App",
        slug: "bluem-inapp",
        apiKey: generateApiKey(),
        config: { widgetPosition: "bottom-left", theme: "bluem" },
      },
    ],
    ticketCount: 5,
  },
]

/**
 * Create channels for an app
 */
async function createChannels(
  appId: string,
  channels: (typeof appsConfig)[0]["channels"]
) {
  const createdChannels = []

  for (const channelConfig of channels) {
    const existing = await prisma.channel.findFirst({
      where: {
        appId,
        slug: channelConfig.slug,
      },
    })

    if (existing) {
      console.log(`   ℹ️  Channel already exists: ${channelConfig.name}`)
      createdChannels.push(existing)
    } else {
      const created = await prisma.channel.create({
        data: {
          appId,
          type: channelConfig.type,
          name: channelConfig.name,
          slug: channelConfig.slug,
          apiKey: channelConfig.apiKey,
          config: channelConfig.config,
          isActive: true,
        },
      })
      console.log(
        `   ✅ Created channel: ${channelConfig.name} (${channelConfig.type})`
      )
      if (created.apiKey) {
        console.log(`      🔑 API Key: ${created.apiKey}`)
      }
      createdChannels.push(created)
    }
  }

  return createdChannels
}

/**
 * Create sample tickets for an app
 */
async function createTickets(
  appId: string,
  appSlug: string,
  channels: any[],
  count: number
) {
  const existingTickets = await prisma.ticket.count({
    where: { appId },
  })

  const ticketsToCreate = Math.max(0, count - existingTickets)

  if (ticketsToCreate === 0) {
    console.log(`   ℹ️  Tickets already exist for ${appSlug}`)
    return
  }

  const statuses: TicketStatus[] = [
    TicketStatus.OPEN,
    TicketStatus.IN_PROGRESS,
    TicketStatus.RESOLVED,
    TicketStatus.CLOSED,
  ]

  // Get admin user for assignments
  const adminUser = await prisma.user.findFirst({
    where: { email: "admin@example.com" },
  })

  for (let i = 0; i < ticketsToCreate; i++) {
    const template = ticketTemplates[i % ticketTemplates.length]
    const channel = channels[i % channels.length]
    const guestIndex = i % guestNames.length
    const status = statuses[i % statuses.length]
    const ticketNumber = generateTicketNumber(appSlug, existingTickets + i)

    const ticket = await prisma.ticket.create({
      data: {
        ticketNumber,
        appId,
        channelId: channel.id,
        subject: template.subject,
        description: template.description,
        priority: template.priority,
        status,
        guestName: guestNames[guestIndex],
        guestEmail: guestEmails[guestIndex],
        assignedTo: adminUser?.id,
        assignedAt: status !== TicketStatus.OPEN ? new Date() : null,
        resolvedAt:
          status === TicketStatus.RESOLVED || status === TicketStatus.CLOSED
            ? new Date()
            : null,
        closedAt: status === TicketStatus.CLOSED ? new Date() : null,
        createdAt: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
        ), // Random date within last 30 days
      },
    })

    // Add initial message from guest
    await prisma.ticketMessage.create({
      data: {
        ticketId: ticket.id,
        sender: SenderType.CUSTOMER,
        message: template.description,
        isInternal: false,
      },
    })

    // Add response from agent for non-open tickets
    if (status !== TicketStatus.OPEN && adminUser) {
      await prisma.ticketMessage.create({
        data: {
          ticketId: ticket.id,
          sender: SenderType.AGENT,
          userId: adminUser.id,
          message: getRandomAgentResponse(status),
          isInternal: false,
        },
      })
    }

    console.log(`   ✅ Created ticket: ${ticketNumber} - ${template.subject}`)
  }
}

/**
 * Get random agent response based on ticket status
 */
function getRandomAgentResponse(status: TicketStatus): string {
  const responses: Record<TicketStatus, string[]> = {
    [TicketStatus.OPEN]: [],
    [TicketStatus.IN_PROGRESS]: [
      "Thank you for reaching out. I'm looking into this issue now.",
      "I've received your ticket and I'm working on a solution.",
      "Thanks for your patience. I'm investigating this matter.",
    ],
    [TicketStatus.RESOLVED]: [
      "I've resolved this issue. Please let me know if you need anything else.",
      "This should now be fixed. Please verify and let us know.",
      "I've addressed your concern. Feel free to reach out if you have more questions.",
    ],
    [TicketStatus.CLOSED]: [
      "This ticket has been resolved and closed. Don't hesitate to contact us if you need further assistance.",
      "Issue resolved and ticket closed. Thank you for your patience!",
      "Closed after resolution. Please open a new ticket if you have more questions.",
    ],
  }

  const statusResponses = responses[status]
  return statusResponses[Math.floor(Math.random() * statusResponses.length)]
}

/**
 * Main seeding function
 */
async function seedAppsAndTickets() {
  console.log("🌱 Seeding apps and tickets...\n")

  for (const appConfig of appsConfig) {
    console.log(`\n📦 Processing app: ${appConfig.name}`)

    // Create or update app
    const app = await prisma.app.upsert({
      where: { slug: appConfig.slug },
      update: {},
      create: {
        name: appConfig.name,
        slug: appConfig.slug,
        description: appConfig.description,
        isActive: true,
      },
    })

    console.log(`✅ App: ${app.slug} (${app.name})`)

    // Create channels
    const channels = await createChannels(app.id, appConfig.channels)
    console.log(`   Total channels: ${channels.length}`)

    // Create tickets
    console.log(`\n   🎫 Creating tickets...`)
    await createTickets(app.id, appConfig.slug, channels, appConfig.ticketCount)
  }

  // Print summary
  const totalApps = await prisma.app.count()
  const totalChannels = await prisma.channel.count()
  const totalTickets = await prisma.ticket.count()

  console.log("\n" + "=".repeat(50))
  console.log("📊 Seeding Summary:")
  console.log(`   • Total Apps: ${totalApps}`)
  console.log(`   • Total Channels: ${totalChannels}`)
  console.log(`   • Total Tickets: ${totalTickets}`)
  console.log("=".repeat(50))
  console.log("\n🎉 Apps and tickets seeding completed!\n")
}

export { seedAppsAndTickets }

// Only run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedAppsAndTickets()
    .catch((e) => {
      console.error("❌ Error seeding apps and tickets:", e)
      process.exit(1)
    })
    .finally(() => prisma.$disconnect())
}
