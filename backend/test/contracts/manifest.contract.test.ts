import { describe, it, expect } from "@jest/globals";
import { Ajv } from "ajv";
import manifestSchema from "../../src/contracts/manifest.schema.json" with { type: "json" };

const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(manifestSchema);

describe("Manifest Contract", () => {
  it("validates a published manifest shape (NO DB)", () => {
    const manifest = {
      version: "v1",
      app: {
        id: "app-id",
        name: "Demo App",
        theme: { primaryColor: "#0062FF" },
      },
      screens: [
        {
          id: "home",
          title: "Home",
          root: {
            type: "Column",
            children: [
              {
                type: "Text",
                props: { text: "Hello" },
              },
            ],
          },
        },
      ],
    };

    const valid = validate(manifest);

    if (!valid) {
      console.error(validate.errors);
    }

    expect(valid).toBe(true);
  });
});