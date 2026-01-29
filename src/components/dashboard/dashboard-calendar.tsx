"use client";

import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { isSameDay } from "date-fns";
import { useSmartFilter } from "@/hooks/useSmartFilter";

interface DashboardCalendarProps {
  blockedDates?: { date: string; reason: string | null }[];
  bookedDates?: { date: string; title: string; status: string }[];
}

export function DashboardCalendar({ blockedDates = [], bookedDates = [] }: DashboardCalendarProps) {
  const { getFilter, updateBatch } = useSmartFilter();
  
  // Get month/year from URL or default to current
  const urlMonth = getFilter("month");
  const urlYear = getFilter("year");
  
  // Calculate current month from URL or default to now
  const currentMonth = urlMonth && urlYear 
    ? new Date(parseInt(urlYear), parseInt(urlMonth) - 1) 
    : new Date();

  const handleMonthChange = (newMonth: Date) => {
    updateBatch({
      month: newMonth.getMonth() + 1,
      year: newMonth.getFullYear(),
    });
  };

  // Modifiers for the calendar
  const modifiers = {
    blocked: (date: Date) => blockedDates.some(d => isSameDay(new Date(d.date), date)),
    booked: (date: Date) => bookedDates.some(d => isSameDay(new Date(d.date), date)),
  };

  return (
    <Card className="border-border/50 shadow-sm overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold tracking-tight">Booking Calendar</CardTitle>
        <CardDescription className="text-sm text-muted-foreground/80">Overview of blocked and booked dates.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-0">
        <div className="flex justify-center -mx-3">
            <Calendar
                month={currentMonth}
                onMonthChange={handleMonthChange}
                className="p-0"
                modifiers={modifiers}
                modifiersClassNames={{
                    blocked: "bg-red-500/10 text-red-500 font-bold rounded-full",
                    booked: "bg-[#FF6B00] text-white font-bold rounded-full",
                }}
                classNames={{
                    month_caption: "flex justify-center relative items-center mb-4 px-10",
                    caption_label: "text-base font-semibold",
                    nav: "flex items-center gap-1 absolute inset-x-0 justify-between px-2 w-full",
                    button_previous: "h-8 w-8 bg-transparent hover:bg-accent rounded-full p-0 flex items-center justify-center transition-colors z-20 pointer-events-auto [&_svg]:pointer-events-none",
                    button_next: "h-8 w-8 bg-transparent hover:bg-accent rounded-full p-0 flex items-center justify-center transition-colors z-20 pointer-events-auto [&_svg]:pointer-events-none",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex justify-between mb-2",
                    head_cell: "text-muted-foreground w-9 font-medium text-[13px]",
                    row: "flex w-full mt-2 justify-between gap-1",
                    cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 rounded-full",
                    day: "h-9 w-9 p-0 font-normal rounded-full flex items-center justify-center transition-all cursor-default",
                    day_today: "bg-accent/30 text-accent-foreground font-bold",
                    day_outside: "text-muted-foreground/30 opacity-50",
                }}
            />
        </div>

        {/* Legend */}
        <div className="space-y-3 pt-6 border-t border-border/40">
            <div className="flex items-center gap-3 group transition-all">
                <div className="h-2.5 w-2.5 rounded-full bg-red-600/80 shadow-[0_0_8px_rgba(220,38,38,0.3)]" />
                <span className="text-xs text-muted-foreground/90 font-medium group-hover:text-foreground transition-colors">অফ-ডে (ব্লক করা)</span>
            </div>
            <div className="flex items-center gap-3 group transition-all">
                <div className="h-2.5 w-2.5 rounded-full bg-[#FF6B00] shadow-[0_0_8px_rgba(255,107,0,0.3)]" />
                <span className="text-xs text-muted-foreground/90 font-medium group-hover:text-foreground transition-colors">বুকিং আছে</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
