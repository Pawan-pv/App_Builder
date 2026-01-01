// src/modules/apps/app.service.ts
import { prisma } from "../../config/prisma.js";

export async function createApp(
  creatorId: string,
  data: { name: string; themeJson: any }
) {
  return prisma.app.create({
    data: {
      name: data.name,
      themeJson: data.themeJson || {},
      creatorId,
    },
  });
}

export async function getMyApps(creatorId: string) {
  return prisma.app.findMany({
    where: {
      creatorId,
      deletedAt: null,
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          entities: true,
          versions: true,
        },
      },
    },
  });
}

export async function getAppById(appId: string, creatorId: string) {
  return prisma.app.findFirst({
    where: {
      id: appId,
      creatorId,
      deletedAt: null,
    },
    include: {
      entities: {
        where: { deletedAt: null },
        select: {
          id: true,
          collectionName: true,
          orderIndex: true,
        },
      },
    },
  });
}

export async function updateApp(
  appId: string,
  creatorId: string,
  data: any
) {
  // ✅ Verify ownership first
  const app = await prisma.app.findFirst({
    where: {
      id: appId,
      creatorId,
      deletedAt: null,
    },
  });

  if (!app) {
    throw new Error("App not found or unauthorized");
  }

  // ✅ Update with simple where clause
  return prisma.app.update({
    where: { id: appId },
    data,
  });
}

export async function deleteApp(appId: string, creatorId: string) {
  const app = await prisma.app.findFirst({
    where: {
      id: appId,
      creatorId,
      deletedAt: null,
    },
  });

  if (!app) {
    throw new Error("App not found or unauthorized");
  }

  return prisma.app.update({
    where: { id: appId },
    data: {
      deletedAt: new Date(),
    },
  });
}

/* ════════════════════════════════════════════════════
   DRAFT SCHEMA (Fixed)
════════════════════════════════════════════════════ */

export async function saveDraftSchema(
  appId: string,
  creatorId: string,
  schema: any
) {
  // ✅ Validate ownership
  const app = await prisma.app.findFirst({
    where: {
      id: appId,
      creatorId,
      deletedAt: null,
    },
  });

  if (!app) {
    throw new Error("App not found or unauthorized");
  }

  // ✅ Validate schema structure
  if (!schema?.screens || !Array.isArray(schema.screens)) {
    throw new Error("Invalid schema: missing screens array");
  }

  // ✅ Update
  return prisma.app.update({
    where: { id: appId },
    data: {
      draftSchema: schema,
    },
  });
}

export async function getDraftSchema(appId: string, creatorId: string) {
  const app = await prisma.app.findFirst({
    where: {
      id: appId,
      creatorId,
      deletedAt: null,
    },
    select: {
      draftSchema: true,
    },
  });

  if (!app) {
    throw new Error("App not found or unauthorized");
  }

  return app;
}