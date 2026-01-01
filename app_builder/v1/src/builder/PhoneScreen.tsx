// c:\my-project\soft-projects\app_builder\v1\src\builder\PhoneScreen.tsx
import React, { useRef } from 'react';
import { useUniversalBuilder, } from '../context/UniversalBuilderContext';
import type { Screen } from '../types';
import { ScreenContentEditor } from './ScreenContentEditor';
import { GripHorizontal } from 'lucide-react';

export function PhoneScreen({ screen }: { screen: Screen }) {
  const { activeScreenId, setActiveScreen, updateScreenPosition, zoom } = useUniversalBuilder();
  const isActive = activeScreenId === screen.id;
  
  // Track last mouse position to calculate "Step Delta"
  const lastMousePos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    
    e.preventDefault();
    e.stopPropagation(); // Stop canvas panning
    
    setActiveScreen(screen.id);
    
    // Initialize the "Last Position"
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    document.body.style.cursor = 'grabbing';

    const onMouseMove = (moveEvent: MouseEvent) => {
      // 1. Calculate how much the mouse moved since the LAST frame
      const mouseDeltaX = moveEvent.clientX - lastMousePos.current.x;
      const mouseDeltaY = moveEvent.clientY - lastMousePos.current.y;

      // 2. Adjust for Zoom: If zoomed out, move the screen MORE units 
      // to keep it under the mouse.
      const canvasDeltaX = mouseDeltaX / zoom;
      const canvasDeltaY = mouseDeltaY / zoom;

      // 3. Update position
      updateScreenPosition(screen.id, {
        x: canvasDeltaX,
        y: canvasDeltaY,
      });

      // 4. Record current position for the next frame
      lastMousePos.current = { x: moveEvent.clientX, y: moveEvent.clientY };
    };

    const onMouseUp = () => {
      document.body.style.cursor = 'default';
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: screen.position.x,
        top: screen.position.y,
        zIndex: isActive ? 50 : 10,
        // Using transition: none during drag makes it feel more responsive
        transition: 'box-shadow 0.2s ease',
      }}
      className="flex flex-col gap-3 group"
    >
      {/* 🟢 THE DRAG HANDLE */}
      <div 
        onMouseDown={handleMouseDown}
        className={`
          flex items-center justify-between px-4 py-2 h-10
          cursor-grab active:cursor-grabbing rounded-xl border-2 select-none
          ${isActive 
            ? "bg-teal-500 border-teal-400 text-white shadow-xl" 
            : "bg-white border-slate-200 text-slate-400 hover:border-slate-300 shadow-sm"
          }
        `}
      >
        <div className="flex items-center gap-2">
           <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white animate-pulse' : 'bg-slate-300'}`} />
           <span className="text-[10px] font-black uppercase tracking-widest leading-none">
             {screen.name}
           </span>
        </div>
        <GripHorizontal size={16} />
      </div>

      {/* 📱 DEVICE FRAME */}
      <div className={`
        relative bg-slate-900 rounded-[3rem] p-3 shadow-2xl transition-all
        ${isActive ? "ring-8 ring-teal-500/10 scale-[1.01]" : "opacity-95"}
      `}>
         <div className="rounded-[2.2rem] overflow-hidden bg-white border-[6px] border-slate-800">
            <ScreenContentEditor screenId={screen.id} />
         </div>
      </div>
    </div>
  );
}