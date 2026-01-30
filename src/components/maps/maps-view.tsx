"use client"

import dynamic from "next/dynamic"
import { useState } from "react"
import { Loader2, Ruler, Map as MapIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

// Dynamically import map components with no SSR
const InteractiveMap = dynamic(
  () => import("@/components/maps/interactive-map"),
  { 
    ssr: false,
    loading: () => <MapLoading />
  }
)

const SurveyorMap = dynamic(
  () => import("@/components/maps/surveyor-map").then(mod => mod.SurveyorMap),
  { 
    ssr: false,
    loading: () => <MapLoading />
  }
)

function MapLoading() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-muted/20">
      <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading Map Engine...</p>
      </div>
    </div>
  )
}

export function MapsView() {
  const [mode, setMode] = useState<"interactive" | "survey">("interactive")

  return (
    <div className="h-[calc(100vh-110px)] w-full relative">
      {/* Mode Switcher */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:top-6 md:bottom-auto md:right-6 z-4000 pointer-events-none">
        <div className="bg-background/80 backdrop-blur-md p-1 rounded-full border flex gap-1 pointer-events-auto shadow-lg">
          <Button
            variant={mode === "interactive" ? "default" : "ghost"}
            size="sm"
            onClick={() => setMode("interactive")}
            className="rounded-full"
          >
            <MapIcon className="size-4" />
            <span className="text-xs font-medium">ম্যাপ</span>
          </Button>
          <Button
            variant={mode === "survey" ? "default" : "ghost"}
            size="sm"
            onClick={() => setMode("survey")}
            className="rounded-full"
          >
            <Ruler className="size-4" />
            <span className="text-xs font-medium">জরিপ</span>
          </Button>
        </div>
      </div>

      {mode === "interactive" ? <InteractiveMap /> : <SurveyorMap />}
    </div>
  )
}
