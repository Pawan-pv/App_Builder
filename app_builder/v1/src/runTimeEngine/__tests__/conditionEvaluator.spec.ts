import { describe, it, expect } from "vitest";
import type { ActionCondition } from "../../types";
import { evaluateActionCondition } from "../conditionEvaluator";

describe("conditionEvaluator", () => {
  const runtime = {
    user: {
      isLoggedIn: true,
      age: 25,
      role: "admin",
    },
    value: 10,
  };

  it("returns true for exists when value is present", () => {
    const condition: ActionCondition = {
      left: "user.isLoggedIn",
      operator: "exists",
    };

    expect(evaluateActionCondition(condition, runtime)).toBe(true);
  });

  it("returns false for exists when value is missing", () => {
    const condition: ActionCondition = {
      left: "user.unknown",
      operator: "exists",
    };

    expect(evaluateActionCondition(condition, runtime)).toBe(false);
  });

  it("evaluates equals correctly", () => {
    const condition: ActionCondition = {
      left: "user.role",
      operator: "equals",
      right: "admin",
    };

    expect(evaluateActionCondition(condition, runtime)).toBe(true);
  });

  it("evaluates notEquals correctly", () => {
    const condition: ActionCondition = {
      left: "user.role",
      operator: "notEquals",
      right: "guest",
    };

    expect(evaluateActionCondition(condition, runtime)).toBe(true);
  });

  it("evaluates greaterThan correctly", () => {
    const condition: ActionCondition = {
      left: "user.age",
      operator: "greaterThan",
      right: 18,
    };

    expect(evaluateActionCondition(condition, runtime)).toBe(true);
  });

  it("evaluates lessThan correctly", () => {
    const condition: ActionCondition = {
      left: "value",
      operator: "lessThan",
      right: 20,
    };

    expect(evaluateActionCondition(condition, runtime)).toBe(true);
  });

  it("returns false for invalid left path", () => {
    const condition: ActionCondition = {
      left: "non.existing.path",
      operator: "equals",
      right: 10,
    };

    expect(evaluateActionCondition(condition, runtime)).toBe(false);
  });

  it("never throws on malformed condition", () => {
    const badCondition = {
      left: "",
      operator: "equals",
    } as any;

    expect(() =>
      evaluateActionCondition(badCondition, runtime)
    ).not.toThrow();
  });
});
