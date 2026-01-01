import { prisma } from "../../config/prisma.js";

export async function getManifest(appId: string, mode: 'draft' | 'live' = 'live') {
  const app = await prisma.app.findUnique({
    where: { id: appId },
    include: { theme: true }
  });

  if (!app) throw new Error("App not found");

  // If draft, get the latest working schema
  if (mode === 'draft') {
    return app.draftSchema; 
  }

  // If live, get the published version
  const version = await prisma.appVersion.findFirst({
    where: { appId, published: true },
    orderBy: { createdAt: 'desc' }
  });

  return version?.schema;
}