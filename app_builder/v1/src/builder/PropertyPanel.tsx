import { useState } from "react";
import type { WidgetProps, WidgetAction } from "../types";
import { useUniversalBuilder } from "../context/UniversalBuilderContext";
import {
  Trash2,
  Type,
  Layout as LayoutIcon,
  Palette,
  Zap,
  Plus,
  GitBranch,
  Database,
} from "lucide-react";

import { ConditionBuilder } from "./ConditionBuilder";
import { AlignToolbar } from "./AlignToolbar";
import { RuntimeJsonExplorer } from "./RuntimeJsonExplorer";
import { WorkflowModal } from "../workflow/WorkflowModal";
import { compileWorkflow } from "../workflow/compiler";
import { getRuntimeState } from "../runTimeEngine/runTimeStore";

/* ---------------------------------
   Helpers
---------------------------------- */

function normalizePadding(
  padding?: number | { top?: number; right?: number; bottom?: number; left?: number }
) {
  if (typeof padding === "number") {
    return { top: padding, right: padding, bottom: padding, left: padding };
  }

  return {
    top: padding?.top ?? 0,
    right: padding?.right ?? 0,
    bottom: padding?.bottom ?? 0,
    left: padding?.left ?? 0,
  };
}

/* ---------------------------------
   Component
---------------------------------- */

export function PropertyPanel() {
  const {
    activeScreenId,
    selectedWidget,
    updateWidgetProps,
    deleteWidget,
  } = useUniversalBuilder();

  const [showWorkflow, setShowWorkflow] = useState(false);

  if (!selectedWidget) {
    return (
      <aside className="w-72 border-l bg-white flex items-center justify-center opacity-40">
        <p className="text-xs uppercase">Select an element</p>
      </aside>
    );
  }

  const padding = normalizePadding(selectedWidget.props.layout?.padding);
  const actions: WidgetAction[] = selectedWidget.props.actions ?? [];

  /* ---------- Update helpers ---------- */

  const updateLayout = (patch: Partial<WidgetProps["layout"]>) => {
    if (!activeScreenId) return;
    updateWidgetProps(activeScreenId, selectedWidget.id, {
      props: { layout: { ...selectedWidget.props.layout, ...patch } },
    });
  };

  const updateStyle = (patch: Partial<WidgetProps["style"]>) => {
    if (!activeScreenId) return;
    updateWidgetProps(activeScreenId, selectedWidget.id, {
      props: { style: { ...selectedWidget.props.style, ...patch } },
    });
  };

  const updateContent = (patch: Partial<WidgetProps["content"]>) => {
    if (!activeScreenId) return;
    updateWidgetProps(activeScreenId, selectedWidget.id, {
      props: { content: { ...selectedWidget.props.content, ...patch } },
    });
  };

  const updateActions = (next: WidgetAction[]) => {
    if (!activeScreenId) return;
    updateWidgetProps(activeScreenId, selectedWidget.id, {
      props: { actions: next },
    });
  };

  /* ---------- Workflow ---------- */

  const applyWorkflowActions = () => {
    if (!activeScreenId || !selectedWidget.workflow) return;

    const compiled = compileWorkflow(
      selectedWidget.workflow.nodes,
      selectedWidget.workflow.edges
    );

    updateWidgetProps(activeScreenId, selectedWidget.id, {
      props: { actions: compiled },
    });
  };

  return (
    <>
      {/* ───────── PROPERTY PANEL ───────── */}
      <aside className="w-72 border-l bg-white overflow-y-auto pb-20">
        {/* Header */}
        <div className="p-4 border-b flex justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase">Inspector</h3>
            <p className="text-[10px] text-teal-500 uppercase">
              {selectedWidget.type}
            </p>
          </div>

          <button
            onClick={() =>
              activeScreenId &&
              deleteWidget(activeScreenId, selectedWidget.id)
            }
            className="text-red-500"
          >
            <Trash2 size={14} />
          </button>
        </div>

        <div className="p-4 space-y-8">
          {/* CONTENT */}
          <section className="space-y-2">
            <header className="flex items-center gap-2 text-xs uppercase">
              <Type size={12} /> Content
            </header>

            <textarea
              className="w-full border rounded p-2 text-xs"
              value={
                typeof selectedWidget.props.content?.text === "string"
                  ? selectedWidget.props.content.text
                  : ""
              }
              onChange={(e) => updateContent({ text: e.target.value })}
            />
          </section>

          {/* STYLE */}
          <section className="space-y-2">
            <header className="flex items-center gap-2 text-xs uppercase">
              <Palette size={12} /> Style
            </header>

            <input
              type="color"
              value={selectedWidget.props.style?.color || "#000000"}
              onChange={(e) => updateStyle({ color: e.target.value })}
            />
          </section>

          {/* LAYOUT */}
          <section className="space-y-2">
            <header className="flex items-center gap-2 text-xs uppercase">
              <LayoutIcon size={12} /> Layout
            </header>

            <div className="grid grid-cols-2 gap-2">
              {(["top", "right", "bottom", "left"] as const).map((side) => (
                <input
                  key={side}
                  type="range"
                  min={0}
                  max={64}
                  value={padding[side]}
                  onChange={(e) =>
                    updateLayout({
                      padding: {
                        ...padding,
                        [side]: Number(e.target.value),
                      },
                    })
                  }
                />
              ))}
            </div>

            {/* Alignment (for Column/Row) */}
            <AlignToolbar />
          </section>

          {/* DATA BINDINGS */}
          <section className="space-y-2">
            <details className="text-xs">
              <summary className="flex items-center gap-2 cursor-pointer text-xs uppercase font-bold">
                <Database size={12} /> Data Bindings
              </summary>
              <div className="mt-2 p-2 bg-slate-50 rounded border max-h-40 overflow-auto">
                <RuntimeJsonExplorer
                  data={getRuntimeState()}
                  onSelect={(expr) => updateContent({ text: `{{${expr}}}` })}
                />
              </div>
            </details>
          </section>

          {/* ACTIONS */}
          <section className="space-y-3">
            <header className="flex items-center justify-between text-xs uppercase">
              <div className="flex items-center gap-2">
                <Zap size={12} /> Actions
              </div>

              <div className="flex gap-2">
                {/* EDIT WORKFLOW */}
                <button
                  className="text-[10px] px-2 py-1 border rounded flex items-center gap-1"
                  onClick={() => setShowWorkflow(true)}
                >
                  <GitBranch size={12} />
                  Edit Workflow
                </button>

                {/* APPLY */}
                <button
                  disabled={!selectedWidget.workflow}
                  className="text-[10px] px-2 py-1 border rounded text-teal-600 disabled:opacity-40"
                  onClick={applyWorkflowActions}
                >
                  Apply
                </button>

                {/* ADD MANUAL */}
                <button
                  onClick={() =>
                    updateActions([
                      ...actions,
                      {
                        id: crypto.randomUUID(),
                        trigger: "onTap",
                        type: "navigate",
                        config: {},
                      },
                    ])
                  }
                >
                  <Plus size={14} />
                </button>
              </div>
            </header>

            {actions.map((action, idx) => (
              <div key={action.id} className="border rounded p-2 space-y-2">
                <select
                  className="w-full border p-1 text-xs"
                  value={action.trigger}
                  onChange={(e) => {
                    const copy = [...actions];
                    copy[idx].trigger = e.target.value as any;
                    updateActions(copy);
                  }}
                >
                  <option value="onTap">On Tap</option>
                  <option value="onSubmit">On Submit</option>
                  <option value="onLoad">On Load</option>
                </select>

                <select
                  className="w-full border p-1 text-xs"
                  value={action.type}
                  onChange={(e) => {
                    const copy = [...actions];
                    copy[idx].type = e.target.value as any;
                    copy[idx].config = {};
                    updateActions(copy);
                  }}
                >
                  <option value="navigate">Navigate</option>
                  <option value="alert">Alert</option>
                  <option value="api">API</option>
                  <option value="submitForm">Submit Form</option>
                </select>

                <details className="text-xs">
                  <summary className="cursor-pointer text-slate-600">
                    Condition
                  </summary>

                  <ConditionBuilder
                    value={action.condition}
                    onChange={(cond) => {
                      const copy = [...actions];
                      copy[idx].condition = cond;
                      updateActions(copy);
                    }}
                  />
                </details>
              </div>
            ))}
          </section>
        </div>
      </aside>

      {/* ───────── WORKFLOW MODAL ───────── */}
      {showWorkflow && (
        <WorkflowModal
          workflow={selectedWidget.workflow}
          widgetType={selectedWidget.type}
          onChange={(wf) => {
            if (!activeScreenId) return;

            updateWidgetProps(activeScreenId, selectedWidget.id, {
              workflow: wf,
            });
          }}
          onClose={() => setShowWorkflow(false)}
        />
      )}
    </>
  );
}
