import { actionLogs } from "./debugStore";

export function ActionDebugger() {
  return (
    <div className="fixed bottom-0 right-0 w-96 h-64 bg-black text-green-400 text-xs overflow-auto p-2 z-50">
      <div className="font-bold mb-2">Action Debugger</div>

      {actionLogs.length === 0 && (
        <div className="opacity-50">No actions executed yet</div>
      )}

      {actionLogs.map((log, i) => (
        <div key={i} className="mb-1">
          [{new Date(log.time).toLocaleTimeString()}]{" "}
          <span className="font-bold">{log.actionType}</span>
        </div>
      ))}
    </div>
  );
}
