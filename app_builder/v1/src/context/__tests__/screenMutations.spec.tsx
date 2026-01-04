import { describe, it, expect } from "vitest";
import React from "react";
import { renderHook, act } from "@testing-library/react";
import { UniversalBuilderProvider, useUniversalBuilder } from "../UniversalBuilderContext";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <UniversalBuilderProvider>{children}</UniversalBuilderProvider>
);

describe("Screen mutations", () => {
  it("adds a new screen and returns id", () => {
    const { result } = renderHook(() => useUniversalBuilder(), { wrapper });

    let newId = "";

    act(() => {
      newId = result.current.addScreen("Dashboard");
    });

    expect(result.current.screens.some(s => s.id === newId)).toBe(true);
  });

  it("updates screen position using delta", () => {
    const { result } = renderHook(() => useUniversalBuilder(), { wrapper });

    const screen = result.current.screens[0];
    const startX = screen.position.x;

    act(() => {
      result.current.updateScreenPosition(screen.id, { x: 50, y: 0 });
    });

    expect(result.current.screens[0].position.x).toBe(startX + 50);
  });

  it("clears widget selection when switching screen", () => {
    const { result } = renderHook(() => useUniversalBuilder(), { wrapper });

    act(() => {
      result.current.addWidget("screen-1", "Text");
    });

    expect(result.current.selectedWidgetId).not.toBeNull();

    act(() => {
      result.current.setActiveScreen(null);
    });

    expect(result.current.selectedWidgetId).toBeNull();
  });
});
