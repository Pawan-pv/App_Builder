import { describe, it, expect } from "vitest";
import React from "react";
import { renderHook, act } from "@testing-library/react";
import { UniversalBuilderProvider, useUniversalBuilder } from "../UniversalBuilderContext";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <UniversalBuilderProvider>{children}</UniversalBuilderProvider>
);

describe("Widget mutations", () => {
  it("adds widget with default size and selects it", () => {
    const { result } = renderHook(() => useUniversalBuilder(), { wrapper });

    let widgetId = "";

    act(() => {
      widgetId = result.current.addWidget("screen-1", "Button");
    });

    const screen = result.current.screens[0];
    const widget = screen.widgets.find(w => w.id === widgetId);

    expect(widget).toBeDefined();
    expect(widget?.props.layout?.widthMode).toBe("fixed");
    expect(result.current.selectedWidgetId).toBe(widgetId);
  });

  it("creates children array for container widgets", () => {
    const { result } = renderHook(() => useUniversalBuilder(), { wrapper });

    let widgetId = "";

    act(() => {
      widgetId = result.current.addWidget("screen-1", "Column");
    });

    const widget = result.current.screens[0].widgets.find(w => w.id === widgetId);
    expect(widget?.children).toEqual([]);
  });

  it("deletes widget and clears selection", () => {
    const { result } = renderHook(() => useUniversalBuilder(), { wrapper });

    let widgetId = "";

    act(() => {
      widgetId = result.current.addWidget("screen-1", "Text");
    });

    act(() => {
      result.current.deleteWidget("screen-1", widgetId);
    });

    expect(result.current.selectedWidgetId).toBeNull();
    expect(
      result.current.screens[0].widgets.find(w => w.id === widgetId)
    ).toBeUndefined();
  });
});
