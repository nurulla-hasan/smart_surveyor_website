"use client";

import * as React from "react";
import { format } from "date-fns";
import { bn } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface AvailabilityDatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  label?: string;
  className?: string;
}

export function AvailabilityDatePicker({ 
  date, 
  setDate, 
  label = "তারিখ নির্বাচন করুন",
  className 
}: AvailabilityDatePickerProps) {
  // Mock data for availability markers
  const modifiers = {
    booked: [new Date(2026, 0, 16), new Date(2026, 0, 15), new Date(2026, 1, 2)],
    blocked: [new Date(2026, 0, 30), new Date(2026, 1, 11)],
  };

  const modifiersClassNames = {
    booked: "bg-orange-500 text-white font-semibold rounded-full shadow-[0_0_10px_rgba(249,115,22,0.3)]",
    blocked: "bg-red-500/20 text-red-500 font-semibold border border-red-500/30 rounded-full",
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon />
          {date ? format(date, "PPP", { locale: bn }) : <span>{label}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
          modifiers={modifiers}
          modifiersClassNames={modifiersClassNames}
          classNames={{
            day_selected: "bg-emerald-500 text-white hover:bg-emerald-600 focus:bg-emerald-500 rounded-full",
            day_today: "bg-muted text-foreground font-semibold rounded-full",
          }}
        />
        <div className="p-4 border-t space-y-2">
            <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">অফ-ডে (ব্লক)</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-orange-500" />
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">বুকিং আছে</span>
            </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
