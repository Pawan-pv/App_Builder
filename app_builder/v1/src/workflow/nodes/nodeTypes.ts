import { TriggerNode } from "./TriggerNode";
import { ActionNode } from "./ActionNode";
import { ConditionNode } from "./ConditionNode";

export const nodeTypes = {
  trigger: TriggerNode,
  api: ActionNode,
  validate: ActionNode,
  navigate: ActionNode,
  alert: ActionNode,
  condition: ConditionNode,
};
