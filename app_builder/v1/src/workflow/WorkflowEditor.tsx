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

  {
    id: "form-submit",
    label: "Validate → API → Navigate",
    allowedTypes: ["Input", "Column", "Row"],
    nodes: [
      {
        id: "trigger",
        type: "trigger",
        position: { x: 250, y: 50 },
        data: { label: "On Submit" },
      },
      {
        id: "validate",
        type: "validate",
        position: { x: 250, y: 150 },
        data: { label: "Validate Form" },
      },
      {
        id: "api",
        type: "api",
        position: { x: 250, y: 260 },
        data: { label: "Submit API" },
      },
      {
        id: "navigate",
        type: "navigate",
        position: { x: 250, y: 370 },
        data: { label: "Go To Screen" },
      },
    ],
    edges: [
      { id: "e1", source: "trigger", target: "validate" },
      { id: "e2", source: "validate", target: "api" },
      { id: "e3", source: "api", target: "navigate" },
    ],
  },
];

/* --------------------------------
   Wrapper for ReactFlowProvider
-------------------------------- */

export function WorkflowEditor(props: any) {
  return (
    <ReactFlowProvider>
      <WorkflowEditorContent {...props} />
    </ReactFlowProvider>
  );
}

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

  /* ---------- Local State ---------- */

  const [nodes, setNodes] = useState<Node[]>(
    workflow?.nodes?.length
      ? workflow.nodes
      : initialNodes?.length
        ? initialNodes
        : TEMPLATES[0].nodes
  );

  const [edges, setEdges] = useState<Edge[]>(
    workflow?.edges ?? []
  );

  const [selectedTemplate, setSelectedTemplate] = useState<string>("custom");
  const [saveName, setSaveName] = useState("");
  const [showSave, setShowSave] = useState(false);

  /* ---------- Computed Templates ---------- */

  const availableTemplates = [
    ...TEMPLATES.filter(
      (t) => !t.allowedTypes || (widgetType && t.allowedTypes.includes(widgetType))
    ),
    ...savedTemplates.map((t: { id: string; name: string; nodes: Node[]; edges: Edge[] }) => ({ ...t, label: `(Saved) ${t.name}` })),
  ];

  /* ---------- Sync to Parent ---------- */

  useEffect(() => {
    onChange({ nodes, edges });
  }, [nodes, edges, onChange]);

  /* ---------- React Flow Handlers ---------- */

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    []
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds));
    },
    []
  );

  /* ---------- Template Apply ---------- */

  const applyTemplate = (templateId: string) => {
    const tpl = availableTemplates.find((t) => t.id === templateId);
    if (!tpl) return;

    setNodes(tpl.nodes);
    setEdges(tpl.edges);
    setSelectedTemplate(templateId);
  };

  const onSave = () => {
    if (!saveName) return;
    saveTemplate(saveName, nodes, edges);
    setSaveName("");
    setShowSave(false);
  };

  /* ---------- Drag & Drop ---------- */

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");
      if (!type) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: crypto.randomUUID(),
        type,
        position,
        data: { label: `New ${type}` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  /* ---------- Render ---------- */

  return (
    <div className="h-full w-full bg-slate-50 flex flex-col">
      {/* ───── Toolbar ───── */}
      <div className="flex items-center justify-between p-2 border-b bg-white">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600">Template</span>
          <select
            className="border rounded px-2 py-1 text-xs max-w-[200px]"
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

        <div className="flex items-center gap-2">
          {showSave ? (
            <div className="flex items-center gap-1">
              <input
                className="border text-xs p-1 rounded w-32"
                placeholder="Name..."
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
              />
              <button
                onClick={onSave}
                className="text-xs bg-teal-500 text-white px-2 py-1 rounded"
              >
                Save
              </button>
              <button
                onClick={() => setShowSave(false)}
                className="text-xs text-slate-400"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowSave(true)}
              className="flex items-center gap-1 text-[10px] uppercase font-bold text-teal-600 hover:bg-teal-50 px-2 py-1 rounded"
            >
              <Save size={12} /> Save As Template
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* ───── Sidebar Palette ───── */}
        <WorkflowNodePalette />

        {/* ───── Workflow Canvas ───── */}
        <div className="flex-1 h-full" ref={wrapperRef}>
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
