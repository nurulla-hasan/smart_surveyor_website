"use client";

import { Undo2, RotateCcw, Save, Plus, Navigation, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import * as turf from "@turf/turf";
import L from "leaflet";
import { useMemo } from "react";

interface SurveyControlsProps {
  points: L.LatLng[];
  onAddPoint: () => void;
  onUndo: () => void;
  onReset: () => void;
  onSave: () => void;
  onMyLocation: () => void;
  isLoadingLocation?: boolean;
  isPending?: boolean;
}

export function SurveyControls({
  points,
  onAddPoint,
  onUndo,
  onReset,
  onSave,
  onMyLocation,
  isLoadingLocation,
  isPending,
}: SurveyControlsProps) {
  // Area Calculation Logic
  const areaInfo = useMemo(() => {
    if (points.length < 3) return { decimal: 0, sqft: 0 };

    try {
      // Create a closed polygon for Turf
      const coords = [...points, points[0]].map((p) => [p.lng, p.lat]);
      const polygon = turf.polygon([coords]);
      const areaSqMeters = turf.area(polygon);

      // Conversion
      const decimal = areaSqMeters / 40.47;
      const sqft = areaSqMeters * 10.7639;

      return {
        decimal: Number(decimal.toFixed(3)),
        sqft: Math.round(sqft),
      };
    } catch (error) {
      console.error("Area calculation error:", error);
      return { decimal: 0, sqft: 0 };
    }
  }, [points]);

  return (
    <div className="absolute inset-0 pointer-events-none z-3000 flex flex-col justify-between p-4">
      {/* Top Status Bar: Area Display */}
      <div className="flex justify-center w-full mt-2">
        <div className="bg-[#0B0F17]/80 backdrop-blur-md border border-white/10 px-6 py-3 rounded-2xl shadow-2xl pointer-events-auto flex items-center gap-4">
          <div className="flex flex-col items-center border-r border-white/10 pr-4">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">এলাকা (শতাংশ)</span>
            <span className="text-xl font-black text-white">{areaInfo.decimal} <span className="text-sm font-medium opacity-60">শতাংশ</span></span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">বর্গফুট</span>
            <span className="text-xl font-black text-white">{areaInfo.sqft.toLocaleString()} <span className="text-sm font-medium opacity-60">sqft</span></span>
          </div>
        </div>
      </div>

      {/* Floating Buttons (Center-Right) */}
      <div className="absolute top-1/2 right-6 -translate-y-1/2 flex flex-col gap-6 items-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="secondary"
                onClick={onMyLocation}
                disabled={isLoadingLocation}
                className="size-14 rounded-full bg-[#1A1D23]/80 backdrop-blur-xl border-2 border-white/20 text-white shadow-2xl pointer-events-auto hover:bg-[#252930] hover:scale-110 hover:border-blue-500/50 active:scale-95 transition-all duration-300"
              >
                {isLoadingLocation ? (
                  <Loader2 className="size-6 animate-spin" />
                ) : (
                  <Navigation className="size-6 text-blue-500 fill-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" className="bg-[#1A1D23] border-white/10 text-white font-bold">
              <p>আমার অবস্থান</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="flex flex-col items-center gap-3">
          <Button
            size="icon"
            onClick={onAddPoint}
            className="size-20 rounded-full bg-emerald-500 hover:bg-emerald-600 shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:scale-105 active:scale-90 transition-all duration-300 pointer-events-auto border-4 border-white/20 group"
          >
            <Plus className="size-10 stroke-3 text-white group-hover:rotate-90 transition-transform duration-300" />
          </Button>
          <span className="text-[11px] font-black uppercase tracking-wider text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">পয়েন্ট যোগ করুন</span>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="flex justify-center w-full pb-4">
        <div className="bg-[#1A1D23]/90 backdrop-blur-2xl border border-white/10 p-2 rounded-4xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-auto flex items-center gap-2 max-w-sm w-full border-t-white/20">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  onClick={onUndo}
                  disabled={points.length === 0}
                  className="flex-1 h-14 rounded-2xl text-white hover:bg-white/10 gap-2 transition-all active:scale-95 disabled:opacity-30"
                >
                  <div className="bg-white/10 p-2 rounded-xl">
                    <Undo2 className="size-5" />
                  </div>
                  <span className="text-sm font-bold">আগেরটি মুছুন</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-[#1A1D23] border-white/10 text-white font-bold">
                <p>শেষ পয়েন্টটি মুছে ফেলুন</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  onClick={onReset}
                  disabled={points.length === 0}
                  className="size-14 rounded-2xl text-white hover:bg-red-500/20 hover:text-red-400 transition-all active:scale-95 disabled:opacity-30"
                >
                  <RotateCcw className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-red-500 border-none text-white font-bold">
                <p>সব মুছে নতুন করে শুরু করুন</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onSave}
                  disabled={points.length < 3 || isPending}
                  className="flex-[1.2] h-14 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 gap-2 shadow-lg transition-all active:scale-95 disabled:opacity-30 border-t border-white/20"
                >
                  {isPending ? <Loader2 className="size-5 animate-spin" /> : <Save className="size-5" />}
                  <span className="text-sm font-bold">সেভ করুন</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-blue-600 border-none text-white font-bold">
                <p>জরিপ সেভ করুন</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
