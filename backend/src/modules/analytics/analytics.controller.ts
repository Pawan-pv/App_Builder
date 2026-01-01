import { Router } from "express";
import { auth } from "../../middlewares/auth.middleware.js";
import { trackEvent } from "./analytics.service.js";

const router = Router();

/**
 * POST /analytics
 */
router.post("/", auth, async (req, res) => {
  const userId = (req as any).user.id;
  const { appId, eventType, metadata } = req.body;

  await trackEvent(appId, userId, eventType, metadata);

  res.json({ success: true });
});

export default router;
