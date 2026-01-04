import { describe, it, expect, vi } from "vitest";
import type { WidgetAction } from "../../types";
import { executeActions } from "../actionExecutor";

describe("actionExecutor", () => {
  it("executes alert action safely", async () => {
    const actions: WidgetAction[] = [
      {
        id: "a1",
        trigger: "onTap",
        type: "alert",
        config: { message: "Hello" },
      },
    ];

    await expect(
      executeActions(actions, {}, {})
    ).resolves.not.toThrow();
  });

  it("executes navigate action with handler", async () => {
    const navigate = vi.fn();

    const actions: WidgetAction[] = [
      {
        id: "a1",
        trigger: "onTap",
        type: "navigate",
        config: { targetScreenId: "screen-2" },
      },
    ];

    await executeActions(
      actions,
      { navigate },
      {}
    );

    expect(navigate).toHaveBeenCalledWith("screen-2");
  });

  it("ignores actions with missing handlers", async () => {
    const actions: WidgetAction[] = [
      {
        id: "a1",
        trigger: "onTap",
        type: "navigate",
        config: { targetScreenId: "screen-2" },
      },
    ];

    await expect(
      executeActions(actions, {}, {})
    ).resolves.not.toThrow();
  });

  it("filters actions by trigger", async () => {
    const navigate = vi.fn();

    const actions: WidgetAction[] = [
      {
        id: "a1",
        trigger: "onLoad",
        type: "navigate",
        config: { targetScreenId: "screen-2" },
      },
    ];

    await executeActions(
      actions.filter(a => a.trigger === "onTap"),
      { navigate },
      {}
    );

    expect(navigate).not.toHaveBeenCalled();
  });

  it("executes conditional (if) actions when condition is true", async () => {
    const navigate = vi.fn();

    const actions: WidgetAction[] = [
      {
        id: "if1",
        trigger: "onTap",
        type: "if",
        condition: {
          left: "user.isLoggedIn",
          operator: "equals",
          right: true,
        },
        then: [
          {
            id: "then1",
            trigger: "onTap",
            type: "navigate",
            config: { targetScreenId: "home" },
          },
        ],
        else: [],
        config: {},
      },
    ];

    await executeActions(
      actions,
      { navigate },
      { user: { isLoggedIn: true } }
    );

    expect(navigate).toHaveBeenCalledWith("home");
  });

  it("executes else actions when condition is false", async () => {
    const navigate = vi.fn();

    const actions: WidgetAction[] = [
      {
        id: "if1",
        trigger: "onTap",
        type: "if",
        condition: {
          left: "user.isLoggedIn",
          operator: "equals",
          right: true,
        },
        then: [],
        else: [
          {
            id: "else1",
            trigger: "onTap",
            type: "navigate",
            config: { targetScreenId: "login" },
          },
        ],
        config: {},
      },
    ];

    await executeActions(
      actions,
      { navigate },
      { user: { isLoggedIn: false } }
    );

    expect(navigate).toHaveBeenCalledWith("login");
  });

  it("never crashes on unknown action type", async () => {
    const actions = [
      {
        id: "x",
        trigger: "onTap",
        type: "unknown",
        config: {},
      },
    ] as any;

    await expect(
      executeActions(actions, {}, {})
    ).resolves.not.toThrow();
  });
});
