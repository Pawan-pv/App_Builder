import { Router } from "express";
import { auth } from "../../middlewares/auth.middleware.js";
import { createPayment } from "./payment.service.js";

const router = Router();

/**
 * POST /api/payments/pay
 * In a real app, this would integrate with Stripe/PayPal.
 */
router.post("/pay", auth, async (req, res) => {
  const userId = (req as any).user.id;
  const { appId, entityId, amount } = req.body;

  if (!appId || !entityId || !amount) {
    return res.status(400).json({ message: "appId, entityId, and amount are required" });
  }

  const payment = await createPayment(userId, appId, entityId, amount);

  res.json({
    success: true,
    message: "Payment processed and access granted",
    data: payment,
  });
});

export default router;