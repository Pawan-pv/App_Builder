import { Router } from "express";
import { auth } from "../../middlewares/auth.middleware.js";
import { saveProgress, getEntityProgress } from "./progress.service.js";

const router = Router();

/**
 * POST /api/progress
 * Tracks how far a user has gone into a specific entity (Video, Article, Quiz)
 */
router.post("/", auth, async (req, res) => {
  const userId = (req as any).user.id;
  const { appId, entityId, progress, resumeTime } = req.body;

  const data = await saveProgress(
    userId,
    appId,
    entityId,
    progress, // Number 0-100
    resumeTime
  );

  res.json({ success: true, data });
});

/**
 * GET /api/progress/:entityId
 */
router.get("/:entityId", auth, async (req, res) => {
  const userId = (req as any).user.id;
  const { entityId } = req.params;

  const progress = await getEntityProgress(userId, entityId);
  res.json({ success: true, data: progress });
});

export default router;