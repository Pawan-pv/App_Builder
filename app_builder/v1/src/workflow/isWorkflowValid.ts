import type { Node, Edge } from "reactflow";

export function isWorkflowValid(nodes: Node[], edges: Edge[]) {
  if (!nodes.length) return false;

  const trigger = nodes.find((n) => n.type === "trigger");
  if (!trigger) return false;

  // Trigger must connect to something
  const triggerEdge = edges.find((e) => e.source === trigger.id);
  if (!triggerEdge) return false;

  // Target must exist
  const targetNode = nodes.find((n) => n.id === triggerEdge.target);
  if (!targetNode) return false;

  return true;
}
