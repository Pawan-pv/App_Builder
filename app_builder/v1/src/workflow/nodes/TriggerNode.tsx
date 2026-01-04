import { Handle, Position } from "reactflow";

export function TriggerNode({ data }: any) {
  return (
    <div className="bg-teal-600 text-white px-4 py-2 rounded text-xs font-bold min-w-120px">
      ⚡ {data.label || "On Tap"}
      <Handle
        type="source"
        position={Position.Bottom}
        data-testid="handle-source"
        className="w-3! h-3! bg-teal-400! border-2! border-white"
      />
    </div>
  );
}
