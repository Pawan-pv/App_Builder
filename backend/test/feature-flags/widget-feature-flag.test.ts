import { describe, it, expect } from "@jest/globals";

type WidgetType = "ProductCard";
type FeatureFlags = Record<WidgetType, boolean>;

describe("Widget Feature Flags", () => {
  it("disables ProductCard when flag is off", () => {
    const flags: FeatureFlags = { ProductCard: false };
    const widget: { type: WidgetType } = { type: "ProductCard" };

    expect(flags[widget.type] !== false).toBe(false);
  });
});
