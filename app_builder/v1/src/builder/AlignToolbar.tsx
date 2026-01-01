// src/builder/AlignToolbar.tsx
import { useUniversalBuilder } from "../context/UniversalBuilderContext";

import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignHorizontalJustifyCenter,
  ArrowUpDown,
  ArrowLeftRight,
} from "lucide-react";

type MainAxisAlignment =
  | "start"
  | "center"
  | "end"
  | "spaceBetween"
  | "spaceAround";

type CrossAxisAlignment =
  | "start"
  | "center"
  | "end"
  | "stretch";

/* ---------------- Type Guards ---------------- */

const MAIN_AXIS_VALUES: readonly MainAxisAlignment[] = [
  "start",
  "center",
  "end",
  "spaceBetween",
  "spaceAround",
];

const CROSS_AXIS_VALUES: readonly CrossAxisAlignment[] = [
  "start",
  "center",
  "end",
  "stretch",
];

function isMainAxis(value?: string): value is MainAxisAlignment {
  return !!value && MAIN_AXIS_VALUES.includes(value as MainAxisAlignment);
}

function isCrossAxis(value?: string): value is CrossAxisAlignment {
  return !!value && CROSS_AXIS_VALUES.includes(value as CrossAxisAlignment);
}

export function AlignToolbar() {
  const { activeScreenId, selectedWidget, updateWidgetProps } =
    useUniversalBuilder();

  if (!selectedWidget || !activeScreenId) return null;

  const isFlex =
    selectedWidget.type === "Column" || selectedWidget.type === "Row";
  if (!isFlex) return null;

  const layout = selectedWidget.props.layout || {};

  // ✅ SAFE NARROWING
  const mainAxis: MainAxisAlignment = isMainAxis(layout.mainAxisAlignment)
    ? layout.mainAxisAlignment
    : "start";

  const crossAxis: CrossAxisAlignment = isCrossAxis(
    layout.crossAxisAlignment
  )
    ? layout.crossAxisAlignment
    : "start";

  const updateLayout = (patch: Partial<typeof layout>) => {
    updateWidgetProps(activeScreenId, selectedWidget.id, {
      props: {
        layout: {
          ...layout,
          ...patch,
        },
      },
    });
  };

  const mainAxisOptions = [
    { id: "start", icon: <AlignLeft size={14} />, label: "Start" },
    { id: "center", icon: <AlignCenter size={14} />, label: "Center" },
    { id: "end", icon: <AlignRight size={14} />, label: "End" },
    {
      id: "spaceBetween",
      icon: <AlignHorizontalJustifyCenter size={14} />,
      label: "Space Between",
    },
    {
      id: "spaceAround",
      icon: <AlignHorizontalJustifyCenter size={14} />,
      label: "Space Around",
    },
  ] as const;

  const crossAxisOptions = [
    { id: "start", icon: <ArrowUpDown size={14} />, label: "Start" },
    { id: "center", icon: <AlignCenter size={14} />, label: "Center" },
    { id: "end", icon: <ArrowUpDown size={14} />, label: "End" },
    { id: "stretch", icon: <ArrowLeftRight size={14} />, label: "Stretch" },
  ] as const;

  return (
    <div className="flex flex-col gap-2 p-2 border-b bg-teal-50/30 animate-in fade-in">
      {/* MAIN AXIS */}
      <div className="flex items-center gap-2">
        <span className="text-[9px] font-black uppercase text-teal-600 w-20">
          Main Axis
        </span>
        <div className="flex gap-1">
          {mainAxisOptions.map(opt => (
            <button
              key={opt.id}
              onClick={() => updateLayout({ mainAxisAlignment: opt.id })}
              title={opt.label}
              className={`p-2 rounded-lg ${mainAxis === opt.id
                ? "bg-teal-500 text-white"
                : "text-slate-600 hover:bg-teal-100"
                }`}
            >
              {opt.icon}
            </button>
          ))}
        </div>
      </div>

      {/* CROSS AXIS */}
      <div className="flex items-center gap-2">
        <span className="text-[9px] font-black uppercase text-indigo-600 w-20">
          Cross Axis
        </span>
        <div className="flex gap-1">
          {crossAxisOptions.map(opt => (
            <button
              key={opt.id}
              onClick={() => updateLayout({ crossAxisAlignment: opt.id })}
              title={opt.label}
              className={`p-2 rounded-lg ${crossAxis === opt.id
                ? "bg-indigo-500 text-white"
                : "text-slate-600 hover:bg-indigo-100"
                }`}
            >
              {opt.icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
