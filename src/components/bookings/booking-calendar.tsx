"use client";

import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";

interface BookingCalendarProps {
  selectedDate: Date | undefined;
  onSelect: (date: Date | undefined) => void;
}

export function BookingCalendar({ selectedDate, onSelect }: BookingCalendarProps) {
  // Mock data for modifiers
  const modifiers = {
    booked: [new Date(2026, 0, 16), new Date(2026, 0, 15), new Date(2026, 1, 2)],
    blocked: [new Date(2026, 0, 30), new Date(2026, 1, 11)],
  };

  const modifiersClassNames = {
    booked: "bg-orange-500 text-white font-bold rounded-full",
    blocked: "bg-red-500/10 text-red-500 font-bold border border-red-500/20 rounded-full",
  };

  return (
    <Card className="p-4 overflow-hidden min-w-[300px]">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={onSelect}
        className="rounded-md"
        modifiers={modifiers}
        modifiersClassNames={modifiersClassNames}
        classNames={{
          day_selected: "bg-emerald-500 text-white hover:bg-emerald-600 focus:bg-emerald-500 rounded-full",
          day_today: "bg-muted text-foreground font-semibold rounded-full",
        }}
      />
      
      <div className="mt-6 pt-6 border-t space-y-3 px-2">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            অফ-ডে (ব্লক করা)
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]" />
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            বুকিং আছে
          </span>
        </div>
      </div>
    </Card>
  );
}
