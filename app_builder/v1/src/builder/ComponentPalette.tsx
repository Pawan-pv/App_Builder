import React from 'react';
import { useUniversalBuilder, } from '../context/UniversalBuilderContext';
import type { WidgetType } from '../types';
import {
  Type,
  MousePointer2,
  Image as ImageIcon,
  Columns,
  Rows,
  Database,
  LayoutList
} from 'lucide-react';

const BASIC_COMPONENTS: { type: WidgetType; icon: React.ReactNode }[] = [
  { type: 'Text', icon: <Type size={18} /> },
  { type: 'Button', icon: <MousePointer2 size={18} /> },
  { type: 'Image', icon: <ImageIcon size={18} /> },
  { type: 'Column', icon: <Columns size={18} /> },
  { type: 'Row', icon: <Rows size={18} /> },
];

const DATA_COMPONENTS = [
  { label: 'Course List', collection: 'courses', icon: <LayoutList size={18} /> },
  { label: 'Product Grid', collection: 'products', icon: <Database size={18} /> },
];

export function ComponentPalette() {
  const { addWidget, updateWidgetProps, activeScreenId } =
    useUniversalBuilder();

  const handleAddBasic = (type: WidgetType) => {
    if (!activeScreenId) return;
    addWidget(activeScreenId, type);
  };

  const handleAddDataList = (collection: string) => {
    if (!activeScreenId) return;

    // 1️⃣ Create widget and capture ID
    const widgetId = addWidget(activeScreenId, "Column");

    // 2️⃣ Apply data binding + layout
    updateWidgetProps(activeScreenId, widgetId, {
      label: `${collection} List`,
      props: {
        content: {
          dataSource: collection,
        },
        layout: {
          gap: 12,
        },
      },
    });
  };

  return (
    <aside className="p-4 bg-white border-t border-slate-100 h-full overflow-y-auto">
      {/* BASIC */}
      <section className="mb-6">
        <h3 className="text-[10px] font-black text-slate-400 uppercase mb-3">
          Basic Elements
        </h3>

        <div className="grid grid-cols-2 gap-2">
          {BASIC_COMPONENTS.map((comp) => (
            <button
              key={comp.type}
              onClick={() => handleAddBasic(comp.type)}
              className="flex flex-col items-center p-3 bg-slate-50 border rounded-xl hover:border-teal-500"
            >
              {comp.icon}
              <span className="text-[10px] font-bold">{comp.type}</span>
            </button>
          ))}
        </div>
      </section>

      {/* COLLECTIONS */}
      <section>
        <h3 className="text-[10px] font-black text-slate-400 uppercase mb-3">
          App Collections
        </h3>

        <div className="space-y-2">
          {DATA_COMPONENTS.map((data) => (
            <button
              key={data.collection}
              onClick={() => handleAddDataList(data.collection)}
              className="w-full flex items-center gap-3 p-3 bg-teal-50 border rounded-xl"
            >
              {data.icon}
              <span className="text-xs font-bold">{data.label}</span>
            </button>
          ))}
        </div>
      </section>
    </aside>
  );
}
