import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";

import type {
  Screen,
  DeviceType,
  WidgetType,
  Widget,
  WidgetProps,
} from "../types";

import type { Node, Edge } from "reactflow";
import { defaultSizeByType } from "../types";

/* ═══════════════════════════════════════
   TYPES
═══════════════════════════════════════ */

export type Collection = {
  id: string;
  name: string;
  data: any[];
};

export type SavedTemplate = {
  id: string;
  name: string;
  nodes: Node[];
  edges: Edge[];
};

/* ═══════════════════════════════════════
   CONTEXT TYPES
═══════════════════════════════════════ */

interface UniversalBuilderContextType {
  appId: string | null;
  appName: string;

  deviceType: DeviceType;
  zoom: number;
  offset: { x: number; y: number };

  collections: Collection[];
  screens: Screen[];

  activeScreenId: string | null;
  selectedWidgetId: string | null;
  selectedWidget: Widget | null;

  setDeviceType: (d: DeviceType) => void;
  setZoom: (z: number) => void;
  setOffset: (o: { x: number; y: number }) => void;
  setActiveScreen: (id: string | null) => void;
  setSelectedWidget: (id: string | null) => void;
  setScreens: React.Dispatch<React.SetStateAction<Screen[]>>;

  addCollection: (c: Omit<Collection, "id">) => void;
  updateCollection: (id: string, updates: Partial<Collection>) => void;
  deleteCollection: (id: string) => void;

  addScreen: (name: string) => string;
  updateScreenPosition: (id: string, delta: { x: number; y: number }) => void;

  addWidget: (
    screenId: string,
    type: WidgetType,
    parentId?: string | null,
    index?: number
  ) => string;

  updateWidgetProps: (
    screenId: string,
    widgetId: string,
    updates: {
      props?: Partial<WidgetProps>;
      label?: string;
      workflow?: Widget["workflow"];
    }
  ) => void;

  deleteWidget: (screenId: string, widgetId: string) => void;

  reorderWidget: (
    screenId: string,
    parentId: string | null,
    widgetId: string,
    targetIndex: number
  ) => void;

  bindWidgetToCollection: (
    screenId: string,
    widgetId: string,
    collectionName: string
  ) => void;

  savedTemplates: SavedTemplate[];
  saveTemplate: (name: string, nodes: Node[], edges: Edge[]) => void;
  deleteTemplate: (id: string) => void;
}

const UniversalBuilderContext =
  createContext<UniversalBuilderContextType | null>(null);

/* ═══════════════════════════════════════
   TREE HELPERS
═══════════════════════════════════════ */

function removeFromTree(
  list: Widget[],
  id: string
): { updated: Widget[]; removed?: Widget } {
  let removed: Widget | undefined;

  const updated = list
    .map((w) => {
      if (w.id === id) {
        removed = w;
        return null;
      }

      if (w.children) {
        const res = removeFromTree(w.children, id);
        if (res.removed) {
          removed = res.removed;
          return { ...w, children: res.updated };
        }
      }

      return w;
    })
    .filter(Boolean) as Widget[];

  return { updated, removed };
}

function insertIntoTree(
  list: Widget[],
  parentId: string | null,
  widget: Widget,
  index: number
): Widget[] {
  if (!parentId) {
    const copy = [...list];
    copy.splice(index, 0, widget);
    return copy;
  }

  return list.map((w) =>
    w.id === parentId
      ? { ...w, children: [...(w.children ?? []), widget] }
      : w.children
        ? { ...w, children: insertIntoTree(w.children, parentId, widget, index) }
        : w
  );
}

/* ═══════════════════════════════════════
   PROVIDER
═══════════════════════════════════════ */

export function UniversalBuilderProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [appId] = useState("demo-app");
  const [appName] = useState("My Universal App");

  const [deviceType, setDeviceType] = useState<DeviceType>("iphone");
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const [collections, setCollections] = useState<Collection[]>([]);
  const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>([]);

  const [screens, setScreens] = useState<Screen[]>([
    {
      id: "screen-1",
      name: "Login",
      position: { x: 100, y: 100 },
      widgets: [
        {
          id: "logo-text",
          type: "Text",
          label: "FlowStudio logo",
          props: {
            content: { text: "Welcome Back" },
            style: { fontSize: 24, color: "#111827" },
            layout: { padding: 20, widthMode: "fill" }
          }
        },
        {
          id: "email-input",
          type: "Input",
          label: "Email Input",
          props: {
            content: { placeholder: "email@example.com", fieldName: "email", type: "email" },
            layout: { padding: 10, widthMode: "fill" }
          }
        },
        {
          id: "password-input",
          type: "Input",
          label: "Password Input",
          props: {
            content: { placeholder: "password", fieldName: "password", type: "password" },
            layout: { padding: 10, widthMode: "fill" }
          }
        },
        {
          id: "login-btn",
          type: "Button",
          label: "Login Button",
          props: {
            content: { text: "Sign In" },
            style: { backgroundColor: "#0f766e" },
            layout: { padding: 20, widthMode: "fill" }
          }
        }
      ],
      isInitial: true,
      isEnabled: true,
    },
  ]);

  const [activeScreenId, setActiveScreenId] = useState<string | null>("screen-1");
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);

  /* ───────── Widget Finder ───────── */

  const findWidget = useCallback(
    (list: Widget[], id: string): Widget | null => {
      for (const w of list) {
        if (w.id === id) return w;
        if (w.children) {
          const found = findWidget(w.children, id);
          if (found) return found;
        }
      }
      return null;
    },
    []
  );

  const selectedWidget = useMemo(() => {
    if (!activeScreenId || !selectedWidgetId) return null;
    const screen = screens.find((s) => s.id === activeScreenId);
    return screen ? findWidget(screen.widgets, selectedWidgetId) : null;
  }, [screens, activeScreenId, selectedWidgetId, findWidget]);

  /* ───────── Collections ───────── */

  const addCollection = useCallback((c: Omit<Collection, "id">) => {
    setCollections((prev) => [...prev, { ...c, id: crypto.randomUUID() }]);
  }, []);

  const updateCollection = useCallback(
    (id: string, updates: Partial<Collection>) => {
      setCollections((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
      );
    },
    []
  );

  const deleteCollection = useCallback((id: string) => {
    setCollections((prev) => prev.filter((c) => c.id !== id));
  }, []);

  /* ───────── Screens ───────── */

  const addScreen = useCallback((name: string) => {
    const id = crypto.randomUUID();
    setScreens((prev) => [
      ...prev,
      { id, name, position: { x: 150, y: 150 }, widgets: [], isEnabled: true },
    ]);
    return id;
  }, []);

  const updateScreenPosition = useCallback(
    (id: string, delta: { x: number; y: number }) => {
      setScreens((prev) =>
        prev.map((s) =>
          s.id === id
            ? {
              ...s,
              position: {
                x: s.position.x + delta.x,
                y: s.position.y + delta.y,
              },
            }
            : s
        )
      );
    },
    []
  );

  /* ───────── Widgets ───────── */

  const addWidget = useCallback(
    (screenId: string, type: WidgetType, parentId?: string | null, index?: number) => {
      const size = defaultSizeByType[type];

      const widget: Widget = {
        id: crypto.randomUUID(),
        type,
        label: `New ${type}`,
        props: {
          layout: {
            width: size.w,
            height: size.h,
            widthMode: "fixed",
            heightMode: "fixed",
          },
        },
        children: ["Column", "Row", "ListView", "GridView"].includes(type)
          ? []
          : undefined,
      };

      setScreens((prev) =>
        prev.map((s) =>
          s.id !== screenId
            ? s
            : {
              ...s,
              widgets: insertIntoTree(
                s.widgets,
                parentId ?? null,
                widget,
                index ?? s.widgets.length
              ),
            }
        )
      );

      setSelectedWidgetId(widget.id);
      return widget.id;
    },
    []
  );

  const updateWidgetProps = useCallback(
    (
      screenId: string,
      widgetId: string,
      updates: {
        props?: Partial<WidgetProps>;
        label?: string;
        workflow?: Widget["workflow"];
      }
    ) => {
      const updateTree = (list: Widget[]): Widget[] =>
        list.map((w) =>
          w.id === widgetId
            ? {
              ...w,
              label: updates.label ?? w.label,
              props: { ...w.props, ...updates.props },
              workflow: updates.workflow ?? w.workflow,
            }
            : w.children
              ? { ...w, children: updateTree(w.children) }
              : w
        );

      setScreens((prev) =>
        prev.map((s) =>
          s.id === screenId ? { ...s, widgets: updateTree(s.widgets) } : s
        )
      );
    },
    []
  );

  const deleteWidget = useCallback((screenId: string, widgetId: string) => {
    setScreens((prev) =>
      prev.map((s) =>
        s.id !== screenId
          ? s
          : { ...s, widgets: removeFromTree(s.widgets, widgetId).updated }
      )
    );
    setSelectedWidgetId(null);
  }, []);

  const reorderWidget = useCallback(
    (
      screenId: string,
      parentId: string | null,
      widgetId: string,
      targetIndex: number
    ) => {
      setScreens((prev) =>
        prev.map((s) => {
          if (s.id !== screenId) return s;
          const { updated, removed } = removeFromTree(s.widgets, widgetId);
          if (!removed) return s;
          return {
            ...s,
            widgets: insertIntoTree(updated, parentId, removed, targetIndex),
          };
        })
      );
    },
    []
  );

  const bindWidgetToCollection = useCallback(
    (screenId: string, widgetId: string, collectionName: string) => {
      updateWidgetProps(screenId, widgetId, {
        props: { content: { dataSource: collectionName } },
      });
    },
    [updateWidgetProps]
  );

  /* ───────── Templates ───────── */

  const saveTemplate = useCallback(
    (name: string, nodes: Node[], edges: Edge[]) => {
      setSavedTemplates((prev) => [
        ...prev,
        { id: crypto.randomUUID(), name, nodes, edges },
      ]);
    },
    []
  );

  const deleteTemplate = useCallback((id: string) => {
    setSavedTemplates((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <UniversalBuilderContext.Provider
      value={{
        appId,
        appName,
        deviceType,
        zoom,
        offset,
        collections,
        screens,
        activeScreenId,
        selectedWidgetId,
        selectedWidget,
        setDeviceType,
        setZoom,
        setOffset,
        setActiveScreen: (id) => {
          setActiveScreenId(id);
          setSelectedWidgetId(null);
        },
        setSelectedWidget: setSelectedWidgetId,
        setScreens,
        addCollection,
        updateCollection,
        deleteCollection,
        addScreen,
        updateScreenPosition,
        addWidget,
        updateWidgetProps,
        deleteWidget,
        reorderWidget,
        bindWidgetToCollection,
        savedTemplates,
        saveTemplate,
        deleteTemplate,
      }}
    >
      {children}
    </UniversalBuilderContext.Provider>
  );
}

export function useUniversalBuilder() {
  const ctx = useContext(UniversalBuilderContext);
  if (!ctx) {
    throw new Error(
      "useUniversalBuilder must be used inside UniversalBuilderProvider"
    );
  }
  return ctx;
}
