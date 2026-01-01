import { describe, it, expect } from "@jest/globals"
import { Ajv } from "ajv";

import manifestSchema from "../../src/contracts/manifest.schema.json" with { type: "json" };
import backendPayload from "../fixtures/flutter-manifest.json" with { type: "json" };

const ajv = new Ajv();
const validate = ajv.compile(manifestSchema);

describe("Flutter ↔ Backend Contract", () => {
  it("matches Flutter runtime expectations", () => {
    const valid = validate(backendPayload);

    if (!valid) {
      console.error(validate.errors);
    }

    expect(valid).toBe(true);
  });
});