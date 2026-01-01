// src/builder/ZoomControls.tsx
import { Plus, Minus, Maximize } from 'lucide-react';
import { useUniversalBuilder } from '../context/UniversalBuilderContext';

export function ZoomControls() {
  const { zoom, setZoom } = useUniversalBuilder();
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/80 backdrop-blur-md border border-slate-200 p-1.5 rounded-2xl shadow-xl z-50">
      <button 
        onClick={() => setZoom(Math.max(zoom - 0.1, 0.5))}
        className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors"
      >
        <Minus size={16} />
      </button>
      
      <span className="text-[11px] font-bold w-12 text-center text-slate-700">
        {Math.round(zoom * 100)}%
      </span>

      <button 
        onClick={() => setZoom(Math.min(zoom + 0.1, 2))}
        className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors"
      >
        <Plus size={16} />
      </button>

      <div className="w-px h-4 bg-slate-200 mx-1" />

      <button 
        onClick={() => setZoom(1)}
        className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors"
        title="Reset Zoom"
      >
        <Maximize size={16} />
      </button>
    </div>
  );
}