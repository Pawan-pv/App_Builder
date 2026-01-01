import { describe, it, expect } from "@jest/globals";

function hasBreakingChange(oldSchema: any, newSchema: any): boolean {
  if (oldSchema.props?.text && !newSchema.props?.text) return true;
  if (oldSchema.props?.text && newSchema.props?.value) return true;
  return false;
}

describe("Schema Diff Validation", () => {
  it("detects breaking widget schema changes", () => {
    expect(
      hasBreakingChange(
        { type: "Text", props: { text: "hello" } },
        { type: "Text", props: { value: "hello" } }
      )
    ).toBe(true);
  });
});
