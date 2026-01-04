// src/builder/ScreenContentEditor.tsx
import React, { useState } from "react";
import { clsx } from "clsx";
import type { Widget, WidgetType } from "../types";
import { useUniversalBuilder } from "../context/UniversalBuilderContext";
import { WidgetRenderer } from "./WidgetRenderer";

/* =================================================
   SCREEN CONTENT EDITOR
================================================= */

export function ScreenContentEditor({ screenId }: { screenId: string }) {
  const {
    screens,
    deviceType,
    setSelectedWidget,
    addWidget,
  } = useUniversalBuilder();

  const [isOverRoot, setIsOverRoot] = useState(false);

  const screen = screens.find((s) => s.id === screenId);
  if (!screen) return null;

  const dims = {
    iphone: { width: 375, height: 812 },
    pixel: { width: 411, height: 891 },
    tablet: { width: 768, height: 1024 },
  };

  const { width, height } =
    dims[deviceType as keyof typeof dims] ?? dims.iphone;

  /* ---------- ROOT DROP ---------- */

  const handleRootDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation(); // ← CRITICAL: Prevent double-firing
    setIsOverRoot(false);

    const type = e.dataTransfer.getData("widgetType") as WidgetType | "";
    const draggedId = e.dataTransfer.getData("draggedWidgetId");

    // ❌ prevent reorder at root level
    if (draggedId) return;

    if (type) {
      addWidget(screenId, type, null);
    }
  };
  return (
    <div
      className={clsx(
        "bg-white shadow-2xl relative transition-all duration-300 border-4 mx-auto",
        isOverRoot
          ? "border-teal-400 bg-teal-50/10"
          : "border-transparent"
      )}
      style={{ width, height, borderRadius: 40 }}
      data-testid="phone-canvas"
      onClick={() => setSelectedWidget(null)}
      onDragOver={(e) => {
        e.preventDefault();
        setIsOverRoot(true);
      }}
      onDragLeave={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        if (
          e.clientX < rect.left ||
          e.clientX >= rect.right ||
          e.clientY < rect.top ||
          e.clientY >= rect.bottom
        ) {
          setIsOverRoot(false);
        }
      }}
      onDrop={handleRootDrop}
    >
      {/* Phone notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-50" />

      {/* 
        INNER SCROLL CONTAINER
        ----------------------
        IMPORTANT:
        This div is the actual drop target under the cursor.
        We must allow dragover + drop here, otherwise React
        will ignore the drop (HTML5 DnD rule).
      */}
      <div
        data-testid="phone-canvas-inner"
        className="w-full h-full flex flex-col pt-12 pb-10 px-4 overflow-y-auto scrollbar-hide"
        onDragOver={(e) => {
          // REQUIRED: allow HTML5 drop on this element
          e.preventDefault();
          setIsOverRoot(true);
        }}
        onDrop={handleRootDrop} // forward to same root handler
      >
        {screen.widgets.map((widget, index) => (
          <WidgetWrapper
            key={widget.id}
            widget={widget}
            screenId={screenId}
            index={index}
          />
        ))}

        {screen.widgets.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-3xl">
            <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest">
              Drop Widget Here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* =================================================
   WIDGET WRAPPER (DRAG / DROP / REORDER)
================================================= */

function WidgetWrapper({
  widget,
  screenId,
  index,
}: {
  widget: Widget;
  screenId: string;
  index: number;
}) {
  const { addWidget, reorderWidget } = useUniversalBuilder();

  const [dropSide, setDropSide] = useState<"top" | "bottom" | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  /* ---------- DRAG OVER ---------- */

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();
    const relativeY = e.clientY - rect.top;
    setDropSide(relativeY < rect.height / 2 ? "top" : "bottom");
  };

  /* ---------- DROP ---------- */

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const newType = e.dataTransfer.getData("widgetType");
    const draggedId = e.dataTransfer.getData("draggedWidgetId");

    const targetIndex = dropSide === "bottom" ? index + 1 : index;
    setDropSide(null);

    if (newType) {
      addWidget(screenId, newType as WidgetType, null, targetIndex);
    } else if (draggedId) {
      reorderWidget(screenId, null, draggedId, targetIndex);
    }
  };

  /* ---------- DRAG START ---------- */

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("draggedWidgetId", widget.id);
    e.dataTransfer.effectAllowed = "move";
    setIsDragging(true);

    // Custom drag preview
    if (e.currentTarget instanceof HTMLElement) {
      const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
      dragImage.style.opacity = "0.8";
      dragImage.style.position = "absolute";
      dragImage.style.top = "-1000px";
      document.body.appendChild(dragImage);
      e.dataTransfer.setDragImage(dragImage, 0, 0);
      setTimeout(() => document.body.removeChild(dragImage), 0);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDropSide(null);
  };

  return (
    <div
      className={clsx(
        "relative transition-all duration-150",
        isDragging && "opacity-30 scale-95"
      )}
      onDragOver={handleDragOver}
      onDragLeave={() => setDropSide(null)}
      onDrop={handleDrop}
    >
      {/* Drop indicator */}
      {dropSide && !isDragging && (
        <div
          className={clsx(
            "absolute left-0 right-0 h-1 bg-teal-500 z-60 rounded-full shadow-lg",
            "before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-3 before:h-3 before:bg-teal-500 before:rounded-full",
            "after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:w-3 after:h-3 after:bg-teal-500 after:rounded-full",
            dropSide === "top" ? "-top-2" : "-bottom-2"
          )}
        />
      )}

      <div
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        className="cursor-move"
      >
        <WidgetRenderer widget={widget} screenId={screenId} />
      </div>
    </div>
  );
}
