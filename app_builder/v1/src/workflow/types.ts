export type WorkflowNodeType =
  | "trigger"
  | "validate"
  | "api"
  | "condition"
  | "navigate"
  | "alert";

export interface WorkflowNodeData {
  label: string;
  config?: Record<string, any>;
}

export interface WorkflowSchema {
  nodes: {
    id: string;
    type: WorkflowNodeType;
    position: { x: number; y: number };
    data: WorkflowNodeData;
  }[];
  edges: {
    id: string;
    source: string;
    target: string;
    sourceHandle?: string;
  }[];
}
