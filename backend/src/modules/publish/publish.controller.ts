// src/modules/publish/publish.controller.ts
import { Router } from "express";
import { auth } from "../../middlewares/auth.middleware.js";
import { requireCreator } from "../../middlewares/role.middleware.js";
import {
  publishApp,
  getLiveApp,
  getVersionHistory,
  rollbackToVersion,
  getDeploymentStatus,
} from "./publish.service.js";

const router = Router();

/**
 * GET /api/publish/:appId/live
 * ✅ PUBLIC - Flutter app fetches published manifest
 * Returns direct JSON (not wrapped in success/data)
 */
router.get("/:appId/live", async (req, res) => {
  try {
    const { appId } = req.params;
    const version = await getLiveApp(appId);

    if (!version) {
      return res.status(404).json({
        error: "No published version found for this app",
      });
    }

    // ✅ Return schema directly for Flutter
    res.json(version.schema);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/publish/:appId
 * Publish draft to live
 */
router.post("/:appId", auth, requireCreator, async (req, res) => {
  try {
    const creatorId = (req as any).user.id;
    const { appId } = req.params;

    const version = await publishApp(appId, creatorId);

    res.json({
      success: true,
      message: "App published successfully",
      data: {
        version: version.version,
        publishedAt: version.createdAt,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/publish/:appId/status
 */
router.get("/:appId/status", auth, requireCreator, async (req, res) => {
  try {
    const status = await getDeploymentStatus(req.params.appId);
    res.json({ success: true, data: status });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/publish/:appId/history
 */
router.get("/:appId/history", auth, requireCreator, async (req, res) => {
  try {
    const history = await getVersionHistory(req.params.appId);
    res.json({ success: true, data: history });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/publish/:appId/rollback/:versionId
 */
router.post(
  "/:appId/rollback/:versionId",
  auth,
  requireCreator,
  async (req, res) => {
    try {
      const creatorId = (req as any).user.id;
      const { appId, versionId } = req.params;

      const version = await rollbackToVersion(appId, versionId, creatorId);

      res.json({
        success: true,
        message: "Rollback successful",
        data: version,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

export default router;