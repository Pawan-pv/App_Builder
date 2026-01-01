import type { ActionCondition, ConditionOperator } from "../types";

const OPERATORS: {
  value: ConditionOperator;
  label: string;
  needsRight: boolean;
}[] = [
  { value: "exists", label: "Exists", needsRight: false },
  { value: "equals", label: "Equals", needsRight: true },
  { value: "notEquals", label: "Not Equals", needsRight: true },
  { value: "greaterThan", label: "Greater Than", needsRight: true },
  { value: "lessThan", label: "Less Than", needsRight: true },
];

const DEFAULT_CONDITION: ActionCondition = {
  left: "",
  operator: "exists",
  right: undefined,
};

export function ConditionBuilder({
  value,
  onChange,
}: {
  value?: ActionCondition;
  onChange: (c?: ActionCondition) => void;
}) {
  const condition: ActionCondition = value ?? DEFAULT_CONDITION;

  const operatorMeta = OPERATORS.find(
    (o) => o.value === condition.operator
  );

  return (
    <div className="space-y-2 border rounded p-2 text-xs bg-slate-50">
      {/* LEFT OPERAND */}
      <input
        className="w-full border p-1"
        placeholder="Left operand (e.g. runtime.user.isLoggedIn)"
        value={condition.left}
        onChange={(e) =>
          onChange({
            ...condition,
            left: e.target.value,
          })
        }
      />

      {/* OPERATOR */}
      <select
        className="w-full border p-1"
        value={condition.operator}
        onChange={(e) =>
          onChange({
            ...condition,
            operator: e.target.value as ConditionOperator,
            right: undefined, // reset RHS safely
          })
        }
      >
        {OPERATORS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {/* RIGHT OPERAND */}
      {operatorMeta?.needsRight && (
        <input
          className="w-full border p-1"
          placeholder="Right value (true, 10, admin)"
          value={condition.right ?? ""}
          onChange={(e) => {
            const raw = e.target.value;

            // 🔥 smart casting
            let parsed: any = raw;
            if (raw === "true") parsed = true;
            else if (raw === "false") parsed = false;
            else if (!isNaN(Number(raw))) parsed = Number(raw);

            onChange({
              ...condition,
              right: parsed,
            });
          }}
        />
      )}

      {/* REMOVE */}
      <button
        type="button"
        className="text-red-500 text-xs"
        onClick={() => onChange(undefined)}
      >
        Remove Condition
      </button>
    </div>
  );
}
