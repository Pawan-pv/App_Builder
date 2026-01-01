// src/builder/BuilderPage.tsx
import { useState } from "react";
import {
  Layout,
  Plus,
  Bug,
  Play,
} from "lucide-react";

import { useUniversalBuilder } from "../context/UniversalBuilderContext";
import { Canvas } from "./Canvas";
import { ComponentPalette } from "./ComponentPalette";
import { ScreenTabs } from "./ScreenTabs";
import { PropertyPanel } from "./PropertyPanel";
import { Preview } from "./Preview";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { ActionDebugger } from "../runTimeEngine/ActionDebugger";

export default function BuilderPage() {
  const {
    screens,
    activeScreenId,
    setActiveScreen,
    addScreen,
  } = useUniversalBuilder();

  const [showDebugger, setShowDebugger] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useKeyboardShortcuts();

  const activeScreen = screens.find((s) => s.id === activeScreenId);

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden font-sans text-slate-900">
      {/* ───────────────── LEFT SIDEBAR ───────────────── */}
      <aside className="w-64 border-r bg-white flex flex-col z-30 shadow-xl h-full">
        {/* Logo */}
        <div className="p-6 border-b font-black text-teal-600 flex items-center gap-2 tracking-tighter text-xl shrink-0">
          <div className="w-8 h-8 bg-teal-600 rounded-xl flex items-center justify-center text-white">
            <Layout size={18} />
          </div>
          FlowStudio
        </div>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          {/* Screens */}
          <div className="p-4">
            <div className="flex justify-between items-center mb-4 px-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                App Screens
              </span>

              <button
                onClick={() => {
                  const id = addScreen(`Screen ${screens.length + 1}`);
                  setActiveScreen(id);
                }}
                className="p-1 text-teal-600"
              >
                <Plus size={18} />
              </button>
            </div>

            {screens.map((screen) => (
              <button
                key={screen.id}
                onClick={() => setActiveScreen(screen.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-bold mb-1 transition-all ${activeScreenId === screen.id
                  ? "bg-teal-600 text-white shadow-lg"
                  : "text-slate-500 hover:bg-slate-50"
                  }`}
              >
                <Layout size={14} />
                {screen.name}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t mx-4 my-2" />

          {/* Component Palette */}
          <div className="flex-1">
            <ComponentPalette />
          </div>
        </div>
      </aside>


      {/* ───────────────── CENTER SECTION ───────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Screen Tabs */}
        <ScreenTabs />

        {/* Canvas */}
        <Canvas />
      </div>

      {/* ───────────────── RIGHT PROPERTIES ───────────────── */}
      <PropertyPanel />

      {/* ───────────────── DEBUG TOGGLE ───────────────── */}
      <button
        onClick={() => setShowDebugger((v) => !v)}
        className={`fixed bottom-4 left-4 z-50 flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-xl border shadow-lg transition-all ${showDebugger
          ? "bg-black text-green-400 border-green-500"
          : "bg-white text-slate-600 border-slate-300"
          }`}
      >
        <Bug size={14} />
        Debug
      </button>

      {/* ───────────────── ACTION DEBUGGER ───────────────── */}
      {showDebugger && <ActionDebugger />}

      {/* ───────────────── PREVIEW TOGGLE ───────────────── */}
      <button
        onClick={() => setShowPreview((v) => !v)}
        className={`fixed bottom-4 left-24 z-50 flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-xl border shadow-lg transition-all ${showPreview
          ? "bg-teal-600 text-white border-teal-700"
          : "bg-white text-slate-600 border-slate-300"
          }`}
      >
        <Play size={14} />
        Preview
      </button>

      {/* ───────────────── PREVIEW PANEL ───────────────── */}
      {showPreview && (
        <div className="fixed inset-y-0 right-0 w-96 z-40 shadow-2xl">
          <Preview />
        </div>
      )}
    </div>
  );
}
