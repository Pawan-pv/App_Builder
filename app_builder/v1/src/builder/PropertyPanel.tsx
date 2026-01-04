import { useState } from "react";
import type { Node, Edge } from "reactflow";
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
} from "lucide-react";
import { isWorkflowValid } from "../workflow/isWorkflowValid";


import { AlignToolbar } from "./AlignToolbar";
import { WorkflowEditor } from "../workflow/WorkflowEditor";
import { compileWorkflow } from "../workflow/compiler";

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
    screens,
  } = useUniversalBuilder();


  const [activeTab, setActiveTab] = useState<
    "content" | "style" | "actions" | "flow"
  >("content");


  if (!selectedWidget) {
    return (
      <aside className="w-72 border-l bg-white flex items-center justify-center opacity-40">
        <p className="text-xs uppercase">Select an element</p>
      </aside>
    );
  }

  const padding = normalizePadding(selectedWidget.props.layout?.padding);
  const actions: WidgetAction[] = selectedWidget.props.actions ?? [];
  const style = selectedWidget.props.style ?? {};

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
      props: { style: { ...style, ...patch } },
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


  return (
    <>
      {/* ───────── PROPERTY PANEL ───────── */}
      <aside
        data-testid="property-panel"
        className="w-72 border-l bg-white flex flex-col h-full overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 border-b flex justify-between shrink-0">
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

        {/* Tabs */}
        <div className="flex border-b shrink-0">
          {(["content", "style", "actions", "flow"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              aria-label={`${t} tab`}
              className={`flex-1 py-3 flex justify-center border-b-2 transition-all ${activeTab === t
                ? "border-teal-500 text-teal-600 bg-teal-50/30"
                : "border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                }`}
            >
              {t === "content" && <Type size={16} />}
              {t === "style" && <Palette size={16} />}
              {t === "actions" && <Zap size={16} />}
              {t === "flow" && <GitBranch size={16} />}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {/* CONTENT TAB */}
          {activeTab === "content" && (
            <div className="space-y-6">
              <section className="space-y-2">
                <header className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  <Type size={12} /> Content Text
                </header>
                <textarea
                  className="w-full border rounded-xl p-3 text-xs focus:ring-2 focus:ring-teal-500 outline-none min-h-100px"
                  value={
                    typeof selectedWidget.props.content?.text === "string"
                      ? selectedWidget.props.content.text
                      : ""
                  }
                  onChange={(e) => updateContent({ text: e.target.value })}
                />
              </section>

              <section className="space-y-2">
                <header className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  <LayoutIcon size={12} /> Layout
                </header>
                <div className="grid grid-cols-2 gap-3">
                  {(["top", "right", "bottom", "left"] as const).map((side) => (
                    <div key={side}>
                      <p className="text-[9px] uppercase font-bold text-slate-400 mb-1">{side}</p>
                      <input
                        type="range"
                        min={0}
                        max={64}
                        value={padding[side]}
                        className="w-full accent-teal-500"
                        onChange={(e) =>
                          updateLayout({
                            padding: {
                              ...padding,
                              [side]: Number(e.target.value),
                            },
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <AlignToolbar />
                </div>
              </section>
            </div>
          )}

          {/* STYLE TAB */}
          {activeTab === "style" && (
            <div className="space-y-6">
              {/* Colors */}
              <section className="space-y-3">
                <header className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Colors</header>
                <div className="grid grid-cols-2 gap-3">
                  <label className="text-[10px] uppercase font-bold text-slate-500">
                    Text
                    <input
                      type="color"
                      value={style.color || "#000000"}
                      onChange={(e) => updateStyle({ color: e.target.value })}
                      className="w-full h-8 mt-1 rounded cursor-pointer border-none"
                    />
                  </label>
                  <label className="text-[10px] uppercase font-bold text-slate-500">
                    Background
                    <input
                      type="color"
                      value={style.backgroundColor || "#ffffff"}
                      onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
                      className="w-full h-8 mt-1 rounded cursor-pointer border-none"
                    />
                  </label>
                </div>
              </section>

              <section className="space-y-3">
                <header className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Borders</header>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Border Radius</p>
                    <input
                      type="range"
                      min={0}
                      max={40}
                      value={style.borderRadius ?? 0}
                      onChange={(e) => updateStyle({ borderRadius: Number(e.target.value) })}
                      className="w-full accent-teal-500"
                    />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Width</p>
                    <input
                      type="number"
                      value={style.borderWidth ?? 0}
                      onChange={(e) => updateStyle({ borderWidth: Number(e.target.value) })}
                      className="w-full border rounded p-1 text-xs"
                    />
                  </div>
                  <label className="text-[10px] uppercase font-bold text-slate-500">
                    Color
                    <input
                      type="color"
                      value={style.borderColor || "#000000"}
                      onChange={(e) => updateStyle({ borderColor: e.target.value })}
                      className="w-full h-8 mt-1 rounded border-none"
                    />
                  </label>
                </div>
              </section>

              <section className="space-y-3">
                <header className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Typography</header>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Size</p>
                    <input
                      type="number"
                      value={style.fontSize ?? 14}
                      onChange={(e) => updateStyle({ fontSize: Number(e.target.value) })}
                      className="w-full border rounded p-1 text-xs"
                    />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Weight</p>
                    <select
                      value={style.fontWeight ?? "normal"}
                      onChange={(e) => updateStyle({ fontWeight: e.target.value as any })}
                      className="w-full border rounded p-1 text-xs bg-white"
                    >
                      <option value="normal">Normal</option>
                      <option value="bold">Bold</option>
                      <option value="lighter">Light</option>
                    </select>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* ACTIONS TAB */}
          {activeTab === "actions" && (
            <div className="space-y-4">
              <header className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Quick Actions</span>
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
                  className="p-1.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </header>

              {actions.length === 0 && (
                <div className="py-12 text-center border-2 border-dashed rounded-2xl text-slate-400">
                  <Zap size={24} className="mx-auto mb-2 opacity-20" />
                  <p className="text-[10px] uppercase font-bold">No actions added</p>
                </div>
              )}

              {actions.map((action, idx) => (
                <div key={action.id} className="bg-slate-50 border rounded-2xl p-3 space-y-3 relative group">
                  <div className="flex gap-2">
                    <select
                      className="flex-1 border-none bg-white rounded-lg p-2 text-[10px] font-bold uppercase shadow-sm"
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
                      className="flex-1 border-none bg-white rounded-lg p-2 text-[10px] font-bold uppercase shadow-sm"
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
                    </select>
                  </div>

                  {action.type === "navigate" && (
                    <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                      <p className="text-[9px] uppercase font-black text-slate-400 mb-1 ml-1 tracking-wider">Target Screen</p>
                      <select
                        className="w-full border-none bg-teal-50 text-teal-700 rounded-lg p-2 text-xs font-bold shadow-inner"
                        value={action.config.targetScreenId ?? ""}
                        onChange={(e) => {
                          const copy = [...actions];
                          copy[idx].config = {
                            ...copy[idx].config,
                            targetScreenId: e.target.value || undefined,
                          };
                          updateActions(copy);
                        }}
                      >
                        <option value="">Select screen</option>
                        {screens.map((screen) => (
                          <option key={screen.id} value={screen.id}>
                            {screen.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <button
                    onClick={() => updateActions(actions.filter((_, i) => i !== idx))}
                    className="absolute -top-1 -right-1 bg-white border shadow-sm rounded-full p-1 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}

{/* FLOW TAB */}
{activeTab === "flow" && (
  <div className="h-full flex flex-col -mx-4 -mt-4">
    <div className="flex-1">
      <WorkflowEditor
        workflow={selectedWidget.workflow ?? { nodes: [], edges: [] }}
        widgetType={selectedWidget.type}
        onChange={(wf: { nodes: Node[]; edges: Edge[] }) => {
          if (!activeScreenId) return;
          updateWidgetProps(activeScreenId, selectedWidget.id, {
            workflow: wf,
          });
        }}
      />
    </div>

    {/* ───── Compile Section ───── */}
    <div className="p-3 bg-teal-50 border-t shrink-0">
      {selectedWidget.workflow &&
      !isWorkflowValid(
        selectedWidget.workflow.nodes,
        selectedWidget.workflow.edges
      ) ? (
        <p className="text-[10px] text-red-500 text-center mb-2 uppercase font-bold">
          Connect trigger to an action to compile
        </p>
      ) : null}

      <button
        data-testid="compile-workflow"
        disabled={
          !selectedWidget.workflow ||
          !isWorkflowValid(
            selectedWidget.workflow.nodes,
            selectedWidget.workflow.edges
          )
        }
        onClick={() => {
          if (!activeScreenId || !selectedWidget.workflow) return;

          const compiled = compileWorkflow(
            selectedWidget.workflow.nodes,
            selectedWidget.workflow.edges
          );

          updateWidgetProps(activeScreenId, selectedWidget.id, {
            props: { actions: compiled },
          });

          setActiveTab("actions");
        }}
        className={`
          w-full rounded-xl py-2 text-[10px] font-black uppercase tracking-widest
          transition-all shadow-lg
          ${
            selectedWidget.workflow &&
            isWorkflowValid(
              selectedWidget.workflow.nodes,
              selectedWidget.workflow.edges
            )
              ? "bg-teal-600 text-white hover:bg-teal-700 shadow-teal-500/20"
              : "bg-slate-300 text-slate-500 cursor-not-allowed"
          }
        `}
      >
        Compile to Actions
      </button>
    </div>
  </div>
)}

        </div>
      </aside>
    </>
  );
}





//TODO: Split PropertyPanel into tabs (Content / Style / Actions)