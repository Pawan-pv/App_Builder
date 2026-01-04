// src/workflow/nodes/ValidateNode.tsx
import { Handle, Position } from "reactflow";

export function ValidateNode({ data }: any) {
  return (
    <div className="bg-purple-50 border-2 border-purple-300 rounded px-4 py-2 text-xs min-w-140px">
      <div className="font-bold text-purple-700">✓ Validate</div>
      {data.config?.fields && (
        <div className="text-[10px] text-purple-600 mt-1">
          {data.config.fields.length} field(s)
        </div>
      )}
      <Handle
        type="target"
        position={Position.Top}
        data-testid="handle-target"
        className="w-3! h-3! bg-purple-500! border-2! border-white!"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        data-testid="handle-source"
        className="w-3! h-3! bg-purple-500! border-2! border-white!"
      />
    </div>
  );
}
