import React, { useEffect, useRef, useState, useCallback } from "react";
import type { Widget } from "../types";
import { useUniversalBuilder } from "../context/UniversalBuilderContext";
import { executeActions } from "../runTimeEngine/actionExecutor";
import { evaluateActionCondition } from "../runTimeEngine/conditionEvaluator";
import { resolveBinding } from "../runTimeEngine/bindingResolver";
import {
  setRuntimeValue,
  getRuntimeValue,
  getFormError,
} from "../runTimeEngine/runTimeStore";
import { theme } from "../theme";
import { clsx } from "clsx";

/* ─────────────────────────────────────────────
   WIDGET RENDERER
───────────────────────────────────────────── */

export function WidgetRenderer({
  widget,
  screenId,
  parentId,
}: {
  widget: Widget;
  screenId: string;
  parentId?: string;
}) {
  const {
    selectedWidgetId,
    setSelectedWidget,
    updateWidgetProps,
    zoom,
    setActiveScreen,
  } = useUniversalBuilder();

  const widgetRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);
  const dragMovedRef = useRef(false);

  const [isDragging, setIsDragging] = useState(false);

  const { id, type, props, meta } = widget;

  const isSelected = selectedWidgetId === id;
  const isRoot = !parentId;
  const isFlex = type === "Column" || type === "Row";

  const canResizeWidth = type !== "Text";
  const canResizeHeight = [
    "Image",
    "Container",
    "Column",
    "Row",
    "ListView",
  ].includes(type);

  /* ─────────────────────────────────────────────
     CONDITIONAL VISIBILITY
  ───────────────────────────────────────────── */

  const isVisible = meta?.condition
    ? evaluateActionCondition(meta.condition, {})
    : true;

  if (meta?.isHidden || !isVisible) return null;

  /* ─────────────────────────────────────────────
     ACTIONS
  ───────────────────────────────────────────── */

  const runActions = useCallback(
    (trigger: "onTap" | "onLoad" | "onSubmit") => {
      executeActions(
        props.actions?.filter((a) => a.trigger === trigger),
        {
          navigate: (screen) => screen && setActiveScreen(screen),
        },
        {}
      );
    },
    [props.actions, setActiveScreen]
  );

  useEffect(() => {
    if (!loadedRef.current) {
      loadedRef.current = true;
      runActions("onLoad");
    }
  }, [runActions]);

  /* ─────────────────────────────────────────────
     DRAG (ROOT ONLY)
  ───────────────────────────────────────────── */

  const startDrag = (e: React.MouseEvent) => {
    if (!isRoot || e.button !== 0 || !widgetRef.current) return;

    e.stopPropagation();
    dragMovedRef.current = false;

    const startX = props.layout?.x ?? 0;
    const startY = props.layout?.y ?? 0;
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const onMove = (ev: MouseEvent) => {
      const dx = (ev.clientX - mouseX) / zoom;
      const dy = (ev.clientY - mouseY) / zoom;

      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
        dragMovedRef.current = true;
        setIsDragging(true);
      }

      updateWidgetProps(screenId, id, {
        props: {
          layout: {
            ...props.layout,
            position: "absolute",
            x: startX + dx,
            y: startY + dy,
          },
        },
      });
    };

    const onUp = () => {
      setIsDragging(false);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  /* ─────────────────────────────────────────────
     RESIZE
  ───────────────────────────────────────────── */

  const startResize = (e: React.MouseEvent, dir: "right" | "bottom") => {
    e.preventDefault();
    e.stopPropagation();
    if (!widgetRef.current) return;

    const rect = widgetRef.current.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;

    const baseW =
      typeof props.layout?.width === "number"
        ? props.layout.width
        : rect.width;

    const baseH =
      typeof props.layout?.height === "number"
        ? props.layout.height
        : rect.height;

    const onMove = (ev: MouseEvent) => {
      const dx = (ev.clientX - startX) / zoom;
      const dy = (ev.clientY - startY) / zoom;

      updateWidgetProps(screenId, id, {
        props: {
          layout: {
            ...props.layout,
            width: dir === "right" ? Math.max(32, baseW + dx) : baseW,
            height: dir === "bottom" ? Math.max(24, baseH + dy) : baseH,
            widthMode: "fixed",
            heightMode: "fixed",
          },
        },
      });
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  /* ─────────────────────────────────────────────
     STYLES
  ───────────────────────────────────────────── */

  const style: React.CSSProperties = {
    position: isRoot ? "absolute" : "relative",
    left: isRoot ? props.layout?.x ?? 0 : undefined,
    top: isRoot ? props.layout?.y ?? 0 : undefined,

    width:
      props.layout?.widthMode === "fixed" ? props.layout.width : undefined,
    height:
      props.layout?.heightMode === "fixed" ? props.layout.height : undefined,

    minWidth: 32,
    minHeight: 24,

    display: isFlex ? "flex" : "block",
    flexDirection: type === "Column" ? "column" : "row",
    gap: props.layout?.gap,

    justifyContent: mapMainAlign(props.layout?.mainAxisAlignment),
    alignItems: mapCrossAlign(props.layout?.crossAxisAlignment),
    alignSelf: mapCrossAlign(props.layout?.selfAlignment),

    color: resolveColor(props.style?.color),
    backgroundColor: resolveColor(props.style?.backgroundColor),
  };

  /* ─────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────── */

  return (
    <div
      ref={widgetRef}
      className={clsx(
        "group relative border rounded-xl transition-all",
        isSelected && "ring-2 ring-teal-500",
        isDragging && "cursor-grabbing"
      )}
      style={style}
      onMouseDown={startDrag}
      onClick={(e) => {
        e.stopPropagation();
        if (dragMovedRef.current) return;
        setSelectedWidget(id);
        runActions("onTap");
      }}
    >
      {renderContent(widget, screenId)}

      {isSelected && !isDragging && (
        <>
          {canResizeWidth && (
            <div
              onMouseDown={(e) => startResize(e, "right")}
              className="absolute -right-2 top-1/2 h-10 w-3 cursor-ew-resize bg-slate-700 rounded"
            />
          )}
          {canResizeHeight && (
            <div
              onMouseDown={(e) => startResize(e, "bottom")}
              className="absolute -bottom-2 left-1/2 w-10 h-3 cursor-ns-resize bg-slate-700 rounded"
            />
          )}
        </>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   CONTENT RENDERER
───────────────────────────────────────────── */

function renderContent(widget: Widget, screenId: string) {
  const { type, children, props } = widget;

  /* ---------- CONTAINERS ---------- */

  if (type === "Container" || type === "Column" || type === "Row") {
    return children?.length ? (
      children.map((c) => (
        <WidgetRenderer
          key={c.id}
          widget={c}
          screenId={screenId}
          parentId={widget.id}
        />
      ))
    ) : (
      <span className="text-xs text-slate-400">Drop children</span>
    );
  }

  /* ---------- INPUT ---------- */

  if (type === "Input") {
    const fieldName = props.formField?.name;

    return (
      <div className="space-y-1">
        <input
          className="w-full border rounded p-2 text-sm"
          placeholder={widget.label}
          value={fieldName ? getRuntimeValue(fieldName) ?? "" : ""}
          onChange={(e) => {
            if (!fieldName) return;
            setRuntimeValue(fieldName, e.target.value);
          }}
        />

        {fieldName && getFormError(fieldName) && (
          <p className="text-xs text-red-500">{getFormError(fieldName)}</p>
        )}
      </div>
    );
  }

  /* ---------- TEXT ---------- */

  if (type === "Text") {
    const text = resolveBinding(props.content?.text);
    return <p>{String(text ?? "")}</p>;
  }

  /* ---------- LIST VIEW (FIXED) ---------- */

  if (type === "ListView") {
    const list = resolveBinding(props.content?.dataSource);

    if (!Array.isArray(list)) {
      return <div className="text-xs text-slate-400">Bind a list</div>;
    }

    if (!props.itemTemplate) {
      return <div className="text-xs text-red-400">Missing item template</div>;
    }

    return (
      <div className="flex flex-col gap-2">
        {list.map((_, i) => {
          const template = props.itemTemplate!;
          const itemWidget: Widget = {
            id: `${widget.id}-${i}`,
            type: template.type,
            label: template.label,
            props: template.props,
            children: template.children,
            workflow: template.workflow,
            meta: template.meta,
          };

          return (
            <WidgetRenderer
              key={itemWidget.id}
              widget={itemWidget}
              screenId={screenId}
              parentId={widget.id}
            />
          );
        })}
      </div>
    );
  }

  return <div>{type}</div>;
}

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */

function resolveColor(value?: string) {
  if (!value) return undefined;
  if (value.startsWith("theme.")) {
    return theme.colors[value.replace("theme.", "") as keyof typeof theme.colors];
  }
  return value;
}

function mapMainAlign(a?: string) {
  return (
    {
      center: "center",
      end: "flex-end",
      spaceBetween: "space-between",
      spaceAround: "space-around",
    }[a ?? ""] || "flex-start"
  );
}

function mapCrossAlign(a?: string) {
  return (
    {
      center: "center",
      end: "flex-end",
      stretch: "stretch",
    }[a ?? ""] || "flex-start"
  );
}
