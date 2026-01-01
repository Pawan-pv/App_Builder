// src/routes.ts
import { Router } from "express";
import authRoutes from "./modules/auth/auth.controller.js";
import appRoutes from "./modules/apps/app.controller.js";
import entityRoutes from "./modules/entity/entity.controller.js";
import accessRoutes from "./modules/access/access.controller.js";
import progressRoutes from "./modules/progress/progress.controller.js";
import paymentRoutes from "./modules/payments/payment.controller.js";
import publishRoutes from "./modules/publish/publish.controller.js";
import adminRoutes from "./modules/admin/admin.controller.js";
import analyticsRoutes from "./modules/analytics/analytics.controller.js";

const router = Router();

// ═══════════════════════════════════════════════════════
// PUBLIC ROUTES (No Auth Required)
// ═══════════════════════════════════════════════════════

router.use("/auth", authRoutes);

// Universal Entity System (Public read access for Flutter)
router.use("/entities", entityRoutes);

// Published App Manifest (Flutter fetches this)
router.use("/publish", publishRoutes);

// ═══════════════════════════════════════════════════════
// CREATOR ROUTES (Auth Required)
// ═══════════════════════════════════════════════════════

router.use("/apps", appRoutes);

// ═══════════════════════════════════════════════════════
// END USER ROUTES (Auth Required)
// ═══════════════════════════════════════════════════════

router.use("/access", accessRoutes);
router.use("/progress", progressRoutes);
router.use("/payments", paymentRoutes);

// ═══════════════════════════════════════════════════════
// ADMIN ROUTES (Auth + Admin Role Required)
// ═══════════════════════════════════════════════════════

router.use("/admin", adminRoutes);
router.use("/analytics", analyticsRoutes);

// ═══════════════════════════════════════════════════════
// HEALTH CHECK
// ═══════════════════════════════════════════════════════

router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "Universal App Builder API",
  });
});

export default router;