import { describe, it, expect } from "@jest/globals";
import {Ajv} from "ajv";
import widgetSchema from "../../src/contracts/widget.schema.json" with { type: "json" };

const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(widgetSchema);

describe("Widget Contract", () => {
  it("accepts valid widget", () => {
    expect(
      validate({ type: "Text", props: { text: "Hello" } })
    ).toBe(true);
  });

  it("rejects unknown widget type", () => {
    expect(
      validate({ type: "UnknownWidget", props: {} })
    ).toBe(false);
  });
});
