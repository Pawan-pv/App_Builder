export function validateManifest(manifest: any) {
  if (!manifest?.screens || !Array.isArray(manifest.screens)) {
    throw new Error("Invalid manifest");
  }

  for (const screen of manifest.screens) {
    if (!screen.root) {
      throw new Error("Invalid manifest");
    }
  }

  return true;
}
