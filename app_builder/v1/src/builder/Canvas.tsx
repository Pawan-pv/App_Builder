// src/builder/Canvas.tsx
import { motion } from 'framer-motion';
import { useUniversalBuilder,  } from '../context/UniversalBuilderContext';
import type { Screen } from '../types';
import { PhoneScreen } from './PhoneScreen';
import { ZoomControls } from './ZoomControls';

export function Canvas() {
  const { screens, zoom, setActiveScreen } = useUniversalBuilder();

  return (
    /* 1. Viewport: This covers the available space between sidebars */
    <div 
      className="w-full h-full relative bg-slate-50 overflow-hidden cursor-crosshair" 
      onClick={(e) => {
        if (e.target === e.currentTarget) setActiveScreen(null);
      }}
    >
      {/* 2. Grid Background: Stays fixed or moves with zoom? 
          Usually better to keep fixed for performance */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', 
          backgroundSize: `${32 * zoom}px ${32 * zoom}px` // Optional: scale grid with zoom
        }} 
      />

      {/* 3. Zoomable Layer: ONLY this div and its children will scale */}
      <motion.div 
        className="w-full h-full relative"
        animate={{ scale: zoom }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{ transformOrigin: 'center center' }} 
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" style={{ zIndex: 5 }}>
          {screens.map((s: Screen, i: number) => {
            const next = screens[i + 1];
            if (!next) return null;
            const x1 = s.position.x + 240;
            const y1 = s.position.y + 225;
            const x2 = next.position.x;
            const y2 = next.position.y + 225;
            
            return (
              <path 
                key={s.id}
                d={`M ${x1} ${y1} C ${x1 + 80} ${y1}, ${x2 - 80} ${y2}, ${x2} ${y2}`}
                stroke="#34d399" 
                strokeWidth="2" 
                fill="none" 
                strokeDasharray="6 6"
              />
            );
          })}
        </svg>

        {screens.map((screen: Screen) => (
          <PhoneScreen key={screen.id} screen={screen} />
        ))}
      </motion.div>

      {/* 4. Zoom Controls: Floating UI inside the canvas but NOT scaled */}
      <ZoomControls />
    </div>
  );
}