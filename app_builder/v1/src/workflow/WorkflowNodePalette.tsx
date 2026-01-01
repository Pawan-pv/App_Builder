import React from "react";
import {
    Globe,
    Map,
    MessageSquare,
    CheckCircle2,
    Split
} from "lucide-react";

export const NODE_TYPES = [
    { type: "api", label: "API Request", icon: Globe, color: "text-blue-500" },
    { type: "navigate", label: "Navigate", icon: Map, color: "text-green-500" },
    { type: "alert", label: "Show Alert", icon: MessageSquare, color: "text-orange-500" },
    { type: "validate", label: "Validate Form", icon: CheckCircle2, color: "text-purple-500" },
    { type: "condition", label: "Condition (If)", icon: Split, color: "text-amber-500" },
];

export function WorkflowNodePalette() {
    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        event.dataTransfer.setData("application/reactflow", nodeType);
        event.dataTransfer.effectAllowed = "move";
    };

    return (
        <div className="w-48 border-r bg-white flex flex-col">
            <div className="p-3 border-b text-xs font-bold uppercase text-slate-500">
                Nodes
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {NODE_TYPES.map((node) => (
                    <div
                        key={node.type}
                        className="flex items-center gap-2 p-2 border rounded cursor-grab hover:bg-slate-50 active:cursor-grabbing text-xs"
                        draggable
                        onDragStart={(e) => onDragStart(e, node.type)}
                    >
                        <node.icon size={14} className={node.color} />
                        {node.label}
                    </div>
                ))}

                <div className="mt-4 p-2 text-[10px] text-slate-400 text-center border-t border-dashed">
                    Drag nodes onto the canvas
                </div>
            </div>
        </div>
    );
}
