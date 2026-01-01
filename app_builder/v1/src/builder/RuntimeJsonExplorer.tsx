import React from "react";

export function RuntimeJsonExplorer({
  data,
  path = "runtime",
  onSelect,
}: {
  data: any;
  path?: string;
  onSelect: (expr: string) => void;
}) {
  if (typeof data !== "object" || data === null) {
    return (
      <button
        onClick={() => onSelect(path)}
        className="text-xs text-teal-600 hover:underline"
      >
        {path}
      </button>
    );
  }

  return (
    <div className="pl-3 space-y-1">
      {Object.entries(data).map(([key, value]) => {
        const nextPath = `${path}.${key}`;
        return (
          <div key={nextPath}>
            <div className="text-[11px] font-bold text-slate-600">
              {key}
            </div>

            <RuntimeJsonExplorer
              data={value}
              path={nextPath}
              onSelect={onSelect}
            />
          </div>
        );
      })}
    </div>
  );
}
