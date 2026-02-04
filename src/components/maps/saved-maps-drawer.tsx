/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Folder, Eye, Trash2, ChevronLeft, ChevronRight, Loader2, SquareDashed } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { useState, useEffect, useCallback } from "react";
import { getMaps, deleteMap as deleteMapService } from "@/services/maps";
import { MapData, MapMeta } from "@/types/maps";
import { toast } from "sonner";
import { useSmartFilter } from "@/hooks/useSmartFilter";
import { Search } from "lucide-react";

interface SavedMapsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadMap: (data: any) => void;
  initialMaps: MapData[];
}

export function SavedMapsDrawer({
  isOpen,
  onClose,
  onLoadMap,
  initialMaps,
}: SavedMapsDrawerProps) {
  const { getFilter, updateFilter } = useSmartFilter();
  const page = Number(getFilter("page")) || 1;
  const search = getFilter("search") || "";

  const [maps, setMaps] = useState<MapData[]>(initialMaps);
  const [meta, setMeta] = useState<MapMeta | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMaps = useCallback(async (currentPage: number, search: string) => {
    setIsLoading(true);
    try {
      const response = await getMaps({ page: currentPage, limit: 6, search });
      if (response?.success) {
        setMaps(response.data.maps);
        setMeta(response.data.meta);
      }
    } catch (error) {
      console.error("Error fetching maps:", error);
      toast.error("Problem loading map");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Fetch if not the very first load with initial data
      // OR if we are on a different page/searching
      if (page > 1 || search !== "" || maps.length === 0) {
        fetchMaps(page, search);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, page, search, fetchMaps]);

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteMapService(id);
      if (res?.success) {
        toast.success("Map deleted successfully");
        fetchMaps(page, search);
      } else {
        toast.error("Problem deleting map");
      }
    } catch {
      toast.error("Server error");
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="sm:max-w-md flex flex-col h-full p-0 border-r-0">
        <div className="p-4 border-b space-y-4">
          <SheetHeader className="text-left">
            <SheetTitle className="text-xl font-bold">Saved Maps</SheetTitle>
            <SheetDescription>
              Load or delete your previously saved maps.
            </SheetDescription>
          </SheetHeader>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by map name or address..."
              className="pl-9 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary/50"
              defaultValue={search}
              onChange={(e) => updateFilter("search", e.target.value, 500)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 px-4 py-4">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="animate-spin size-8 text-primary" />
            </div>
          ) : maps.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-muted-foreground opacity-50">
              <Folder className="size-12" />
              <p className="mt-4 font-medium">No saved maps found.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {maps.map((map) => (
                <div
                  key={map.id}
                  className="flex items-center justify-between p-5 rounded-2xl border bg-card/50 hover:bg-accent/50 transition-all duration-200 group shadow-sm hover:shadow-md"
                >
                  <div className="grid gap-1 overflow-hidden">
                    <p className="font-bold capitalize text-base tracking-tight truncate group-hover:text-primary transition-colors">
                      {map.name}
                    </p>
                    <p className="text-xs text-muted-foreground/80 font-medium">
                      {format(new Date(map.createdAt), "MMM d, yyyy")}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {map.area !== undefined && (
                        <>
                          <div className="flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded border border-emerald-500/20 font-medium">
                            <SquareDashed className="size-3" />
                            <span>{Number(map.area).toFixed(2)} Shotok</span>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] bg-orange-500/10 text-orange-600 px-1.5 py-0.5 rounded border border-orange-500/20 font-medium">
                            <SquareDashed className="size-3" />
                            <span>{Number(Number(map.area) * 435.6).toFixed(2)} Sq.Ft</span>
                          </div>
                        </>
                      )}
                      {/* {map.perimeter !== undefined && (
                        <div className="flex items-center gap-1 text-[10px] bg-blue-500/10 text-blue-600 px-1.5 py-0.5 rounded border border-blue-500/20 font-medium">
                          <Ruler className="size-3" />
                          <span>{Number(map.perimeter).toFixed(2)} m</span>
                        </div>
                      )} */}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      size="icon-sm"
                      variant="outline"
                      onClick={() => {
                        onLoadMap(map.data);
                        onClose();
                      }}
                    >
                      <Eye className="size-4" />
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="outline"
                      className="text-destructive"
                      onClick={() => handleDelete(map.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {meta && meta.totalPages > 1 && (
          <div className="px-6 py-4 border-t bg-background/50 backdrop-blur-sm mt-auto">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1 || isLoading}
                onClick={() => updateFilter("page", page - 1)}
                className="gap-2 rounded-full px-4"
              >
                <ChevronLeft className="size-4" />
                Previous
              </Button>
              <div className="flex flex-col items-center">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Page</span>
                <span className="text-sm font-bold">
                  {page} / {meta.totalPages}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= meta.totalPages || isLoading}
                onClick={() => updateFilter("page", page + 1)}
                className="gap-2 rounded-full px-4"
              >
                Next
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
