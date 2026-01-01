import { Router } from "express";
import { auth } from "../../middlewares/auth.middleware.js";
import { requireAdmin } from "../../middlewares/admin.middleware.js";
import {
  getPlatformMetrics,
  getRevenueByApp,
  getDropOffs,
  setAppStatus,
  disableCreator,
  getPayments,
} from "./admin.service.js";

const router = Router();

/**
 * GET /admin/metrics
 */
router.get("/metrics", auth, requireAdmin, async (_req, res) => {
  const metrics = await getPlatformMetrics();
  res.json({ success: true, data: metrics });
});

/**
 * GET /admin/revenue/apps
 */
router.get("/revenue/apps", auth, requireAdmin, async (_req, res) => {
  const data = await getRevenueByApp();
  res.json({ success: true, data });
});

/**
 * GET /admin/dropoffs
 */
router.get("/dropoffs", auth, requireAdmin, async (_req, res) => {
  const data = await getDropOffs();
  res.json({ success: true, data });
});

/**
 * PUT /admin/apps/:id/status
 */
router.put("/apps/:id/status", auth, requireAdmin, async (req, res) => {
  const { status } = req.body;
  await setAppStatus(req.params.id, status);
  res.json({ success: true });
});

/**
 * PUT /admin/creators/:id/disable
 */
router.put("/creators/:id/disable", auth, requireAdmin, async (req, res) => {
  await disableCreator(req.params.id);
  res.json({ success: true });
});

/**
 * GET /admin/payments
 */
router.get("/payments", auth, requireAdmin, async (_req, res) => {
  const payments = await getPayments();
  res.json({ success: true, data: payments });
});

export default router;
