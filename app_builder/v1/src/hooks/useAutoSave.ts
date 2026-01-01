// src/hooks/useAutoSave.ts
import { useEffect, useRef } from "react";
import { useUniversalBuilder } from "../context/UniversalBuilderContext";
import { toFlutterSchema } from "../utils/schema-transformer";

export function useAutoSave(appId: string | null) {
  const { screens } = useUniversalBuilder();
  const timerRef = useRef< null>(null);
  const lastSavedRef = useRef<string>("");
  const isSavingRef = useRef(false);

  useEffect(() => {
    if (!appId) return;

    // Clear existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Create hash to detect changes
    const currentHash = JSON.stringify(screens);

    // Skip if nothing changed or already saving
    if (currentHash === lastSavedRef.current || isSavingRef.current) {
      return;
    }

    // Debounce saves
    timerRef.current = setTimeout(async () => {
      if (isSavingRef.current) return;

      isSavingRef.current = true;

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("⚠️ No auth token - skipping autosave");
          isSavingRef.current = false;
          return;
        }

        // Transform to Flutter format
        const flutterSchema = toFlutterSchema(screens);

        const response = await fetch(`/api/apps/${appId}/draft`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ schema: flutterSchema }),
        });

        if (!response.ok) {
          throw new Error(`Save failed: ${response.statusText}`);
        }

        lastSavedRef.current = currentHash;
        console.log("✅ Draft saved successfully");
      } catch (err) {
        console.error("❌ Auto-save failed:", err);
      } finally {
        isSavingRef.current = false;
      }
    }, 2000); // 2 second debounce

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [screens, appId]);
}

