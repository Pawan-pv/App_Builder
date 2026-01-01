import { Handle, Position } from "reactflow";

export function ActionNode({ data }: any) {
  return (
    <div className="bg-white border rounded px-4 py-2 text-xs">
      {data.label}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
