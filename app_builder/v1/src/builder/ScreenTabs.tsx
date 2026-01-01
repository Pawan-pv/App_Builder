import React from "react";
import { useUniversalBuilder } from "../context/UniversalBuilderContext";
import { Plus, X } from "lucide-react";

export function ScreenTabs() {
  const {
    screens,
    activeScreenId,
    setActiveScreen,
    addScreen,
    setScreens,
  } = useUniversalBuilder();

  /* ─────────────────────────────
     ADD SCREEN
  ───────────────────────────── */

  const handleAddScreen = () => {
    const name = `Screen ${screens.length + 1}`;

    // addScreen MUST return generated ID (as per your builder design)
    const newId = addScreen(name);

    if (newId) {
      setActiveScreen(newId);
    }
  };

  /* ─────────────────────────────
     DELETE SCREEN
  ───────────────────────────── */

  const handleDeleteScreen = (
    e: React.MouseEvent,
    id: string
  ) => {
    e.stopPropagation();

    // 🚫 Always keep at least one screen
    if (screens.length <= 1) return;

    setScreens((prev) => {
      const remaining = prev.filter((s) => s.id !== id);

      // if active screen removed → fallback safely
      if (activeScreenId === id && remaining.length > 0) {
        setActiveScreen(remaining[0].id);
      }

      return remaining;
    });
  };

  /* ─────────────────────────────
     RENDER
  ───────────────────────────── */

  return (
    <div className="flex items-center gap-2 border-b bg-white px-4 py-2 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-2">
        {screens.map((screen) => {
          const isActive = activeScreenId === screen.id;

          return (
            <div
              key={screen.id}
              onClick={() => setActiveScreen(screen.id)}
              className={`group relative flex items-center gap-2 px-4 py-2 
                text-[10px] font-black uppercase tracking-wider 
                rounded-xl cursor-pointer transition-all whitespace-nowrap border
                ${
                  isActive
                    ? "bg-teal-500 text-white border-teal-600 shadow-sm"
                    : "bg-slate-50 text-slate-500 hover:bg-slate-100 border-slate-200"
                }`}
            >
              {screen.name}

              {screens.length > 1 && (
                <button
                  onClick={(e) =>
                    handleDeleteScreen(e, screen.id)
                  }
                  className={`ml-1 p-0.5 rounded-md transition-colors
                    ${
                      isActive
                        ? "text-white/70 hover:bg-white/20"
                        : "text-slate-400 hover:bg-black/10"
                    }`}
                  title="Delete Screen"
                >
                  <X size={10} strokeWidth={3} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* ADD SCREEN BUTTON */}
      <button
        onClick={handleAddScreen}
        className="ml-4 p-2 text-teal-600 bg-teal-50 hover:bg-teal-100 
          border border-teal-200 rounded-xl transition-all 
          flex items-center justify-center"
        title="Add New Screen"
      >
        <Plus size={16} strokeWidth={3} />
      </button>
    </div>
  );
}
