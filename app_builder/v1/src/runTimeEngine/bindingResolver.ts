import { getRuntimeState } from "./runTimeStore";

export function resolveBinding(value: any) {
  if (!value) return value;

  if (typeof value === "object" && value.type === "dynamic") {
    try {
      return Function(
        "runtime",
        `return ${value.expression}`
      )(getRuntimeState());
    } catch (err) {
      console.error("Binding error:", err);
      return undefined;
    }
  }

  return value;
}
