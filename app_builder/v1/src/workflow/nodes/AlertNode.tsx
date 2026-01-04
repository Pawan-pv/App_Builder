// / src/workflow/nodes/AlertNode.tsx
import { Handle, Position } from "reactflow";

export function AlertNode({ data }: any) {
  return (
    <div className="bg-orange-50 border-2 border-orange-300 rounded px-4 py-2 text-xs min-w-140px">
      <div className="font-bold text-orange-700">💬 Alert</div>
      {data.config?.message && (
        <div className="text-[10px] text-orange-600 mt-1 truncate max-w-120px">
          "{data.config.message}"
        </div>
      )}
      <Handle
        type="target"
        position={Position.Top}
        data-testid="handle-target"
        className="w-3! h-3! bg-orange-500! border-2! border-white!"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        data-testid="handle-source"
        className="w-3! h-3! bg-orange-500! border-2! border-white!"
      />
    </div>
  );
}
