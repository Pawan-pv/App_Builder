import type { WidgetAction } from "../types";
import { evaluateActionCondition } from "./conditionEvaluator";
import { setRuntimeValue } from "./runTimeStore";
import { logAction } from "./debugStore";
import { validateForm } from "./formValidator";

type ActionHandlers = {
  navigate?: (screenId?: string) => void;
};

export async function executeActions(
  actions: WidgetAction[] = [],
  handlers: ActionHandlers = {},
  context: Record<string, any> = {}
) {
  for (const action of actions) {
    try {
      logAction({
        time: Date.now(),
        widgetId: action.id,
        actionType: action.type,
        payload: action,
      });

      // 🔥 IF / ELSE
      if (action.type === "if") {
        const result = evaluateActionCondition(action.condition, context);

        const branch = result ? action.then : action.else;
        if (branch?.length) {
          await executeActions(branch, handlers, context);
        }

        continue;
      }

      // 🔁 NORMAL ACTIONS
      switch (action.type) {
        case "submitForm": {
          const valid = validateForm(action.config?.fields || []);
          if (!valid) return;
          break;
        }

        case "api": {
          if (!action.config?.url) {
            throw new Error("API URL missing");
          }

          const res = await fetch(action.config.url, {
            method: action.config.method || "GET",
          });

          if (!res.ok) throw new Error("API failed");

          const data = await res.json();

          if (action.config.bindTo) {
            setRuntimeValue(action.config.bindTo, data);
            context[action.config.bindTo] = data;
          }
          break;
        }

        case "navigate": {
          handlers.navigate?.(action.config?.targetScreenId);
          break;
        }

        case "alert": {
          alert(action.config?.message ?? "");
          break;
        }
      }
    } catch (error) {
      logAction({
        time: Date.now(),
        widgetId: action.id,
        actionType: action.type,
        error,
      });
      return;
    }
  }
}
