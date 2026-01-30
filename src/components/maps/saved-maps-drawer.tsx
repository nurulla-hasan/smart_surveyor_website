/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Folder, Eye, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface SavedMap {
  id: string;
  name: string;
  data: any;
  createdAt: string;
}

interface SavedMapsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedMaps: SavedMap[];
  onLoadMap: (data: any) => void;
  onDeleteMap: (id: string) => void;
}

export function SavedMapsDrawer({
  isOpen,
  onClose,
  savedMaps,
  onLoadMap,
  onDeleteMap,
}: SavedMapsDrawerProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="max-w-md">
        <SheetHeader>
          <SheetTitle>সংরক্ষিত ম্যাপ</SheetTitle>
          <SheetDescription>
            আপনার আগে সেভ করা ম্যাপগুলো লোড অথবা ডিলিট করুন।
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto mt-6">
          {savedMaps.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
              <Folder className="opacity-20 size-12" />
              <p className="mt-4">কোনো সংরক্ষিত ম্যাপ পাওয়া যায়নি।</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {savedMaps.map((map) => (
                <div
                  key={map.id}
                  className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-accent/50 transition-all shadow-sm"
                >
                  <div className="grid gap-1 overflow-hidden">
                    <p className="font-bold truncate">{map.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(map.createdAt), "MMM d, yyyy")}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onLoadMap(map.data)}
                    >
                      <Eye />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onDeleteMap(map.id)}
                    >
                      <Trash2 className="text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
