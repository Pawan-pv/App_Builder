import { prisma } from "../../config/prisma.js";

/**
 * Grants access to a user for a specific entity (Purchase, Enrollment, or Gift)
 */
export async function grantAccess(
  userId: string,
  appId: string,
  entityId: string
) {
  return prisma.access.upsert({
    where: {
      appId_userId_entityId: {
        appId,
        userId,
        entityId,
      },
    },
    update: { status: "ACTIVE" },
    create: {
      appId,
      userId,
      entityId,
      status: "ACTIVE",
    },
  });
}

/**
 * Checks if a user has the right to view/interact with an entity
 */
export async function hasAccess(userId: string, entityId: string): Promise<boolean> {
  const record = await prisma.access.findFirst({
    where: {
      userId,
      entityId,
      status: "ACTIVE",
    },
  });
  return !!record;
}

/**
 * Fetches all items a user has "unlocked" or "purchased"
 */
export async function getMyAccessList(userId: string) {
  return prisma.access.findMany({
    where: {
      userId,
      status: "ACTIVE",
    },
    include: {
      entity: true, // This brings in the JSON data from the Universal Entity
      app: {
        select: { name: true, id: true }
      }
    },
  });
}