import { Router } from "express";
import { auth } from "../../middlewares/auth.middleware.js";
import { hasAccess, getMyAccessList } from "./access.service.js";

const router = Router();

/**
 * GET /api/access/check/:entityId
 * Checks if the logged-in student has access to a specific item
 */
router.get("/check/:entityId", auth, async (req, res) => {
  const userId = (req as any).user.id;
  const { entityId } = req.params;

  const allowed = await hasAccess(userId, entityId);
  res.json({ success: true, data: { allowed } });
});

/**
 * GET /api/access/my
 * Returns everything the user has "unlocked" or "bought"
 */
router.get("/my", auth, async (req, res) => {
  const userId = (req as any).user.id;
  const list = await getMyAccessList(userId);
  res.json({ success: true, data: list });
});

export default router;