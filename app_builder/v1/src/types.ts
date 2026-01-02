// src/types.ts
import type { Node, Edge } from "reactflow";

/* ─────────────────────────────────────────────
   ACTION SYSTEM
───────────────────────────────────────────── */

export type ActionTrigger = "onTap" | "onSubmit" | "onLoad";

export type ActionType =
  | "navigate"
  | "alert"
  | "api"
  | "submitForm"
  | "if";

export type ConditionOperator =
  | "equals"
  | "notEquals"
  | "exists"
  | "greaterThan"
  | "lessThan";

export interface ActionCondition {
  left: string;
  operator: ConditionOperator;
  right?: any;
}

export interface WidgetAction {
  id: string;
  trigger: ActionTrigger;
  type: ActionType;
  condition?: ActionCondition;
  config: {
    targetScreenId?: string;
    message?: string;
    url?: string;
    method?: "GET" | "POST";
    bindTo?: string;
    fields?: FormField[];
  };
  then?: WidgetAction[];
  else?: WidgetAction[];
}

/* ─────────────────────────────────────────────
   FORM VALIDATION
───────────────────────────────────────────── */

export type ValidationRule =
  | { type: "required"; message?: string }
  | { type: "email"; message?: string }
  | { type: "minLength"; value: number; message?: string }
  | { type: "regex"; value: string; message?: string };

export interface FormField {
  name: string;
  rules?: ValidationRule[];
}

/* ─────────────────────────────────────────────
   DATA BINDING
───────────────────────────────────────────── */

export type DataBinding =
  | { type: "static"; value: any }
  | {
    type: "dynamic";
    expression: string;
    scope?: "runtime" | "item" | "form";
  };

/* ─────────────────────────────────────────────
   WIDGET SYSTEM
───────────────────────────────────────────── */

export type DeviceType = "iphone" | "pixel" | "tablet";
export type SizeMode = "auto" | "fill" | "fixed";

export type WidgetType =
  | "Text"
  | "Button"
  | "Image"
  | "Input"
  | "Column"
  | "Row"
  | "Container"
  | "Card"
  | "ListView"
  | "GridView";

export const defaultSizeByType: Record<
  WidgetType,
  { w: number; h: number }
> = {
  Text: { w: 120, h: 32 },
  Button: { w: 140, h: 44 },
  Image: { w: 200, h: 120 },
  Input: { w: 200, h: 44 },
  Container: { w: 200, h: 120 },
  Column: { w: 240, h: 160 },
  Row: { w: 240, h: 80 },
  Card: { w: 260, h: 160 },
  ListView: { w: 260, h: 200 },
  GridView: { w: 260, h: 200 },
};

export interface WidgetProps {
  layout?: {
    position?: "auto" | "absolute";
    x?: number;
    y?: number;
    mainAxisAlignment?: string;
    crossAxisAlignment?: string;
    selfAlignment?: string;
    padding?:
    | number
    | { top?: number; right?: number; bottom?: number; left?: number };
    gap?: number;
    width?: number | string;
    height?: number | string;
    widthMode?: SizeMode;
    heightMode?: SizeMode;
    columns?: number;
  };

  style?: {
    /* Existing */
    color?: string;
    backgroundColor?: string;
    fontSize?: number;
    borderRadius?: number;
    imageUrl?: string;
    borderColor?: string;

    /* ✅ New */
    borderWidth?: number;
    borderStyle?: "solid" | "dashed" | "dotted" | "none";
    boxShadow?: string;
    opacity?: number; // 0 → 1
    fontWeight?: number | "normal" | "bold" | "lighter" | "bolder";
    textAlign?: "left" | "center" | "right" | "justify";
    fontStyle?: "normal" | "italic";
    letterSpacing?: number; // px
  };

  content?: {
    text?: string | DataBinding;
    dataSource?: string;
    navigateTo?: string;
    placeholder?: string;
    fieldName?: string;
    defaultValue?: string;
    type?: string;
  };

  formField?: FormField;
  actions?: WidgetAction[];
  itemTemplate?: Widget;
}

export interface Widget {
  id: string;
  type: WidgetType;
  label: string;
  props: WidgetProps;
  children?: Widget[];
  workflow?: {
    nodes: Node[];
    edges: Edge[];
  };
  meta?: {
    isHidden?: boolean;
    condition?: ActionCondition;
  };
}

/* ─────────────────────────────────────────────
   SCREEN
───────────────────────────────────────────── */

export interface Screen {
  id: string;
  name: string;
  position: { x: number; y: number };
  widgets: Widget[];
  isInitial?: boolean;
  isEnabled?: boolean;
}
