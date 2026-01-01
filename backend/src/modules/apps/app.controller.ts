import { Router } from "express";
import { auth } from "../../middlewares/auth.middleware.js";
import { requireCreator } from "../../middlewares/role.middleware.js";
import {
  createApp,
  getMyApps,
  updateApp,
  deleteApp,
  saveDraftSchema,
  getDraftSchema,
} from "./app.service.js";
import {
  CreateAppSchema,
  UpdateAppSchema,
} from "./app.schema.js";

const router = Router();

router.post("/", auth, requireCreator, async (req, res) => {
  CreateAppSchema.parse(req.body);

  const creatorId = (req as any).user.id;
  const app = await createApp(creatorId, req.body);

  res.status(201).json({ success: true, data: app });
});


router.get("/", auth, requireCreator, async (req, res) => {
  const creatorId = (req as any).user.id;
  const apps = await getMyApps(creatorId);

  res.json({ success: true, data: apps });
});


router.put("/:id", auth, requireCreator, async (req, res) => {
  UpdateAppSchema.parse(req.body);

  const creatorId = (req as any).user.id;
  const appId = req.params.id;
  await updateApp(appId, creatorId, req.body);
  res.json({ success: true });
});


router.delete("/:id", auth, requireCreator, async (req, res) => {
  const creatorId = (req as any).user.id;
  const appId = req.params.id;

  await deleteApp(appId, creatorId);
  res.json({ success: true });
});


  // PUT /apps/:id/draft

router.put("/:id/draft", auth, requireCreator, async (req, res) => {
  const creatorId = (req as any).user.id;
  const appId = req.params.id;
  const { schema } = req.body;

  await saveDraftSchema(appId, creatorId, schema);
  res.json({ success: true });
});


//  * GET /apps/:id/draft
 
router.get("/:id/draft", auth, requireCreator, async (req, res) => {
  const creatorId = (req as any).user.id;
  const appId = req.params.id;

  const data = await getDraftSchema(appId, creatorId);
  res.json({ success: true, data: data?.draftSchema });
});

export default router;
