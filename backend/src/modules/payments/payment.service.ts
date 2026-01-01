import { prisma } from "../../config/prisma.js";
import { grantAccess } from "../access/access.service.js";

export async function createPayment(
  userId: string,
  appId: string,
  entityId: string,
  amount: number
) {
  return await prisma.$transaction(async (tx) => {
    // 1. Record the payment
    const payment = await tx.payment.create({
      data: {
        userId,
        appId,
        entityId,
        amount,
        status: "PAID", // Simulation: In production, handle Stripe Webhooks
      },
    });

    // 2. Grant access to the entity automatically
    await grantAccess(userId, appId, entityId);

    return payment;
  });
} 