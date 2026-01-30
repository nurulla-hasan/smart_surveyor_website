"use client";

import {
  Search,
  Folder,
  Navigation,
  Upload,
  Layers,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface MapToolbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: () => void;
  onSavedMapsClick: () => void;
  onMyLocationClick: () => void;
  onUploadClick: () => void;
  onLayerToggle: () => void;
  isLoadingLocation?: boolean;
}

export function MapToolbar({
  searchQuery,
  setSearchQuery,
  onSearch,
  onSavedMapsClick,
  onMyLocationClick,
  onUploadClick,
  onLayerToggle,
  isLoadingLocation,
}: MapToolbarProps) {
  return (
    <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10 flex flex-col gap-3 md:gap-4 pointer-events-none">
      {/* Search Bar */}
      <div className="pointer-events-auto flex items-center bg-background backdrop-blur border rounded-lg shadow-md max-w-xs overflow-hidden">
        <Input
          placeholder="দাগ নং..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
          className="flex-1 bg-transparent border-none focus-visible:ring-0 text-sm px-3"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={onSearch}
          className="hover:bg-transparent"
        >
          <Search className="text-muted-foreground" />
        </Button>
      </div>

      {/* Buttons Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={onSavedMapsClick}
          className="bg-background text-foreground"
        >
          <Folder className="text-orange-500" />
          সংরক্ষিত ম্যাপ
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={onMyLocationClick}
          disabled={isLoadingLocation}
          className="bg-background text-foreground"
        >
          {isLoadingLocation ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Navigation className="h-4 w-4 text-blue-500 fill-blue-500" />
          )}
          অবস্থান
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={onUploadClick}
          className="bg-background text-foreground"
        >
          <Upload />
          আপলোড
        </Button>

        <Button
          variant="secondary"
          size="icon"
          onClick={onLayerToggle}
          className="bg-background text-foreground"
        >
          <Layers />
        </Button>
      </div>
    </div>
  );
}
