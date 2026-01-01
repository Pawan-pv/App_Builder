// src/modules/entity/entity.controller.ts
import { Router } from "express";
import { auth } from "../../middlewares/auth.middleware.js";
import { requireCreator } from "../../middlewares/role.middleware.js";
import {
  createEntity,
  getEntities,
  getEntityById,
  updateEntity,
  deleteEntity,
  searchEntities,
  reorderEntities,
  getCollectionStats,
  bulkCreateEntities,
} from "./entity.service.js";

const router = Router();

/* ═══════════════════════════════════════════════════════
   PUBLIC ENDPOINTS (for Flutter app)
═══════════════════════════════════════════════════════ */

/**
 * GET /api/entities/:appId/:collectionName
 * Fetch all items in a collection
 * 
 * Example: GET /api/entities/my-app/products?limit=20&offset=0
 */
router.get("/:appId/:collectionName", async (req, res) => {
  try {
    const { appId, collectionName } = req.params;
    const { limit, offset, orderBy } = req.query;

    const entities = await getEntities(appId, collectionName, {
      limit: limit ? parseInt(limit as string) : undefined,
      offset: offset ? parseInt(offset as string) : undefined,
      orderBy: orderBy as 'asc' | 'desc',
    });

    // ✅ Flatten data fields to top level
    const formattedEntities = entities.map((entity) => ({
      id: entity.id,
      collectionName: entity.collectionName,
      ...(entity.data as object),
      _metadata: {
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
        orderIndex: entity.orderIndex,
      },
    }));

    res.json({
      success: true,
      data: formattedEntities,
      meta: {
        total: formattedEntities.length,
        collection: collectionName,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/entities/:appId/:collectionName/:entityId
 * Fetch single entity by ID
 */
router.get("/:appId/:collectionName/:entityId", async (req, res) => {
  try {
    const { entityId } = req.params;

    const entity = await getEntityById(entityId);

    if (!entity) {
      return res.status(404).json({
        success: false,
        error: "Entity not found",
      });
    }

    res.json({
      success: true,
      data: {
        id: entity.id,
        collectionName: entity.collectionName,
        ...(entity.data as object),
        _metadata: {
          createdAt: entity.createdAt,
          updatedAt: entity.updatedAt,
          orderIndex: entity.orderIndex,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/entities/:appId/search
 * Universal search across collections
 * 
 * Query params:
 * - q: search term
 * - collection: filter by collection name (optional)
 */
router.get("/:appId/search", async (req, res) => {
  try {
    const { appId } = req.params;
    const { q, collection } = req.query;

    const results = await searchEntities(
      appId,
      q as string,
      collection as string | undefined
    );

    const formattedResults = results.map((entity) => ({
      id: entity.id,
      collectionName: entity.collectionName,
      ...(entity.data as object),
    }));

    res.json({
      success: true,
      data: formattedResults,
      meta: {
        total: formattedResults.length,
        query: q,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/* ═══════════════════════════════════════════════════════
   CREATOR ENDPOINTS (requires auth)
═══════════════════════════════════════════════════════ */

/**
 * POST /api/entities/:appId/:collectionName
 * Create new entity
 */
router.post("/:appId/:collectionName", auth, requireCreator, async (req, res) => {
  try {
    const creatorId = (req as any).user.id;
    const { appId, collectionName } = req.params;

    const entity = await createEntity(appId, creatorId, collectionName, req.body);

    res.status(201).json({
      success: true,
      data: {
        id: entity.id,
        collectionName: entity.collectionName,
        ...(entity.data as object),
      },
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/entities/:appId/:collectionName/bulk
 * Bulk create entities
 */
router.post("/:appId/:collectionName/bulk", auth, requireCreator, async (req, res) => {
  try {
    const creatorId = (req as any).user.id;
    const { appId, collectionName } = req.params;
    const { items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        error: "items must be an array",
      });
    }

    const result = await bulkCreateEntities(
      appId,
      creatorId,
      collectionName,
      items
    );

    res.status(201).json({
      success: true,
      data: {
        created: result.count,
      },
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/entities/:entityId
 * Update entity
 */
router.put("/:entityId", auth, requireCreator, async (req, res) => {
  try {
    const { entityId } = req.params;

    const entity = await updateEntity(entityId, {
      data: req.body,
    });

    res.json({
      success: true,
      data: {
        id: entity.id,
        ...(entity.data as object),
      },
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/entities/:entityId
 * Soft delete entity
 */
router.delete("/:entityId", auth, requireCreator, async (req, res) => {
  try {
    const { entityId } = req.params;

    await deleteEntity(entityId);

    res.json({
      success: true,
      message: "Entity deleted successfully",
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/entities/:appId/:collectionName/reorder
 * Reorder entities in a collection
 */
router.post("/:appId/:collectionName/reorder", auth, requireCreator, async (req, res) => {
  try {
    const { appId, collectionName } = req.params;
    const { entityIds } = req.body;

    if (!Array.isArray(entityIds)) {
      return res.status(400).json({
        success: false,
        error: "entityIds must be an array",
      });
    }

    await reorderEntities(appId, collectionName, entityIds);

    res.json({
      success: true,
      message: "Entities reordered successfully",
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/entities/:appId/:collectionName/stats
 * Get collection statistics
 */
router.get("/:appId/:collectionName/stats", auth, requireCreator, async (req, res) => {
  try {
    const { appId, collectionName } = req.params;

    const stats = await getCollectionStats(appId, collectionName);

    res.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;