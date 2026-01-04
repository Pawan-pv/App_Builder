import { describe, it, expect } from "vitest";
import type { Node, Edge } from "reactflow";
import { compileWorkflow } from "../compiler";

describe("workflow compiler", () => {
  it("returns empty actions for empty workflow", () => {
    const actions = compileWorkflow([], []);
    expect(actions).toEqual([]);
  });

  it("compiles a simple trigger → navigate workflow", () => {
    const nodes: Node[] = [
      {
        id: "trigger",
        type: "trigger",
        position: { x: 0, y: 0 },
        data: { trigger: "onTap" },
      },
      {
        id: "nav",
        type: "navigate",
        position: { x: 0, y: 100 },
        data: { config: { targetScreenId: "home" } },
      },
    ];

    const edges: Edge[] = [
      { id: "e1", source: "trigger", target: "nav" },
    ];

    const actions = compileWorkflow(nodes, edges);

    expect(actions).toHaveLength(1);
    expect(actions[0].type).toBe("navigate");
  });

  it("compiles multiple actions in sequence from one trigger", () => {
    const nodes: Node[] = [
      {
        id: "trigger",
        type: "trigger",
        position: { x: 0, y: 0 },
        data: { trigger: "onTap" },
      },
      {
        id: "alert",
        type: "alert",
        position: { x: 0, y: 100 },
        data: { config: { message: "Hello" } },
      },
      {
        id: "nav",
        type: "navigate",
        position: { x: 0, y: 200 },
        data: { config: { targetScreenId: "home" } },
      },
    ];

    const edges: Edge[] = [
      { id: "e1", source: "trigger", target: "alert" },
      { id: "e2", source: "alert", target: "nav" },
    ];

    const actions = compileWorkflow(nodes, edges);

    expect(actions).toHaveLength(2);
    expect(actions[0].type).toBe("alert");
    expect(actions[1].type).toBe("navigate");
  });
});
