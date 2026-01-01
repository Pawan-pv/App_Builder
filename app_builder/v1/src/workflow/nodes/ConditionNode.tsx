import { Handle, Position } from "reactflow";

export function ConditionNode({ data }: any) {
  return (
    <div className="bg-yellow-100 border rounded px-4 py-2 text-xs">
      🔀 {data.label}
      <Handle id="true" type="source" position={Position.Bottom} />
      <Handle id="false" type="source" position={Position.Right} />
      <Handle type="target" position={Position.Top} />
    </div>
  );
}
