import { describe, it, expect } from "@jest/globals";
import { validateManifest } from "../../src/modules/publish/publish.validator.js";

describe("Publish validation", () => {
  it("fails publish if screen has no root", () => {
    expect(() =>
      validateManifest({
        app: { id: "app-id", name: "Test", theme: {} },
        version: "v1",
        screens: [{ id: "home", title: "Home" }],
      })
    ).toThrow("Invalid manifest");
  });
});
