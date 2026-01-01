// ═══════════════════════════════════════════════════════
// src/hooks/useDraftLoader.ts
// ═══════════════════════════════════════════════════════

import { useEffect, useState } from "react";
import { useUniversalBuilder } from "../context/UniversalBuilderContext"
import { fromFlutterSchema } from "../utils/schema-transformer";

export function useDraftLoader(appId: string | null) {
  const { setScreens, setActiveScreen } = useUniversalBuilder();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!appId) {
      setIsLoading(false);
      return;
    }

    const loadDraft = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Not authenticated");
        }

        const response = await fetch(`/api/apps/${appId}/draft`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to load draft: ${response.statusText}`);
        }

        const { success, data } = await response.json();

        if (success && data) {
          const builderScreens = fromFlutterSchema(data);

          if (builderScreens.length > 0) {
            setScreens(builderScreens);

            const initialScreen =
              builderScreens.find((s) => s.isInitial) || builderScreens[0];
            setActiveScreen(initialScreen.id);

            console.log("✅ Draft loaded successfully");
          }
        }
      } catch (err: any) {
        console.error("❌ Failed to load draft:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadDraft();
  }, [appId, setScreens, setActiveScreen]);

  return { isLoading, error };
}