import { X } from "lucide-react";
import { WorkflowEditor } from "./WorkflowEditor";
import type { Node, Edge } from "reactflow";
import type { WidgetType } from "../types";

export function WorkflowModal({
  workflow,
  onChange,
  onClose,
  widgetType,
}: {
  workflow?: { nodes: Node[]; edges: Edge[] };
  onChange: (wf: { nodes: Node[]; edges: Edge[] }) => void;
  onClose: () => void;
  widgetType?: WidgetType;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
      <div className="w-[90vw] h-[85vh] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="text-sm font-bold">Widget Workflow</h3>
          <button onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Editor */}
        <div className="flex-1">
          <WorkflowEditor
            workflow={workflow}
            onChange={onChange}
            widgetType={widgetType}
          />
        </div>
      </div>
    </div>
  );
}
