import { prisma } from "@/lib/prisma"

type AppAccessRequestStatus = "PENDING" | "APPROVED" | "REJECTED"

export async function hasUserAppAccess(userId: string, appId: string) {
  const record = await prisma.userApp.findUnique({
    where: {
      userId_appId: { userId, appId },
    },
  })

  return Boolean(record)
}

export async function assignAppToUser(userId: string, appId: string) {
  return prisma.userApp.create({
    data: {
      userId,
      appId,
    },
  })
}

export async function removeAppFromUser(userId: string, appId: string) {
  return prisma.userApp.deleteMany({
    where: { userId, appId },
  })
}

export async function getUserAccessibleApps(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      role: {
        select: {
          name: true,
        },
      },
    },
  })

  const isAdmin = user?.role?.name === "ADMIN"

  if (isAdmin) {
    return prisma.app.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    })
  }

  const assignments = await prisma.userApp.findMany({
    where: { userId },
    include: {
      app: true,
    },
    orderBy: {
      app: { name: "asc" },
    },
  })

  return assignments.map((assignment) => assignment.app)
}

export async function getAppUsers(appId: string) {
  const assignments = await prisma.userApp.findMany({
    where: { appId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return assignments.map((assignment) => assignment.user)
}

export async function createAccessRequest(
  userId: string,
  appId: string,
  reason?: string | null
) {
  return prisma.appAccessRequest.create({
    data: {
      userId,
      appId,
      reason: reason ?? null,
      status: "PENDING",
    },
  })
}

export async function listAccessRequests(status?: AppAccessRequestStatus) {
  return prisma.appAccessRequest.findMany({
    where: status ? { status } : {},
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      app: true,
    },
    orderBy: { requestedAt: "desc" },
  })
}

export async function approveRequest(requestId: string, reviewedBy: string) {
  const request = await prisma.appAccessRequest.findUnique({
    where: { id: requestId },
  })

  if (!request) {
    throw new Error("Invalid request")
  }

  if (request.status !== "PENDING") {
    throw new Error("Invalid request")
  }

  await prisma.$transaction([
    prisma.appAccessRequest.update({
      where: { id: requestId },
      data: {
        status: "APPROVED",
        reviewedAt: new Date(),
        reviewedBy,
      },
    }),
    prisma.userApp.upsert({
      where: {
        userId_appId: {
          userId: request.userId,
          appId: request.appId,
        },
      },
      update: {},
      create: {
        userId: request.userId,
        appId: request.appId,
      },
    }),
  ])
}

export async function rejectRequest(
  requestId: string,
  reviewedBy: string,
  reason?: string | null
) {
  const request = await prisma.appAccessRequest.findUnique({
    where: { id: requestId },
  })

  if (!request) {
    throw new Error("Invalid request")
  }

  if (request.status !== "PENDING") {
    throw new Error("Invalid request")
  }

  await prisma.appAccessRequest.update({
    where: { id: requestId },
    data: {
      status: "REJECTED",
      reviewedAt: new Date(),
      reviewedBy,
      reason: reason ?? request.reason,
    },
  })
}
