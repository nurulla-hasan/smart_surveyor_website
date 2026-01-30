"use client";

import { Target } from "lucide-react";

export function SurveyCrosshair() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-2000">
      {/* Outer Ring */}
      <div className="relative flex items-center justify-center">
        <Target className="size-10 text-white drop-shadow-[0_0_2px_rgba(0,0,0,0.8)] opacity-80" />
        
        {/* Fine Center Dot */}
        <div className="absolute size-1 bg-red-500 rounded-full shadow-[0_0_4px_rgba(255,0,0,0.8)]" />
        
        {/* Horizontal Line */}
        <div className="absolute w-16 h-px bg-white/40" />
        
        {/* Vertical Line */}
        <div className="absolute h-16 w-px bg-white/40" />
      </div>
    </div>
  );
}
