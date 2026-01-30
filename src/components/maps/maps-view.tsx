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
    <div className="h-[calc(100vh-104px)] w-full relative">
      {/* Mode Switcher */}
      <div className="absolute top-6 right-6 z-4000">
        <div className="bg-[#0B0F17]/80 backdrop-blur-md p-1 rounded-full border border-white/10 flex gap-1">
          <Button
            variant={mode === "interactive" ? "default" : "ghost"}
            size="sm"
            onClick={() => setMode("interactive")}
            className="rounded-full h-9 gap-2 px-4 transition-all"
          >
            <MapIcon className="size-4" />
            <span className="text-xs font-bold">ইন্টারঅ্যাক্টিভ</span>
          </Button>
          <Button
            variant={mode === "survey" ? "default" : "ghost"}
            size="sm"
            onClick={() => setMode("survey")}
            className="rounded-full h-9 gap-2 px-4 transition-all"
          >
            <Ruler className="size-4" />
            <span className="text-xs font-bold">জরিপ মোড</span>
          </Button>
        </div>
      </div>

      {mode === "interactive" ? <InteractiveMap /> : <SurveyorMap />}
    </div>
  )
}
