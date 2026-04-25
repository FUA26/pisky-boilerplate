import { prisma } from "@/lib/prisma"
import type { FileCategory } from "@prisma/client"

function toServeUrl(fileId: string, isPublic: boolean) {
  return isPublic
    ? `/api/public/files/${fileId}/serve`
    : `/api/files/${fileId}/serve`
}

function withServeUrl<T extends { id: string; isPublic: boolean }>(file: T) {
  return {
    ...file,
    serveUrl: toServeUrl(file.id, file.isPublic),
  }
}

export async function getFileById(fileId: string, userId?: string) {
  const file = await prisma.file.findFirst({
    where: {
      id: fileId,
      deletedAt: null,
      ...(userId
        ? {
            OR: [{ uploadedById: userId }, { isPublic: true }],
          }
        : {}),
    },
  })

  return file ? withServeUrl(file) : null
}

export async function getFilesByUser({
  userId,
  category,
  page = 1,
  limit = 20,
}: {
  userId: string
  category?: FileCategory
  page?: number
  limit?: number
}) {
  const where = {
    uploadedById: userId,
    deletedAt: null,
    ...(category ? { category } : {}),
  }

  const [files, total] = await Promise.all([
    prisma.file.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.file.count({ where }),
  ])

  const mapped = files.map((file) => withServeUrl(file))

  return {
    files: mapped,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}
