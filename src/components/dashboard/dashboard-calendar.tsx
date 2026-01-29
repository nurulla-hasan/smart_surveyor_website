
"use client";

import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useState } from "react";

export function DashboardCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());

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
