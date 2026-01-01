import { setFormError, clearFormErrors, getRuntimeValue } from "./runTimeStore";
import type { ValidationRule } from "../types";

export function validateField(
  name: string,
  value: any,
  rules: ValidationRule[] = []
): boolean {
  for (const rule of rules) {
    if (rule.type === "required") {
      if (!value) {
        setFormError(name, rule.message ?? "Required");
        return false;
      }
    }

    if (rule.type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setFormError(name, rule.message ?? "Invalid email");
        return false;
      }
    }

    if (rule.type === "minLength") {
      if (!value || value.length < rule.value) {
        setFormError(
          name,
          rule.message ?? `Minimum ${rule.value} characters`
        );
        return false;
      }
    }

    if (rule.type === "regex") {
      if (!new RegExp(rule.value).test(value)) {
        setFormError(name, rule.message ?? "Invalid format");
        return false;
      }
    }
  }

  return true;
}

export function validateForm(fields: {
  name: string;
  rules?: ValidationRule[];
}[]) {
  clearFormErrors();

  return fields.every(f =>
    validateField(f.name, getRuntimeValue(f.name), f.rules)
  );
}
