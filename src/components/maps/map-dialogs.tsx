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
import { Loader2, Trash2 } from "lucide-react";

interface MapSaveDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mapName: string;
  setMapName: (name: string) => void;
  onSave: () => void;
  isPending: boolean;
}

export function MapSaveDialog({
  isOpen,
  onOpenChange,
  mapName,
  setMapName,
  onSave,
  isPending,
}: MapSaveDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ম্যাপ সেভ করুন</DialogTitle>
          <DialogDescription>
            পরবর্তীতে ব্যবহারের জন্য ম্যাপটির একটি নাম দিন।
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input
            placeholder="উদাঃ প্লট ১০২ জরিপ"
            value={mapName}
            onChange={(e) => setMapName(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            বাতিল
          </Button>
          <Button disabled={!mapName || isPending} onClick={onSave}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            ম্যাপ সেভ করুন
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
