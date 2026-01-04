// import { Handle, Position } from "reactflow";

// export function NavigateNode({ data }: any) {
//   return (
//     <div className="bg-green-50 border-2 border-green-300 rounded px-4 py-2 text-xs min-w-140px">
//       <div className="font-bold text-green-700">🗺️ Navigate</div>
//       {data.config?.targetScreenId && (
//         <div className="text-[10px] text-green-600 mt-1">
//           → {data.config.targetScreenId}
//         </div>
//       )}
//       <Handle
//         type="target"
//         position={Position.Top}
//         data-testid="handle-target"
//         className="w-3! h-3! bg-green-500! border-2! border-white"
//       />
//       <Handle
//         type="source"
//         position={Position.Bottom}
//         data-testid="handle-source"
//         className="w-3! h-3! bg-green-500! border-2! border-white"
//       />
//     </div>
//   );
// }

import { Handle, Position } from "reactflow";

export function NavigateNode({ data }: any) {
  return (
    <div
      data-testid="workflow-node-navigate"
      className="bg-green-50 border-2 border-green-300 rounded px-4 py-2 text-xs min-w-[140px]"
    >
      <div className="font-bold text-green-700">🗺️ Navigate</div>

      {data.config?.targetScreenId && (
        <div className="text-[10px] text-green-600 mt-1">
          → {data.config.targetScreenId}
        </div>
      )}

      <Handle type="target" position={Position.Top} data-testid="handle-target" />
      <Handle type="source" position={Position.Bottom} data-testid="handle-source" />
    </div>
  );
}
