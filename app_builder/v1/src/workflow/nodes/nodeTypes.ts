// Update src/workflow/nodes/nodeTypes.ts
import { TriggerNode } from "./TriggerNode";
import { ApiNode } from "./ApiNode";
import { ValidateNode } from "./ValidateNode";
import { NavigateNode } from "./NavigateNode";
import { AlertNode } from "./AlertNode";
import { ConditionNode } from "./ConditionNode";

export const nodeTypes = {
  trigger: TriggerNode,
  api: ApiNode,
  validate: ValidateNode,
  navigate: NavigateNode,
  alert: AlertNode,
  condition: ConditionNode,
};