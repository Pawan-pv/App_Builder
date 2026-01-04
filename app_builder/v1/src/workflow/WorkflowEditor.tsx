// src/workflow/WorkflowEditor.tsx
import { useCallback, useEffect, useState, useRef } from "react";
import ReactFlow, {
  Background,
  Controls,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  ReactFlowProvider,
  useReactFlow,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
} from "reactflow";
import "reactflow/dist/style.css";
import { nodeTypes } from "./nodes/nodeTypes";
import { WorkflowNodePalette } from "./WorkflowNodePalette";
import { useUniversalBuilder } from "../context/UniversalBuilderContext";
import type { WidgetType } from "../types";
import { Save } from "lucide-react";

/* --------------------------------
   Workflow Templates
-------------------------------- */

type WorkflowTemplate = {
  id: string;
  label: string;
  allowedTypes?: WidgetType[];
  nodes: Node[];
  edges: Edge[];
};

const TEMPLATES: WorkflowTemplate[] = [
  {
    id: "empty",
    label: "Empty",
    nodes: [
      {
        id: "trigger",
        type: "trigger",
        position: { x: 250, y: 50 },
        data: { label: "On Tap" },
      },
    ],
    edges: [],
  },
  {
    id: "api-alert",
    label: "API → Alert",
    allowedTypes: ["Button", "Container", "Image"],
    nodes: [
      {
        id: "trigger",
        type: "trigger",
        position: { x: 250, y: 50 },
        data: { label: "On Tap" },
      },
      {
        id: "api",
        type: "api",
        position: { x: 250, y: 150 },
        data: { label: "API Call", config: { url: "/api/example" } },
      },
      {
        id: "alert",
        type: "alert",
        position: { x: 250, y: 260 },
        data: { label: "Show Alert", config: { message: "Success!" } },
      },
    ],
    edges: [
      { id: "e1", source: "trigger", target: "api" },
      { id: "e2", source: "api", target: "alert" },
    ],
  },
];

/* --------------------------------
   Provider Wrapper
-------------------------------- */

export function WorkflowEditor(props: any) {
  return (
    <ReactFlowProvider>
      <WorkflowEditorContent {...props} />
    </ReactFlowProvider>
  );
}

/* --------------------------------
   Editor Content
-------------------------------- */

function WorkflowEditorContent({
  workflow,
  onChange,
  initialNodes,
  widgetType,
}: {
  workflow?: { nodes: Node[]; edges: Edge[] };
  onChange: (wf: { nodes: Node[]; edges: Edge[] }) => void;
  initialNodes?: Node[];
  widgetType?: WidgetType;
}) {
  const { savedTemplates, saveTemplate } = useUniversalBuilder();
  const reactFlowInstance = useReactFlow();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [nodes, setNodes] = useState<Node[]>(
    workflow?.nodes?.length
      ? workflow.nodes
      : initialNodes?.length
      ? initialNodes
      : TEMPLATES[0].nodes
  );

  const [edges, setEdges] = useState<Edge[]>(workflow?.edges ?? []);
  const [selectedTemplate, setSelectedTemplate] = useState("custom");
  const [saveName, setSaveName] = useState("");
  const [showSave, setShowSave] = useState(false);

  const availableTemplates = [
    ...TEMPLATES.filter(
      (t) => !t.allowedTypes || (widgetType && t.allowedTypes.includes(widgetType))
    ),
    ...savedTemplates.map((t: any) => ({
      ...t,
      label: `(Saved) ${t.name}`,
    })),
  ];

  useEffect(() => {
    onChange({ nodes, edges });
  }, [nodes, edges, onChange]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) => addEdge(connection, eds)),
    []
  );

  const applyTemplate = (id: string) => {
    const tpl = availableTemplates.find((t) => t.id === id);
    if (!tpl) return;
    setNodes(tpl.nodes);
    setEdges(tpl.edges);
    setSelectedTemplate(id);
  };

  const onSave = () => {
    if (!saveName) return;
    saveTemplate(saveName, nodes, edges);
    setSaveName("");
    setShowSave(false);
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const type = e.dataTransfer.getData("application/reactflow");
      if (!type) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: e.clientX,
        y: e.clientY,
      });

      setNodes((nds) =>
  nds.concat({
    id: crypto.randomUUID(),
    type,
    position,
    data: {
      label: type === "navigate" ? "Navigate" : `New ${type}`,
      config: {}, // 🔑 keep schema stable
    },
  })
);

    },
    [reactFlowInstance]
  );

  // Addition to WorkflowEditor.tsx - add this to WorkflowEditorContent component

// Add this handler before the render section:
const handleNodeClick = useCallback((nodeType: string) => {
  const newNode: Node = {
    id: crypto.randomUUID(),
    type: nodeType,
    position: {
      x: 250 + nodes.length * 50,
      y: 150 + nodes.length * 100,
    },
    data: {
      label: nodeType === "navigate" ? "Navigate" : nodeType,
      config: {}, // 🔑 REQUIRED for compiler + node UI
    },
  };

  setNodes((nds) => [...nds, newNode]);
}, [nodes.length]);



  /* --------------------------------
     RENDER
  -------------------------------- */

  return (
    <div
      data-testid="workflow-editor"
      className="h-full w-full bg-slate-50 flex flex-col"
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 border-b bg-white">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600">Template</span>
          <select
            className="border rounded px-2 py-1 text-xs"
            value={selectedTemplate}
            onChange={(e) => applyTemplate(e.target.value)}
          >
            <option value="custom">Custom</option>
            {availableTemplates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {showSave ? (
          <div className="flex gap-1">
            <input
              className="border text-xs p-1 rounded"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
            />
            <button
              onClick={onSave}
              className="text-xs bg-teal-500 text-white px-2 py-1 rounded"
            >
              Save
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowSave(true)}
            className="flex items-center gap-1 text-xs text-teal-600"
          >
            <Save size={12} /> Save Template
          </button>
        )}
      </div>

      <div className="flex-1 flex overflow-hidden">
        <WorkflowNodePalette onNodeClick={handleNodeClick} />

        <div ref={wrapperRef} className="flex-1 h-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDragOver={onDragOver}
            onDrop={onDrop}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}
