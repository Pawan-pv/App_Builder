import React, { createContext, useContext, useState } from "react";
import type { Node, Edge } from "reactflow";

type WorkflowContextType = {
  nodes: Node[];
  edges: Edge[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
};

const WorkflowContext = createContext<WorkflowContextType | null>(null);

/* -----------------------------
   Provider
----------------------------- */

export function WorkflowProvider({ children }: { children: React.ReactNode }) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  return (
    <WorkflowContext.Provider
      value={{ nodes, edges, setNodes, setEdges }}
    >
      {children}
    </WorkflowContext.Provider>
  );
}

/* -----------------------------
   Hook
----------------------------- */

export function useWorkflow() {
  const ctx = useContext(WorkflowContext);
  if (!ctx) {
    throw new Error("useWorkflow must be used inside WorkflowProvider");
  }
  return ctx;
}
