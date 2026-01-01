import type { ActionCondition } from "../types";

export function evaluateActionCondition(
  condition?: ActionCondition,
  context: Record<string, any> = {}
): boolean {
  if (!condition) return true;

  const leftValue = condition.left
    .split(".")
    .reduce((acc, k) => acc?.[k], context);

  switch (condition.operator) {
    case "exists":
      return leftValue !== undefined;

    case "equals":
      return leftValue === condition.right;

    case "notEquals":
      return leftValue !== condition.right;

    case "greaterThan":
      return leftValue > condition.right;

    case "lessThan":
      return leftValue < condition.right;

    default:
      return false;
  }
}
