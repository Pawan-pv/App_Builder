// src/modules/entity/entity.service.ts
import { prisma } from "../../config/prisma.js";
import { Prisma } from "@prisma/client";

/* ═══════════════════════════════════════════════════════
   UNIVERSAL ENTITY SERVICE
   Works for ANY collection type: products, posts, users, etc.
═══════════════════════════════════════════════════════ */

export async function createEntity(
  appId: string,
  ownerId: string,
  collectionName: string,
  data: any
) {
  // Validate data
  if (!data || typeof data !== 'object') {
    throw new Error('Entity data must be a valid object');
  }

  // Get max order index for this collection
  const maxOrder = await prisma.entity.aggregate({
    where: { appId, collectionName, deletedAt: null },
    _max: { orderIndex: true }
  });

  return prisma.entity.create({
    data: {
      appId,
      ownerId,
      collectionName,
      data: data as Prisma.InputJsonValue,
      orderIndex: (maxOrder._max.orderIndex ?? -1) + 1,
    },
  });
}

export async function getEntities(
  appId: string,
  collectionName: string,
  options: {
    limit?: number;
    offset?: number;
    orderBy?: 'asc' | 'desc';
  } = {}
) {
  const { limit, offset, orderBy = 'asc' } = options;

  return prisma.entity.findMany({
    where: {
      appId,
      collectionName,
      deletedAt: null,
    },
    orderBy: { orderIndex: orderBy },
    take: limit,
    skip: offset,
  });
}

export async function getEntityById(entityId: string) {
  return prisma.entity.findUnique({
    where: { id: entityId },
  });
}

export async function updateEntity(
  entityId: string,
  updates: { data?: any; orderIndex?: number }
) {
  const updateData: any = {};

  if (updates.data) {
    updateData.data = updates.data as Prisma.InputJsonValue;
  }

  if (updates.orderIndex !== undefined) {
    updateData.orderIndex = updates.orderIndex;
  }

  return prisma.entity.update({
    where: { id: entityId },
    data: updateData,
  });
}

export async function deleteEntity(entityId: string) {
  return prisma.entity.update({
    where: { id: entityId },
    data: { deletedAt: new Date() },
  });
}

export async function hardDeleteEntity(entityId: string) {
  return prisma.entity.delete({
    where: { id: entityId },
  });
}

export async function searchEntities(
  appId: string,
  searchTerm: string,
  collectionName?: string
) {
  const where: any = {
    appId,
    deletedAt: null,
  };

  if (collectionName) {
    where.collectionName = collectionName;
  }

  if (searchTerm) {
    where.data = {
      path: [],
      string_contains: searchTerm,
    };
  }

  return prisma.entity.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
}

export async function reorderEntities(
  appId: string,
  collectionName: string,
  entityIds: string[]
) {
  const updates = entityIds.map((id, index) =>
    prisma.entity.update({
      where: { id },
      data: { orderIndex: index },
    })
  );

  return prisma.$transaction(updates);
}

export async function getCollectionStats(appId: string, collectionName: string) {
  const [total, active] = await Promise.all([
    prisma.entity.count({
      where: { appId, collectionName },
    }),
    prisma.entity.count({
      where: { appId, collectionName, deletedAt: null },
    }),
  ]);

  return { total, active, deleted: total - active };
}

export async function bulkCreateEntities(
  appId: string,
  ownerId: string,
  collectionName: string,
  dataArray: any[]
) {
  const entities = dataArray.map((data, index) => ({
    appId,
    ownerId,
    collectionName,
    data: data as Prisma.InputJsonValue,
    orderIndex: index,
  }));

  return prisma.entity.createMany({
    data: entities,
  });
}