import { Router } from "express";
import { auth } from "../../middlewares/auth.middleware.js";
import {
  enrollUser,
  getMyEnrollments,
} from "./access.service.js";

const router = Router();

/**
 * POST /enrollments
 */
router.post("/", auth, async (req, res) => {
  const userId = (req as any).user.id;
  const { appId, courseId } = req.body;

  if (!appId || !courseId) {
    return res.status(400).json({ message: "appId & courseId required" });
  }

  const enrollment = await enrollUser(userId, appId, courseId);
  res.status(201).json({ success: true, data: enrollment });
});

/**
 * GET /enrollments/my
 */
router.get("/my", auth, async (req, res) => {
  const userId = (req as any).user.id;
  const enrollments = await getMyEnrollments(userId);
  res.json({ success: true, data: enrollments });
});

export default router;
