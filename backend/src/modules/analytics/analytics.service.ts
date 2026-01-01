import { prisma } from "../../config/prisma.js";

export async function trackEvent(
  appId: string,
  userId: string | null,
  eventType: string,
  metadata?: any
) {
  return prisma.analyticsEvent.create({
    data: {
      appId,
      userId,
      eventType,
      metadata,
    },
  });
}
