// c:\my-project\soft-projects\app_builder\v1\src\hooks\useKeyboardShortcuts.ts
import { useEffect, useCallback } from "react";
import { useUniversalBuilder } from "../context/UniversalBuilderContext";

export function useKeyboardShortcuts() {
  const { 
    selectedWidgetId, 
    activeScreenId, 
    deleteWidget, 
    setSelectedWidget 
  } = useUniversalBuilder();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // 1. Delete Selection
      if ((e.key === "Delete" || e.key === "Backspace") && selectedWidgetId && activeScreenId) {
        // Prevent backspace from navigating back in the browser
        if ((e.target as HTMLElement).tagName !== "INPUT" && (e.target as HTMLElement).tagName !== "TEXTAREA") {
          e.preventDefault();
          deleteWidget(activeScreenId, selectedWidgetId);
        }
      }

      // 2. Escape to deselect
      if (e.key === "Escape") {
        setSelectedWidget(null);
      }
    },
    [selectedWidgetId, activeScreenId, deleteWidget, setSelectedWidget]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
} 