import { Handle, Position } from "reactflow";

export function TriggerNode({ data }: any) {
  return (
    <div className="bg-teal-600 text-white px-4 py-2 rounded text-xs">
      ⚡ {data.label}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
