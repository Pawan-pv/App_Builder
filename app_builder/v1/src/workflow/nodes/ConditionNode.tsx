// Update src/workflow/nodes/ConditionNode.tsx
import { Handle, Position } from "reactflow";

export function ConditionNode({ data }: any) {
  return (
    <div className="bg-yellow-50 border-2 border-yellow-400 rounded px-4 py-2 text-xs min-w-140px">
      <div className="font-bold text-yellow-700">🔀{data.label || "Condition"}</div>
      <div className="flex gap-2 mt-2 text-[9px]">
        <span className="text-green-600">✓ true</span>
        <span className="text-red-600">✗ false</span>
      </div>
      <Handle
        type="target"
        position={Position.Top}
        data-testid="handle-target"
        className="w-3! h-3! bg-yellow-500! border-2! border-white"
      />
      <Handle
        id="true"
        type="source"
        position={Position.Bottom}
        style={{ left: '30%' }}
        data-testid="handle-source-true"
        className="w-3! h-3! bg-green-500! border-2! border-white"
      />
      <Handle
        id="false"
        type="source"
        position={Position.Bottom}
        style={{ left: '70%' }}
        data-testid="handle-source-false"
        className="w-3! h-3! bg-red-500! border-2! border-white"
      />
    </div>
  );
}
