import { randomUUID } from "node:crypto"
import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"

type AppListOptions = {
  page?: number
  pageSize?: number
  search?: string
  isActive?: boolean
}

type CreateAppInput = {
  name: string
  slug: string
  description?: string | null
  isActive?: boolean
}

type UpdateAppInput = Partial<CreateAppInput>

type CreateChannelInput = {
  appId: string
  type:
    | "WEB_FORM"
    | "PUBLIC_LINK"
    | "WIDGET"
    | "INTEGRATED_APP"
    | "WHATSAPP"
    | "TELEGRAM"
  name: string
  slug?: string | null
  apiKey?: string | null
  config?: Record<string, unknown>
  isActive?: boolean
}

type UpdateChannelInput = Partial<Omit<CreateChannelInput, "appId" | "type">>

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function uniqueApiKey() {
  return `tk_${randomUUID().replace(/-/g, "")}`
}

export async function generateAppSlug(name: string) {
  const base = slugify(name)
  let slug = base
  let index = 1

  while (await prisma.app.findUnique({ where: { slug } })) {
    slug = `${base}-${index++}`
  }

  return slug
}

export async function listApps(options: AppListOptions = {}) {
  const page = options.page ?? 1
  const pageSize = options.pageSize ?? 10
  const where: Prisma.AppWhereInput = {}

  if (options.search) {
    where.OR = [
      { name: { contains: options.search, mode: "insensitive" } },
      { slug: { contains: options.search, mode: "insensitive" } },
    ]
  }

  if (typeof options.isActive === "boolean") {
    where.isActive = options.isActive
  }

  const [apps, total] = await Promise.all([
    prisma.app.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: {
        channels: true,
        _count: {
          select: { tickets: true },
        },
      },
    }),
    prisma.app.count({ where }),
  ])

  return {
    apps,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  }
}

export async function createApp(data: CreateAppInput, _userId: string) {
  return prisma.app.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description ?? null,
      isActive: data.isActive ?? true,
    },
    include: {
      channels: true,
      _count: {
        select: { tickets: true },
      },
    },
  })
}

export async function getApp(id: string) {
  return prisma.app.findUnique({
    where: { id },
    include: {
      channels: true,
      _count: {
        select: { tickets: true },
      },
    },
  })
}

export async function getAppBySlug(slug: string) {
  return prisma.app.findUnique({
    where: { slug },
    include: {
      channels: true,
      _count: {
        select: { tickets: true },
      },
    },
  })
}

export async function updateApp(
  id: string,
  data: UpdateAppInput,
  _userId: string
) {
  return prisma.app.update({
    where: { id },
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description ?? undefined,
      isActive: data.isActive,
    },
    include: {
      channels: true,
      _count: {
        select: { tickets: true },
      },
    },
  })
}

export async function deleteApp(id: string, _userId: string) {
  return prisma.app.delete({
    where: { id },
  })
}

export async function getAppChannels(appId: string) {
  return prisma.channel.findMany({
    where: { appId },
    orderBy: { createdAt: "asc" },
  })
}

export async function createChannel(data: CreateChannelInput, _userId: string) {
  return prisma.channel.create({
    data: {
      appId: data.appId,
      type: data.type,
      name: data.name,
      slug: data.slug || undefined,
      apiKey:
        data.apiKey || (data.type === "INTEGRATED_APP" ? uniqueApiKey() : null),
      config: (data.config ?? {}) as Prisma.InputJsonValue,
      isActive: data.isActive ?? true,
    },
  })
}

export async function getChannel(id: string) {
  return prisma.channel.findUnique({
    where: { id },
    include: { app: true },
  })
}

export async function updateChannel(
  id: string,
  data: UpdateChannelInput,
  _userId: string
) {
  return prisma.channel.update({
    where: { id },
    data: {
      name: data.name,
      slug: data.slug,
      apiKey: data.apiKey,
      config: data.config ? (data.config as Prisma.InputJsonValue) : undefined,
      isActive: data.isActive,
    },
    include: { app: true },
  })
}

export async function deleteChannel(id: string, _userId: string) {
  return prisma.channel.delete({
    where: { id },
  })
}
