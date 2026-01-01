// src/utils/schema-transformer.ts
import type { Screen, Widget } from '../types'

/**
 * ═══════════════════════════════════════════════════════
 * UNIVERSAL SCHEMA TRANSFORMER
 * ═══════════════════════════════════════════════════════
 * Converts Builder format ↔ Flutter format
 */

/* ────────────────────────────────────────────────────────
   BUILDER → FLUTTER
──────────────────────────────────────────────────────── */

export function toFlutterSchema(screens: Screen[]) {
  return {
    screens: screens.map(screen => ({
      id: screen.id,
      title: screen.name,
      isInitial: screen.isInitial || false,
      root: {
        type: "Column",
        props: {
          crossAxisAlignment: "stretch",
          mainAxisAlignment: "start",
          padding: 16,
        },
        children: screen.widgets.map(widget => widgetToFlutter(widget))
      }
    }))
  };
}

function widgetToFlutter(widget: Widget): any {
  const flutterWidget: any = {
    type: widget.type,
    props: flattenProps(widget),
  };

  // Handle children
  if (widget.type === 'Column' || widget.type === 'Row') {
    flutterWidget.children = widget.children?.map(widgetToFlutter) || [];
  } else if (widget.type === 'Container' && widget.children?.[0]) {
    flutterWidget.child = widgetToFlutter(widget.children[0]);
  } else if (widget.type === 'Card') {
    flutterWidget.children = widget.children?.map(widgetToFlutter) || [];
  } else if (widget.type === 'ListView' || widget.type === 'GridView') {
    // Keep itemTemplate for data-bound widgets
    if (widget.props.itemTemplate) {
      flutterWidget.itemTemplate = widgetToFlutter(widget.props.itemTemplate as any);
    }
  }

  return flutterWidget;
}

function flattenProps(widget: Widget): any {
  const { props, type } = widget;
  const flutterProps: any = {};

  // LAYOUT
  if (props.layout) {
    if (props.layout.mainAxisAlignment) {
      flutterProps.mainAxisAlignment = props.layout.mainAxisAlignment;
    }
    if (props.layout.crossAxisAlignment) {
      flutterProps.crossAxisAlignment = props.layout.crossAxisAlignment;
    }
    if (props.layout.gap) {
      flutterProps.spacing = props.layout.gap;
    }
    if (props.layout.padding) {
      const p = props.layout.padding;
      if (typeof p === 'number') {
        flutterProps.padding = p;
      } else {
        const { top = 0, right = 0, bottom = 0, left = 0 } = p;
        if (top === right && right === bottom && bottom === left) {
          flutterProps.padding = top;
        } else {
          flutterProps.padding = { top, right, bottom, left };
        }
      }
    }

    // Width/Height
    if (props.layout.widthMode === 'fill') {
      flutterProps.width = 'infinity';
    } else if (props.layout.widthMode === 'fixed' && props.layout.width) {
      flutterProps.width = props.layout.width;
    }

    if (props.layout.heightMode === 'fill') {
      flutterProps.height = 'infinity';
    } else if (props.layout.heightMode === 'fixed' && props.layout.height) {
      flutterProps.height = props.layout.height;
    }

    // ListView/GridView specific
    if (props.layout.columns) {
      flutterProps.columns = props.layout.columns;
    }
  }

  // STYLE
  if (props.style) {
    if (props.style.color) flutterProps.color = props.style.color;
    if (props.style.backgroundColor) flutterProps.backgroundColor = props.style.backgroundColor;
    if (props.style.fontSize) flutterProps.fontSize = props.style.fontSize;
    if (props.style.borderRadius) flutterProps.borderRadius = props.style.borderRadius;
    if (props.style.imageUrl) {
      flutterProps.url = props.style.imageUrl;
      flutterProps.image = props.style.imageUrl;
    }
  }

  // CONTENT
  if (props.content) {
    if (props.content.text) {
      if (typeof props.content.text === 'string') {
        flutterProps.text = props.content.text;
        flutterProps.value = props.content.text;
      } else if (props.content.text.type === 'dynamic') {
        flutterProps.text = props.content.text.expression;
      }
    }

    // Data binding
    if (props.content.dataSource && props.content.dataSource !== 'manual') {
      flutterProps.dataSource = props.content.dataSource;
    }

    // Navigation
    if (props.content.navigateTo && props.content.navigateTo !== 'none') {
      flutterProps.action = {
        type: 'navigate',
        target: props.content.navigateTo,
      };
    }
  }

  // Button specific
  if (type === 'Button') {
    flutterProps.textColor = props.style?.color || '#FFFFFF';
  }

  return flutterProps;
}

/* ────────────────────────────────────────────────────────
   FLUTTER → BUILDER
──────────────────────────────────────────────────────── */

export function fromFlutterSchema(flutterSchema: any): Screen[] {
  if (!flutterSchema?.screens) return [];

  return flutterSchema.screens.map((screen: any, index: number) => ({
    id: screen.id,
    name: screen.title || screen.name || `Screen ${index + 1}`,
    position: {
      x: 100 + (index * 320),
      y: 100 + (index * 40)
    },
    widgets: extractWidgets(screen.root),
    isInitial: screen.isInitial || index === 0,
    isEnabled: true,
  }));
}

function extractWidgets(root: any): Widget[] {
  if (!root) return [];

  // If root is a Column wrapper, extract children
  if (root.type === 'Column' && root.children) {
    return root.children.map((child: any) => flutterToWidget(child));
  }

  return [flutterToWidget(root)];
}

function flutterToWidget(flutterWidget: any): Widget {
  const widget: Widget = {
    id: `wdg-${crypto.randomUUID().slice(0, 6)}`,
    type: flutterWidget.type as any,
    label: flutterWidget.type,
    props: unflattenProps(flutterWidget),
  };

  // Handle children
  if (flutterWidget.children) {
    widget.children = flutterWidget.children.map(flutterToWidget);
  } else if (flutterWidget.child) {
    widget.children = [flutterToWidget(flutterWidget.child)];
  }

  // Handle item template
  if (flutterWidget.itemTemplate) {
    widget.props.itemTemplate = flutterToWidget(flutterWidget.itemTemplate);
  }

  return widget;
}

function unflattenProps(flutterWidget: any): any {
  const props = flutterWidget.props || {};

  return {
    layout: {
      mainAxisAlignment: props.mainAxisAlignment || 'start',
      crossAxisAlignment: props.crossAxisAlignment || 'start',
      gap: props.spacing || 0,
      padding: props.padding || 0,
      width: props.width === 'infinity' ? undefined : props.width,
      height: props.height === 'infinity' ? undefined : props.height,
      widthMode: props.width === 'infinity' ? 'fill' : props.width ? 'fixed' : 'auto',
      heightMode: props.height === 'infinity' ? 'fill' : props.height ? 'fixed' : 'auto',
      columns: props.columns,
    },
    style: {
      color: props.color || props.textColor,
      backgroundColor: props.backgroundColor,
      fontSize: props.fontSize,
      borderRadius: props.borderRadius,
      imageUrl: props.url || props.image,
    },
    content: {
      text: props.text || props.value,
      dataSource: props.dataSource || 'manual',
      navigateTo: props.action?.target || 'none',
    },
    itemTemplate: undefined, // Will be set separately if exists
  };
}

/* ────────────────────────────────────────────────────────
   VALIDATION
──────────────────────────────────────────────────────── */

export function validateFlutterSchema(schema: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!schema) {
    errors.push("Schema is null or undefined");
    return { valid: false, errors };
  }

  if (!schema.screens || !Array.isArray(schema.screens)) {
    errors.push("Schema must have 'screens' array");
    return { valid: false, errors };
  }

  schema.screens.forEach((screen: any, index: number) => {
    if (!screen.id) errors.push(`Screen ${index}: missing 'id'`);
    if (!screen.title) errors.push(`Screen ${index}: missing 'title'`);
    if (!screen.root) errors.push(`Screen ${index}: missing 'root' widget`);
  });

  return {
    valid: errors.length === 0,
    errors
  };
}