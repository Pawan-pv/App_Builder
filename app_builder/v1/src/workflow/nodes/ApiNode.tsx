// src/workflow/nodes/ApiNode.tsx
import { Handle, Position } from "reactflow";

export function ApiNode({ data }: any) {
  return (
    <div className="bg-blue-50 border-2 border-blue-300 rounded px-4 py-2 text-xs min-w-140px">
      <div className="font-bold text-blue-700">🌐 API</div>
      {data.config?.url && (
        <div className="text-[10px] text-blue-600 mt-1 truncate max-w-120px">
          {data.config.url}
        </div>
      )}
      <Handle
        type="target"
        position={Position.Top}
        data-testid="handle-target"
        className="w-3! h-3! bg-blue-500! border-2! border-white"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        data-testid="handle-source"
        className="w-3! h-3! bg-blue-500! border-2! border-white"
      />
    </div>
  );
}