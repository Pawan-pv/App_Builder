import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useUniversalBuilder } from "../context/UniversalBuilderContext";
import type { Screen, Widget } from "../types";
import { defaultSizeByType } from "../types";
import { PhoneScreen } from "./PhoneScreen";
import { ZoomControls } from "./ZoomControls";

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */

type Connection = {
  from: { x: number; y: number };
  to: { x: number; y: number };
};

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */

function collectNavigationConnections(screens: Screen[]): Connection[] {
  const connections: Connection[] = [];

  const screenMap = new Map(screens.map((s) => [s.id, s]));

  function walkWidgets(
    widgets: Widget[],
    screen: Screen,
    parentOffset = { x: 0, y: 0 }
  ) {
    for (const widget of widgets) {
      const layout = widget.props.layout;
      const size = defaultSizeByType[widget.type] || { w: 100, h: 40 };

      const widgetX =
        screen.position.x +
        parentOffset.x +
        (typeof layout?.x === "number" ? layout.x : 0) +
        size.w / 2;

      const widgetY =
        screen.position.y +
        parentOffset.y +
        (typeof layout?.y === "number" ? layout.y : 0) +
        size.h / 2;

      // 🔗 Look for navigate actions
      const navigateActions =
        widget.props.actions?.filter(
          (a) => a.type === "navigate" && a.config?.targetScreenId
        ) ?? [];

      for (const action of navigateActions) {
        const target = screenMap.get(action.config.targetScreenId!);
        if (!target) continue;

        connections.push({
          from: { x: widgetX, y: widgetY },
          to: {
            x: target.position.x + 180, // screen center approx
            y: target.position.y + 320,
          },
        });
      }

      if (widget.children) {
        walkWidgets(widget.children, screen, {
          x: parentOffset.x + (typeof layout?.x === "number" ? layout.x : 0),
          y: parentOffset.y + (typeof layout?.y === "number" ? layout.y : 0),
        });
      }
    }
  }

  for (const screen of screens) {
    walkWidgets(screen.widgets, screen);
  }

  return connections;
}

function bezierPath(from: Connection["from"], to: Connection["to"]) {
  const dx = Math.abs(to.x - from.x) * 0.5;

  return `
    M ${from.x} ${from.y}
    C ${from.x + dx} ${from.y},
      ${to.x - dx} ${to.y},
      ${to.x} ${to.y}
  `;
}

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */

export function Canvas() {
  const { screens, zoom, setZoom, offset, setOffset, setActiveScreen } = useUniversalBuilder();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  // 1. Zoom to Cursor Logic (Native for preventDefault)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheelNative = (e: WheelEvent) => {
      e.preventDefault();

      const delta = -e.deltaY;
      const factor = delta > 0 ? 1.08 : 0.92;
      const nextZoom = Math.min(Math.max(zoom * factor, 0.1), 4);

      const rect = container.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      const newOffsetX = mx - ((mx - offset.x) / zoom) * nextZoom;
      const newOffsetY = my - ((my - offset.y) / zoom) * nextZoom;

      setZoom(nextZoom);
      setOffset({ x: newOffsetX, y: newOffsetY });
    };

    container.addEventListener("wheel", handleWheelNative, { passive: false });
    return () => container.removeEventListener("wheel", handleWheelNative);
  }, [zoom, offset, setZoom, setOffset]);

  // 2. Pan Logic
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && (e.target === e.currentTarget || (e.target as HTMLElement).tagName === 'svg')) {
      setIsPanning(true);
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      setActiveScreen(null);
    }
  };

  useEffect(() => {
    if (!isPanning) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      setOffset({ x: offset.x + dx, y: offset.y + dy });
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => setIsPanning(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isPanning, offset, setOffset]);

  const connections = collectNavigationConnections(screens);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      className={`relative w-full h-full overflow-hidden bg-slate-100 select-none ${isPanning ? 'cursor-grabbing' : 'cursor-crosshair'}`}
    >
      <motion.div
        animate={{
          scale: zoom,
          x: offset.x,
          y: offset.y
        }}
        transition={{ type: "spring", stiffness: 400, damping: 40 }}
        style={{ transformOrigin: "0 0" }}
        className="relative w-full h-full"
      >
        {/* ───────── SVG CONNECTION LAYER ───────── */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
          <defs>
            <marker
              id="arrow"
              markerWidth="10"
              markerHeight="10"
              refX="8"
              refY="5"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M0,0 L10,5 L0,10 z" fill="#14b8a6" />
            </marker>
          </defs>

          {connections.map((c, i) => (
            <path
              key={i}
              d={bezierPath(c.from, c.to)}
              stroke="#14b8a6"
              strokeWidth={3}
              fill="none"
              markerEnd="url(#arrow)"
              className="opacity-60 drop-shadow-sm transition-all"
              style={{
                strokeDasharray: "10,5",
                animation: "dash 30s linear infinite",
              }}
            />
          ))}
        </svg>

        {/* ───────── SCREENS ───────── */}
        {screens.map((screen) => (
          <PhoneScreen key={screen.id} screen={screen} />
        ))}
      </motion.div>

      <ZoomControls />

      <style>{`
        @keyframes dash {
          to { stroke-dashoffset: -1000; }
        }
      `}</style>
    </div>
  );
}
