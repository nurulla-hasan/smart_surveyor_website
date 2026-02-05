 
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Trash2, Ruler, Maximize2 } from "lucide-react";
import { SearchableSelect, SearchableOption } from "@/components/ui/custom/searchable-select";
import { Booking } from "@/types/bookings";
import { useCallback } from "react";

interface MapSaveDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mapName: string;
  setMapName: (name: string) => void;
  selectedBooking: SearchableOption | null;
  setSelectedBooking: (option: SearchableOption | null) => void;
  bookings: Booking[];
  onSave: () => void;
  isPending: boolean;
  stats?: {
    area: number;
    perimeter: number;
  };
}

export function MapSaveDialog({
  isOpen,
  onOpenChange,
  mapName,
  setMapName,
  selectedBooking,
  setSelectedBooking,
  bookings,
  onSave,
  isPending,
  stats,
}: MapSaveDialogProps) {
  const fetchBookingOptions = useCallback(async (search: string): Promise<SearchableOption[]> => {
    const options = bookings.map((b) => ({
      value: b.id,
      label: b.title,
      original: b,
    }));

    if (!search) {
      // Add "No Booking" option at the top when not searching
      return [
        { value: "none", label: "Save without booking", original: { client: { name: "No booking" } } },
        ...options
      ];
    }
    
    return options.filter(opt => 
      opt.label.toLowerCase().includes(search.toLowerCase()) || 
      opt.original.client?.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [bookings]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md z-5000">
        <DialogHeader>
          <DialogTitle>Save Survey</DialogTitle>
          <DialogDescription>
            Select survey information and booking ID to save.
          </DialogDescription>
        </DialogHeader>

        {stats && (
          <div className="grid grid-cols-2 gap-3 mb-2">
            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3 flex flex-col items-center gap-1">
              <div className="bg-emerald-500/10 p-1.5 rounded-lg text-emerald-600">
                <Maximize2 className="size-4" />
              </div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Area</span>
              <span className="text-sm font-black text-emerald-600">{stats.area} Decimal</span>
            </div>
            <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-3 flex flex-col items-center gap-1">
              <div className="bg-blue-500/10 p-1.5 rounded-lg text-blue-600">
                <Ruler className="size-4" />
              </div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Perimeter</span>
              <span className="text-sm font-black text-blue-600">{stats.perimeter} Meters</span>
            </div>
          </div>
        )}

        <div className="grid gap-4 py-2">
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Map Name</label>
            <Input
              placeholder="e.g. Plot 102 Survey"
              value={mapName}
              onChange={(e) => setMapName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Select Booking (Optional)</label>
            <SearchableSelect
              onSelect={setSelectedBooking}
              fetchOptions={fetchBookingOptions}
              value={selectedBooking}
              placeholder="Select a booking"
              renderOption={(option) => (
                <div className="flex flex-col py-1">
                  <span className="font-bold text-sm">{option.label}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {option.original.client?.name}
                  </span>
                </div>
              )}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            disabled={!mapName || isPending} 
            onClick={onSave}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Survey
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface MapDeleteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
  isPending: boolean;
}

export function MapDeleteDialog({
  isOpen,
  onOpenChange,
  onDelete,
  isPending,
}: MapDeleteDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Map</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this map? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" disabled={isPending} onClick={onDelete}>
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
