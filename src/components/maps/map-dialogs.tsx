 
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
        { value: "none", label: "বুকিং ছাড়া সেভ করুন", original: { client: { name: "কোনো বুকিং নেই" } } },
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
          <DialogTitle>জরিপ সেভ করুন</DialogTitle>
          <DialogDescription>
            জরিপের তথ্য এবং বুকিং আইডি সিলেক্ট করে সেভ করুন।
          </DialogDescription>
        </DialogHeader>

        {stats && (
          <div className="grid grid-cols-2 gap-3 mb-2">
            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3 flex flex-col items-center gap-1">
              <div className="bg-emerald-500/10 p-1.5 rounded-lg text-emerald-600">
                <Maximize2 className="size-4" />
              </div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground">এলাকা</span>
              <span className="text-sm font-black text-emerald-600">{stats.area} শতাংশ</span>
            </div>
            <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-3 flex flex-col items-center gap-1">
              <div className="bg-blue-500/10 p-1.5 rounded-lg text-blue-600">
                <Ruler className="size-4" />
              </div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground">সীমানা দৈর্ঘ্য</span>
              <span className="text-sm font-black text-blue-600">{stats.perimeter} মিটার</span>
            </div>
          </div>
        )}

        <div className="grid gap-4 py-2">
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase ml-1">ম্যাপের নাম</label>
            <Input
              placeholder="উদাঃ প্লট ১০২ জরিপ"
              value={mapName}
              onChange={(e) => setMapName(e.target.value)}
              className="rounded-xl h-12 bg-muted/20 border-white/10"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase ml-1">বুকিং সিলেক্ট করুন (ঐচ্ছিক)</label>
            <SearchableSelect
              onSelect={setSelectedBooking}
              fetchOptions={fetchBookingOptions}
              value={selectedBooking}
              placeholder="একটি বুকিং সিলেক্ট করুন"
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

        <DialogFooter className="gap-2 sm:gap-0 mt-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl h-12">
            বাতিল
          </Button>
          <Button 
            disabled={!mapName || isPending} 
            onClick={onSave}
            className="rounded-xl h-12 bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-900/20 px-8"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            জরিপ সেভ করুন
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
          <DialogTitle>ম্যাপ মুছুন</DialogTitle>
          <DialogDescription>
            আপনি কি নিশ্চিত যে আপনি এই ম্যাপটি মুছে ফেলতে চান? এই কাজটি আর ফিরিয়ে আনা সম্ভব নয়।
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            বাতিল
          </Button>
          <Button variant="destructive" disabled={isPending} onClick={onDelete}>
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            মুছে ফেলুন
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
