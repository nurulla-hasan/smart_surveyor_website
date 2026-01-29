/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useState } from "react";

interface DashboardCalendarProps {
  blockedDates?: Date[];
  upcomingBookings?: any[];
}

export function DashboardCalendar({ blockedDates = [], upcomingBookings = [] }: DashboardCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Converting dates to comparable formats
  const isBlocked = (day: Date) => blockedDates.some(d => d.toDateString() === day.toDateString());
  const isBooked = (day: Date) => upcomingBookings.some(b => b.bookingDate.toDateString() === day.toDateString());

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold">Booking Calendar</CardTitle>
        <CardDescription className="text-xs">Overview of blocked and booked dates.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
            <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border-none p-0"
                modifiers={{
                    blocked: (date) => isBlocked(date),
                    booked: (date) => isBooked(date)
                }}
                modifiersClassNames={{
                    blocked: "relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:h-1 after:w-1 after:rounded-full after:bg-red-500 font-bold",
                    booked: "relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:h-1 after:w-1 after:rounded-full after:bg-orange-500 font-bold"
                }}
            />
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2 pt-4 border-t border-border/50">
            <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <span className="text-xs text-muted-foreground font-medium">অফ-ডে (ব্লক করা)</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-orange-500" />
                <span className="text-xs text-muted-foreground font-medium">বুকিং আছে</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
