"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarClock } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface RescheduleButtonProps {
  bookingId: string;
  onConfirm?: (id: string, newDate: Date) => void;
}

export function RescheduleButton({ bookingId, onConfirm }: RescheduleButtonProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      onConfirm?.(bookingId, selectedDate);
    }
  };

  // Mock data for availability markers (should ideally come from props or a hook)
  const modifiers = {
    booked: [new Date(2026, 0, 16), new Date(2026, 0, 15), new Date(2026, 1, 2)],
    blocked: [new Date(2026, 0, 30), new Date(2026, 1, 11)],
  };

  const modifiersClassNames = {
    booked: "bg-orange-500 text-white font-black rounded-full shadow-[0_0_10px_rgba(249,115,22,0.3)]",
    blocked: "bg-red-500/20 text-red-500 font-black border border-red-500/30 rounded-full",
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          size="sm" 
          variant="outline" 
          className="gap-2 font-bold uppercase h-9 border-border/50"
        >
          <CalendarClock className="h-4 w-4" />
          নতুন সময় দিন
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 border-border/50 bg-slate-900 shadow-2xl" align="end">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
          modifiers={modifiers}
          modifiersClassNames={modifiersClassNames}
          classNames={{
            day_selected: "bg-emerald-500 text-white hover:bg-emerald-600 focus:bg-emerald-500 rounded-full",
            day_today: "bg-muted text-foreground font-black rounded-full",
          }}
        />
        <div className="p-4 border-t border-border/50 space-y-2">
            <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <span className="text-[10px] text-muted-foreground uppercase font-black">অফ-ডে (ব্লক)</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-orange-500" />
                <span className="text-[10px] text-muted-foreground uppercase font-black">বুকিং আছে</span>
            </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
