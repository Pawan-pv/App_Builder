import { prisma } from "../../config/prisma.js";

export async function getPlatformMetrics() {
  const [
    users,
    creators,
    apps,
    revenue,
    totalEntities, // Replaces enrollment/lesson counts for general metrics
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "CREATOR" } }),
    prisma.app.count(),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: "PAID" },
    }),
    prisma.entity.count({ where: { deletedAt: null } }),
  ]);

  return {
    users,
    creators,
    apps,
    revenue: revenue._sum.amount ?? 0,
    totalItemsCreated: totalEntities,
  };
}

export async function getRevenueByApp() {
  return prisma.payment.groupBy({
    by: ["appId"],
    _sum: { amount: true },
    where: { status: "PAID" },
  });
}

export async function setAppStatus(appId: string, status: "LIVE" | "DRAFT") {
  return prisma.app.update({
    where: { id: appId },
    data: { status },
  });
}

export async function getPayments() {
  return prisma.payment.findMany({
    orderBy: { paidAt: "desc" },
    include: {
      user: true,
      app: true,
    },
  });
}