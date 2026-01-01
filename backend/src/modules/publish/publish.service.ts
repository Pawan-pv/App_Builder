// src/modules/publish/publish.service.ts
import { prisma } from "../../config/prisma.js";

/* ═══════════════════════════════════════════════════════
   UNIVERSAL PUBLISH SERVICE
   Zero hardcoded business logic - works for ANY app type
═══════════════════════════════════════════════════════ */

export async function publishApp(appId: string, creatorId: string) {
  // 1. Fetch app with authorization check
  const app = await prisma.app.findUnique({
    where: { id: appId },
    include: {
      entities: {
        where: { deletedAt: null },
        orderBy: { orderIndex: "asc" },
      },
    },
  });

  if (!app || app.creatorId !== creatorId) {
    throw new Error("Unauthorized or app not found");
  }

  // 2. Get draft schema (already in Flutter format from frontend)
  const draftSchema = app.draftSchema as any;

  if (!draftSchema || !draftSchema.screens) {
    throw new Error(
      "No draft schema found. Please save your design in the builder first."
    );
  }

  // 3. Clone schema to avoid mutations
  const publishedSchema = JSON.parse(JSON.stringify(draftSchema));

  // 4. ✅ NO HARDCODED WIDGET INJECTION
  // The builder already has data-bound widgets like:
  // {
  //   type: "ListView",
  //   props: { dataSource: "products" },
  //   itemTemplate: { ... }
  // }
  // Flutter will fetch the data and render dynamically

  // 5. Create final manifest
  const finalManifest = {
    app: {
      id: app.id,
      name: app.name,
      theme: app.themeJson || {
        primaryColor: "#0D9488",
        backgroundColor: "#FFFFFF",
        fontFamily: "Inter",
      },
    },
    screens: publishedSchema.screens,
    collections: _getCollectionMetadata(app.entities),
    publishedAt: new Date().toISOString(),
    version: `v${Date.now()}`,
  };

  // 6. Validate manifest
  const validation = validateManifest(finalManifest);
  if (!validation.valid) {
    throw new Error(`Invalid manifest: ${validation.errors.join(", ")}`);
  }

  // 7. Database transaction
  return await prisma.$transaction(async (tx) => {
    // Mark all previous versions as unpublished
    await tx.appVersion.updateMany({
      where: { appId },
      data: { published: false },
    });

    // Update app status
    await tx.app.update({
      where: { id: appId },
      data: { status: "LIVE" },
    });

    // Create new published version
    return await tx.appVersion.create({
      data: {
        appId,
        schema: finalManifest as any,
        version: finalManifest.version,
        published: true,
      },
    });
  });
}

/**
 * Extract collection metadata for Flutter
 * This helps Flutter understand what collections exist
 */
function _getCollectionMetadata(entities: any[]) {
  const collections = new Map<string, any>();

  entities.forEach((entity) => {
    if (!collections.has(entity.collectionName)) {
      // Extract field names from first entity of each collection
      const fields = Object.keys(entity.data || {});
      collections.set(entity.collectionName, {
        name: entity.collectionName,
        fields,
        count: 1,
      });
    } else {
      const existing = collections.get(entity.collectionName);
      existing.count++;
    }
  });

  return Array.from(collections.values());
}

/**
 * Validate manifest structure
 */
function validateManifest(manifest: any): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check app object
  if (!manifest.app) errors.push("Missing 'app' object");
  if (!manifest.app?.id) errors.push("app.id is required");
  if (!manifest.app?.name) errors.push("app.name is required");
  if (!manifest.app?.theme) errors.push("app.theme is required");

  // Check screens
  if (!manifest.screens || !Array.isArray(manifest.screens)) {
    errors.push("Missing or invalid 'screens' array");
  } else {
    manifest.screens.forEach((screen: any, index: number) => {
      if (!screen.id) errors.push(`Screen ${index}: missing 'id'`);
      if (!screen.title) errors.push(`Screen ${index}: missing 'title'`);
      if (!screen.root) {
        errors.push(`Screen ${index}: missing 'root' widget`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get live published app (for Flutter)
 */
export async function getLiveApp(appId: string) {
  return await prisma.appVersion.findFirst({
    where: { appId, published: true },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Get version history
 */
export async function getVersionHistory(appId: string) {
  return await prisma.appVersion.findMany({
    where: { appId },
    select: {
      id: true,
      version: true,
      createdAt: true,
      published: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Rollback to a previous version
 */
export async function rollbackToVersion(
  appId: string,
  versionId: string,
  creatorId: string
) {
  const version = await prisma.appVersion.findFirst({
    where: { id: versionId, appId, app: { creatorId } },
  });

  if (!version) {
    throw new Error("Version not found or unauthorized");
  }

  return await prisma.$transaction(async (tx) => {
    // Restore builder draft
    await tx.app.update({
      where: { id: appId },
      data: { draftSchema: version.schema },
    });

    // Switch live flag
    await tx.appVersion.updateMany({
      where: { appId },
      data: { published: false },
    });

    return await tx.appVersion.update({
      where: { id: versionId },
      data: { published: true },
    });
  });
}

/**
 * Check deployment status
 */
export async function getDeploymentStatus(appId: string) {
  const app = await prisma.app.findUnique({
    where: { id: appId },
    select: { draftSchema: true },
  });

  const latestLive = await prisma.appVersion.findFirst({
    where: { appId, published: true },
    orderBy: { createdAt: "desc" },
  });

  if (!latestLive) {
    return {
      status: "NEVER_PUBLISHED",
      lastPublished: null,
    };
  }

  const isSynced =
    JSON.stringify(app?.draftSchema) === JSON.stringify(latestLive.schema);

  return {
    status: isSynced ? "IN_SYNC" : "OUT_OF_SYNC",
    lastPublished: latestLive.createdAt,
    version: latestLive.version,
  };
}