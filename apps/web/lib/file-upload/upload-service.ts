import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3"
import type { FileCategory } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { ensureBucketExists, generateKey, s3Client } from "@/lib/storage/s3"

export interface UploadFileInput {
  file: File
  filename: string
  category: FileCategory
  userId: string
  isPublic?: boolean
  expiresAt?: Date | null
}

type FileRecord = Awaited<ReturnType<typeof prisma.file.create>>

function toServeUrl(fileId: string, isPublic: boolean) {
  return isPublic
    ? `/api/public/files/${fileId}/serve`
    : `/api/files/${fileId}/serve`
}

function withServeUrl(file: FileRecord) {
  return {
    ...file,
    serveUrl: toServeUrl(file.id, file.isPublic),
  }
}

async function resolveUserId(userId: string) {
  const user =
    (await prisma.user.findUnique({ where: { id: userId } })) ??
    (await prisma.user.findUnique({ where: { email: userId } })) ??
    (await prisma.user.findFirst({ orderBy: { createdAt: "asc" } }))

  if (!user) {
    throw new Error("No upload owner available")
  }

  return user.id
}

export async function uploadFile(input: UploadFileInput) {
  const bucketName = process.env.S3_BUCKET || "pisky-uploads"
  await ensureBucketExists(bucketName)

  const ownerId = await resolveUserId(input.userId)
  const storagePath = generateKey(ownerId, input.category, input.filename)
  const body = Buffer.from(await input.file.arrayBuffer())

  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: storagePath,
      Body: body,
      ContentType: input.file.type || "application/octet-stream",
    })
  )

  const file = await prisma.file.create({
    data: {
      originalFilename: input.filename,
      storedFilename: storagePath.split("/").pop() || input.filename,
      mimeType: input.file.type || "application/octet-stream",
      size: input.file.size,
      category: input.category,
      bucketName,
      storagePath,
      uploadedById: ownerId,
      isPublic: input.isPublic ?? false,
      cdnUrl: input.isPublic
        ? `${process.env.CDN_URL || ""}/${storagePath}`
        : null,
      expiresAt: input.expiresAt ?? undefined,
    },
  })

  return withServeUrl(file)
}

export async function deleteFile(
  fileId: string,
  userId: string,
  allowAny = false
) {
  const file = await prisma.file.findFirst({
    where: {
      id: fileId,
      deletedAt: null,
    },
  })

  if (!file) {
    throw new Error("File not found or access denied")
  }

  if (!allowAny && file.uploadedById !== userId) {
    throw new Error("You don't have permission to delete this file")
  }

  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: file.bucketName,
      Key: file.storagePath,
    })
  )

  await prisma.file.update({
    where: { id: fileId },
    data: { deletedAt: new Date() },
  })
}
