import type { Edge, Node } from "reactflow";
import type {
  WidgetAction,
  ActionTrigger,
  ActionCondition,
} from "../types";

/* -----------------------------
   Helpers
----------------------------- */

function outgoingEdges(nodeId: string, edges: Edge[]) {
  return edges.filter(e => e.source === nodeId);
}

function nodeById(nodes: Node[], id: string) {
  return nodes.find(n => n.id === id);
}

function resolveTrigger(node: Node): ActionTrigger {
  switch (node.data?.label) {
    case "On Load":
      return "onLoad";
    case "On Submit":
      return "onSubmit";
    default:
      return "onTap";
  }
}

function mapNodeToAction(
  node: Node,
  trigger: ActionTrigger
): WidgetAction | null {
  switch (node.type) {
    case "validate":
      return {
        id: node.id,
        trigger,
        type: "submitForm",
        config: {
          fields: node.data.config?.fields ?? [],
        },
      };

    case "api":
      return {
        id: node.id,
        trigger,
        type: "api",
        config: node.data.config ?? {},
      };

    case "navigate":
      return {
        id: node.id,
        trigger,
        type: "navigate",
        config: {
          targetScreenId: node.data.config?.targetScreenId,
        },
      };

    case "alert":
      return {
        id: node.id,
        trigger,
        type: "alert",
        config: {
          message: node.data.config?.message,
        },
      };

    default:
      return null;
  }
}

/* -----------------------------
   Compiler
----------------------------- */

export function compileWorkflow(
  nodes: Node[],
  edges: Edge[]
): WidgetAction[] {
  const triggerNodes = nodes.filter(n => n.type === "trigger");
  if (triggerNodes.length === 0) return [];

  const allActions: WidgetAction[] = [];

  for (const triggerNode of triggerNodes) {
    const trigger = resolveTrigger(triggerNode);

    function collect(startNodeId: string): WidgetAction[] {
      const visited = new Set<string>();
      const actions: WidgetAction[] = [];

      function walk(nodeId: string) {
        if (visited.has(nodeId)) return;
        visited.add(nodeId);

        for (const edge of outgoingEdges(nodeId, edges)) {
          const node = nodeById(nodes, edge.target);
          if (!node) continue;

          /* ---------- CONDITION NODE ---------- */
          if (node.type === "condition") {
            const trueEdge = edges.find(
              e => e.source === node.id && e.sourceHandle === "true"
            );
            const falseEdge = edges.find(
              e => e.source === node.id && e.sourceHandle === "false"
            );

            const ifAction: WidgetAction = {
              id: node.id,
              trigger,
              type: "if",
              condition: node.data.config?.condition as ActionCondition,
              then: trueEdge ? collect(trueEdge.target) : [],
              else: falseEdge ? collect(falseEdge.target) : [],
              config: {},
            };

            actions.push(ifAction);
            continue;
          }

          /* ---------- NORMAL ACTION ---------- */
          const action = mapNodeToAction(node, trigger);
          if (action) {
            actions.push(action);
            walk(node.id);
          }
        }
      }

      walk(startNodeId);
      return actions;
    }

    allActions.push(...collect(triggerNode.id));
  }

  return allActions;
}
