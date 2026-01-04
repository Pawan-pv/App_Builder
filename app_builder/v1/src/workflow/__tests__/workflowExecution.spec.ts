import { describe, it, expect, vi } from "vitest";
import type { Node, Edge } from "reactflow";
import { compileWorkflow } from "../compiler";
import { executeActions } from "../../runTimeEngine/actionExecutor";

describe("workflow → runtime integration", () => {
  it("executes compiled workflow actions correctly", async () => {
    const navigate = vi.fn();

    const nodes: Node[] = [
      {
        id: "trigger",
        type: "trigger",
        position: { x: 0, y: 0 },
        data: { label: "On Tap", trigger: "onTap" },
      },
      {
        id: "nav",
        type: "navigate",
        position: { x: 0, y: 100 },
        data: {
          config: { targetScreenId: "home" },
        },
      },
    ];

    const edges: Edge[] = [
      { id: "e1", source: "trigger", target: "nav" },
    ];

    const actions = compileWorkflow(nodes, edges);

    await executeActions(actions, { navigate }, {});

    expect(navigate).toHaveBeenCalledWith("home");
  });

  it("does NOT execute then-branch when condition is false", async () => {
    const navigate = vi.fn();

    const nodes: Node[] = [
      {
        id: "trigger",
        type: "trigger",
        position: { x: 0, y: 0 },
        data: { label: "On Tap", trigger: "onTap" },
      },
      {
        id: "if",
        type: "condition",
        position: { x: 0, y: 100 },
        data: {
          config: {
            condition: {
              left: "user.isLoggedIn",
              operator: "equals",
              right: true,
            },
          },
        },
      },
      {
        id: "nav",
        type: "navigate",
        position: { x: 0, y: 200 },
        data: {
          config: { targetScreenId: "dashboard" },
        },
      },
    ];

    const edges: Edge[] = [
      { id: "e1", source: "trigger", target: "if" },
      { id: "e2", source: "if", target: "nav", sourceHandle: "true" },
    ];

    const actions = compileWorkflow(nodes, edges);

    await executeActions(actions, { navigate }, { user: { isLoggedIn: false } });

    expect(navigate).not.toHaveBeenCalled();
  });

  // it("executes else-branch when condition is false (if supported)", async () => {
  //   const navigate = vi.fn();

  //   const actions = [
  //     {
  //       type: "if",
  //       config: {
  //         condition: {
  //           left: "user.isLoggedIn",
  //           operator: "equals",
  //           right: true,
  //         },
  //       },
  //       then: [],
  //       else: [
  //         {
  //           type: "navigate",
  //           config: { targetScreenId: "login" },
  //         },
  //       ],
  //     },
  //   ];

  //   await executeActions(actions as any, { navigate }, { user: { isLoggedIn: false } });

  //   expect(navigate).toHaveBeenCalledWith("login");
  // });
});
