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
     DRAG
  ───────────────────────────────────────────── */

  const startDrag = (e: React.MouseEvent) => {
    if (e.button !== 0 || !widgetRef.current) return;

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
     RESIZE (4 CORNERS)
  ───────────────────────────────────────────── */

  const startResize = (
    e: React.MouseEvent,
    dir: "nw" | "ne" | "sw" | "se"
  ) => {
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

    const baseX = props.layout?.x ?? 0;
    const baseY = props.layout?.y ?? 0;

    const onMove = (ev: MouseEvent) => {
      const dx = (ev.clientX - startX) / zoom;
      const dy = (ev.clientY - startY) / zoom;

      let width = baseW;
      let height = baseH;
      let x = baseX;
      let y = baseY;

      if (dir.includes("e")) width = Math.max(32, baseW + dx);
      if (dir.includes("s")) height = Math.max(24, baseH + dy);

      if (dir.includes("w")) {
        width = Math.max(32, baseW - dx);
        x = baseX + dx;
      }

      if (dir.includes("n")) {
        height = Math.max(24, baseH - dy);
        y = baseY + dy;
      }

      updateWidgetProps(screenId, id, {
        props: {
          layout: {
            ...props.layout,
            position: "absolute",
            width,
            height,
            x,
            y,
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

  const containerStyle: React.CSSProperties = {
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

    backgroundColor: resolveColor(props.style?.backgroundColor),
    borderColor: resolveColor(props.style?.borderColor),
    borderWidth: props.style?.borderWidth,
    borderStyle: props.style?.borderStyle,
    borderRadius: props.style?.borderRadius,
    boxShadow: props.style?.boxShadow,
    opacity: props.style?.opacity,
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
      style={containerStyle}
      onMouseDown={startDrag}
      onClick={(e) => {
        e.stopPropagation();
        if (dragMovedRef.current) return;
        setSelectedWidget(id);
        runActions("onTap");
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        setSelectedWidget(id);
      }}
    >
      {renderContent(widget, screenId)}

      {isSelected && !isDragging && (
        <>
          {(["nw", "ne", "sw", "se"] as const).map((dir) => (
            <div
              key={dir}
              onMouseDown={(e) => startResize(e, dir)}
              className={clsx(
                "absolute w-3 h-3 bg-white border border-slate-700 rounded",
                dir === "nw" && "-top-1.5 -left-1.5 cursor-nw-resize",
                dir === "ne" && "-top-1.5 -right-1.5 cursor-ne-resize",
                dir === "sw" && "-bottom-1.5 -left-1.5 cursor-sw-resize",
                dir === "se" && "-bottom-1.5 -right-1.5 cursor-se-resize"
              )}
            />
          ))}
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

    const inputStyle: React.CSSProperties = {
      color: resolveColor(props.style?.color),
      fontSize: props.style?.fontSize,
      fontWeight: props.style?.fontWeight,
      fontStyle: props.style?.fontStyle,
      letterSpacing: props.style?.letterSpacing,
      textAlign: props.style?.textAlign,
      borderColor: resolveColor(props.style?.borderColor),
      borderWidth: props.style?.borderWidth,
      borderStyle: props.style?.borderStyle,
    };

    return (
      <div className="h-full w-full flex flex-col">
        <input
          className="flex-1 w-full rounded p-2 text-sm"
          style={inputStyle}
          placeholder={widget.label}
          value={fieldName ? getRuntimeValue(fieldName) ?? "" : ""}
          onChange={(e) => {
            if (!fieldName) return;
            setRuntimeValue(fieldName, e.target.value);
          }}
        />
        {fieldName && getFormError(fieldName) && (
          <p className="text-xs text-red-500 mt-1">
            {getFormError(fieldName)}
          </p>
        )}
      </div>
    );
  }

  /* ---------- TEXT ---------- */

  if (type === "Text") {
    const text = resolveBinding(props.content?.text);

    const textStyle: React.CSSProperties = {
      color: resolveColor(props.style?.color),
      fontSize: props.style?.fontSize,
      fontWeight: props.style?.fontWeight,
      fontStyle: props.style?.fontStyle,
      letterSpacing: props.style?.letterSpacing,
      textAlign: props.style?.textAlign,
    };

    return <p style={textStyle}>{String(text ?? "")}</p>;
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
