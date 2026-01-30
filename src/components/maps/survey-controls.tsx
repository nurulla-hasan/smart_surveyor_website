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
      <div className="flex justify-start w-full pointer-events-none">
        <div className="bg-background/90 backdrop-blur-md border px-4 py-2 rounded-xl shadow-lg pointer-events-auto flex items-center gap-4">
          <div className="flex flex-col items-center border-r pr-4">
            <span className="text-[10px] uppercase text-muted-foreground font-medium">এলাকা</span>
            <span className="text-lg font-bold">{areaInfo.decimal} <span className="text-sm font-normal text-muted-foreground">শতাংশ</span></span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase text-muted-foreground font-medium">বর্গফুট</span>
            <span className="text-lg font-bold">{areaInfo.sqft.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">sqft</span></span>
          </div>
        </div>
      </div>

      {/* Floating Buttons (Center-Right) */}
      <div className="absolute md:top-1/2 right-2 md:right-6 md:-translate-y-1/2 flex flex-col gap-4 items-center z-10">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="secondary"
                onClick={onMyLocation}
                disabled={isLoadingLocation}
                className="size-12 rounded-full pointer-events-auto"
              >
                {isLoadingLocation ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <Navigation className="size-5 text-blue-500 fill-blue-500" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>আমার অবস্থান</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                onClick={onAddPoint}
                className="size-14 rounded-full pointer-events-auto"
              >
                <Plus className="size-8" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>পয়েন্ট যোগ করুন</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Bottom Action Bar */}
      <div className="flex justify-center w-full">
        <div className="bg-background/90 backdrop-blur-md border p-2 rounded-xl shadow-lg pointer-events-auto flex items-center gap-2 max-w-[90%] w-fit">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  onClick={onUndo}
                  disabled={points.length === 0}
                  className="flex-1"
                >
                  <Undo2 className="size-4" />
                  মুছুন
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>শেষ পয়েন্টটি মুছে ফেলুন</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onReset}
                  disabled={points.length === 0}
                >
                  <RotateCcw className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>সব মুছে নতুন করে শুরু করুন</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onSave}
                  disabled={points.length < 3 || isPending}
                  className="flex-[1.2]"
                >
                  {isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                  সেভ
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>জরিপ সেভ করুন</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
