"use client"

import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"

// Dynamically import the map component with no SSR
const InteractiveMap = dynamic(
  () => import("@/components/maps/interactive-map"),
  { 
    ssr: false,
    loading: () => (
      <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center bg-muted/20">
        <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading Map Engine...</p>
        </div>
      </div>
    )
  }
)


export function MapsView() {
  return (
    <div className="h-[calc(100vh-104px)] w-full">
      <InteractiveMap />
    </div>
  )
}
