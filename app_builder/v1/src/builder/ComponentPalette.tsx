// src/builder/ComponentPalette.tsx (COMPLETE REWRITE)
import React, { useState } from 'react';
import { useUniversalBuilder } from '../context/UniversalBuilderContext';
import type { WidgetType } from '../types';
import {
  Type,
  MousePointer2,
  Image as ImageIcon,
  Columns,
  Rows,
  Database,
  LayoutList,
  FileType,
  Square,
  Copy,
  AlertCircle,
} from 'lucide-react';

interface ComponentItem {
  type: WidgetType;
  icon: React.ReactNode;
  description: string;
  category: 'basic' | 'layout' | 'data';
}

const COMPONENTS: ComponentItem[] = [
  // BASIC
  { type: 'Text', icon: <Type size={18} />, description: 'Heading, paragraph', category: 'basic' },
  { type: 'Button', icon: <MousePointer2 size={18} />, description: 'Clickable button', category: 'basic' },
  { type: 'Input', icon: <FileType size={18} />, description: 'Text input field', category: 'basic' },
  { type: 'Image', icon: <ImageIcon size={18} />, description: 'Image element', category: 'basic' },

  // LAYOUT
  { type: 'Column', icon: <Columns size={18} />, description: 'Vertical stack', category: 'layout' },
  { type: 'Row', icon: <Rows size={18} />, description: 'Horizontal stack', category: 'layout' },
  { type: 'Container', icon: <Square size={18} />, description: 'Box container', category: 'layout' },
  { type: 'Card', icon: <Copy size={18} />, description: 'Card component', category: 'layout' },

  // DATA
  { type: 'ListView', icon: <LayoutList size={18} />, description: 'List data', category: 'data' },
  { type: 'GridView', icon: <Database size={18} />, description: 'Grid data', category: 'data' },
];

const DATA_TEMPLATES = [
  { label: 'Todo List', collection: 'todos', icon: <LayoutList size={18} /> },
  { label: 'Courses', collection: 'courses', icon: <LayoutList size={18} /> },
  { label: 'Products', collection: 'products', icon: <Database size={18} /> },
];

export function ComponentPalette() {
  const { addWidget, updateWidgetProps, activeScreenId } = useUniversalBuilder();
  const [draggedType, setDraggedType] = useState<WidgetType | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<'basic' | 'layout' | 'data' | null>('basic');

  /* ────────────────────────────────────────
     HANDLE DRAG START
  ────────────────────────────────────────── */

  const handleDragStart = (e: React.DragEvent, type: WidgetType) => {
    setDraggedType(type);

    // Set drag data
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('widgetType', type);

    // Custom drag preview
    const preview = document.createElement('div');
    preview.textContent = type;
    preview.style.cssText = `
      position: absolute;
      top: -999px;
      left: -999px;
      padding: 8px 16px;
      background: #14b8a6;
      color: white;
      border-radius: 8px;
      font-weight: bold;
      font-size: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 9999;
    `;
    document.body.appendChild(preview);
    e.dataTransfer.setDragImage(preview, 8, 8);

    // Clean up
    setTimeout(() => {
      if (document.body.contains(preview)) {
        document.body.removeChild(preview);
      }
    }, 0);
  };

  const handleDragEnd = () => {
    setDraggedType(null);
  };

  /* ────────────────────────────────────────
     HANDLE QUICK ADD (FOR DATA TEMPLATES)
  ────────────────────────────────────────── */

  const handleQuickAdd = (collection: string, label: string) => {
    if (!activeScreenId) {
      alert('Please select a screen first');
      return;
    }

    const widgetId = addWidget(activeScreenId, 'ListView');
    updateWidgetProps(activeScreenId, widgetId, {
      label,
      props: {
        content: { dataSource: collection },
        layout: { gap: 12 },
      },
    });
  };

  /* ────────────────────────────────────────
     RENDER
  ────────────────────────────────────────── */

  return (
    <div className="p-4 bg-white border-t border-slate-100 h-full overflow-y-auto flex flex-col">
      {/* HEADER WITH HELPER TEXT */}
      <div className="mb-4">
        <h2 className="text-sm font-black text-slate-900 mb-2">Components</h2>
        <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2 text-[9px] text-blue-700">
          <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
          <div>
            <strong>💡 Drag components</strong> from the palette onto the canvas to add them to your screen.
          </div>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="border-t my-3" />

      {/* BASIC COMPONENTS */}
      <div className="mb-4">
        <button
          onClick={() => setExpandedCategory(expandedCategory === 'basic' ? null : 'basic')}
          className="flex items-center justify-between w-full px-2 py-2 hover:bg-slate-100 rounded-lg transition-all"
        >
          <h3 className="text-[10px] font-black text-slate-600 uppercase">Basic</h3>
          <span className={`transition-transform ${expandedCategory === 'basic' ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        {expandedCategory === 'basic' && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            {COMPONENTS.filter((c) => c.category === 'basic').map((comp) => (
              <ComponentCard
                key={comp.type}
                component={comp}
                isDragging={draggedType === comp.type}
                onDragStart={(e) => handleDragStart(e, comp.type)}
                onDragEnd={handleDragEnd}
              />
            ))}
          </div>
        )}
      </div>

      {/* LAYOUT COMPONENTS */}
      <div className="mb-4">
        <button
          onClick={() => setExpandedCategory(expandedCategory === 'layout' ? null : 'layout')}
          className="flex items-center justify-between w-full px-2 py-2 hover: bg-slate-100 rounded-lg transition-all"
        >
          <h3 className="text-[10px] font-black text-slate-600 uppercase">Layout</h3>
          <span className={`transition-transform ${expandedCategory === 'layout' ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        {expandedCategory === 'layout' && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            {COMPONENTS.filter((c) => c.category === 'layout').map((comp) => (
              <ComponentCard
                key={comp.type}
                component={comp}
                isDragging={draggedType === comp.type}
                onDragStart={(e) => handleDragStart(e, comp.type)}
                onDragEnd={handleDragEnd}
              />
            ))}
          </div>
        )}
      </div>

      {/* DATA COMPONENTS */}
      <div className="mb-4">
        <button
          onClick={() => setExpandedCategory(expandedCategory === 'data' ? null : 'data')}
          className="flex items-center justify-between w-full px-2 py-2 hover:bg-slate-100 rounded-lg transition-all"
        >
          <h3 className="text-[10px] font-black text-slate-600 uppercase">Data</h3>
          <span className={`transition-transform ${expandedCategory === 'data' ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        {expandedCategory === 'data' && (
          <div className="space-y-2 mt-2">
            {COMPONENTS.filter((c) => c.category === 'data').map((comp) => (
              <ComponentCard
                key={comp.type}
                component={comp}
                isDragging={draggedType === comp.type}
                onDragStart={(e) => handleDragStart(e, comp.type)}
                onDragEnd={handleDragEnd}
              />
            ))}
          </div>
        )}
      </div>

      {/* DIVIDER */}
      <div className="border-t my-3" />

      {/* TEMPLATES */}
      <div className="mt-auto">
        <h3 className="text-[10px] font-black text-slate-600 uppercase mb-2">Quick Templates</h3>
        <div className="space-y-2">
          {DATA_TEMPLATES.map((template) => (
            <button
              key={template.collection}
              onClick={() => handleQuickAdd(template.collection, template.label)}
              className="w-full flex items-center gap-3 p-3 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 hover:border-teal-400 transition-all group"
              title={`Quick add ${template.label} ListView`}
            >
              <span className="text-teal-600 group-hover:scale-110 transition-transform">
                {template.icon}
              </span>
              <div className="text-left flex-1">
                <div className="text-xs font-bold">{template.label}</div>
                <div className="text-[8px] text-slate-500">Click to add</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   COMPONENT CARD (DRAGGABLE ITEM)
═══════════════════════════════════════════ */

interface ComponentCardProps {
  component: ComponentItem;
  isDragging: boolean;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: () => void;
}

function ComponentCard({ component, isDragging, onDragStart, onDragEnd }: ComponentCardProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      data-testid={`palette-item-${component.type}`}
      className={`flex flex-col items-center p-3 border rounded-lg cursor-grab active:cursor-grabbing transition-all hover:border-teal-400 hover:bg-teal-50 group ${isDragging ? 'opacity-50 border-teal-400 bg-teal-50' : 'border-slate-200 bg-white'
        }`}
      title={`Drag ${component.type} to canvas`}
    >
      <div className="text-teal-600 group-hover:scale-110 transition-transform">
        {component.icon}
      </div>
      <span className="text-[10px] font-bold mt-1 text-center">{component.type}</span>
      <span className="text-[8px] text-slate-400 text-center group-hover:text-slate-600 mt-0.5">
        {component.description}
      </span>
    </div>
  );
}