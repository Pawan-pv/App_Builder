import { describe, it, expect } from "@jest/globals";
import { getLiveApp } from "../../src/modules/publish/publish.service.js";
import { prisma } from "../../src/config/prisma.js";

describe("Live Manifest Sanity Check (Flutter)", () => {
  it("published manifest is Flutter-safe", async () => {
    const app = await prisma.app.findFirst({
      where: { status: "LIVE" },
    });

    expect(app).toBeTruthy();

    const version = await getLiveApp(app!.id);
    expect(version?.schema).toBeTruthy();

    const manifest = version!.schema as any;

    expect(manifest.app?.id).toBeDefined();
    expect(manifest.screens.length).toBeGreaterThan(0);

    manifest.screens.forEach((screen: any) => {
      expect(Array.isArray(screen.root)).toBe(true);
      expect(screen.root.length).toBeGreaterThan(0);
    });
  });
});
