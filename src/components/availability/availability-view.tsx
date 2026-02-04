/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Info, Calendar as CalendarIcon, Trash2, Loader2 } from "lucide-react";
import { format, isSameDay, isBefore, startOfDay } from "date-fns";
import { enUS } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  getBlockedDates,
  toggleBlockedDate,
  BlockedDate,
} from "@/services/availability";
import { getCalendarData } from "@/services/dashboard";
import { ScrollArea } from "../ui/scroll-area";

interface AvailabilityViewProps {
  initialBlockedDates: BlockedDate[];
  initialBookedDates: string[];
}

export function AvailabilityView({
  initialBlockedDates,
  initialBookedDates,
}: AvailabilityViewProps) {
  const [blockedDates, setBlockedDates] =
    useState<BlockedDate[]>(initialBlockedDates);
  const [bookedDates, setBookedDates] = useState<Date[]>(
    initialBookedDates.map((d) => new Date(d)),
  );
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);
  const [togglingDate, setTogglingDate] = useState<string | null>(null);
  const isInitialMount = React.useRef(true);

  const fetchAvailability = async (date: Date) => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    setLoading(true);
    try {
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      const [blockedRes, calendarRes] = await Promise.all([
        getBlockedDates(month, year),
        getCalendarData(month, year),
      ]);

      if (blockedRes?.success) {
        setBlockedDates(blockedRes.data);
      }

      if (calendarRes?.success) {
        const booked = (calendarRes.data.bookedDates || []).map(
          (d: any) => new Date(d.date),
        );
        setBookedDates(booked);
      }
    } catch (error) {
      console.error("Error fetching availability:", error);
      toast.error("Problem loading information");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailability(currentMonth);
  }, [currentMonth]);

  const handleToggleDate = async (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");

    const isBooked = bookedDates.some((d) => isSameDay(d, date));
    if (isBooked) {
      toast.error("This date already has a booking, so it cannot be blocked.");
      return;
    }

    if (isBefore(date, startOfDay(new Date()))) {
      toast.error("You cannot block past dates.");
      return;
    }

    setTogglingDate(dateStr);
    try {
      const res = await toggleBlockedDate(dateStr);
      if (res?.success) {
        toast.success(res.message || "Updated successfully");
        fetchAvailability(currentMonth);
      } else {
        toast.error(res?.message || "Something went wrong");
      }
    } catch {
      toast.error("Server problem");
    } finally {
      setTogglingDate(null);
    }
  };

  const modifiers = {
    blocked: (date: Date) =>
      blockedDates.some((d) => isSameDay(new Date(d.date), date)),
    booked: (date: Date) => bookedDates.some((d) => isSameDay(d, date)),
    past: (date: Date) => isBefore(date, startOfDay(new Date())),
  };

  return (
    <div className="space-y-6 relative">
      {/* Loading Overlay */}
      {togglingDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-[2px]">
          <div className="bg-card border border-border/50 rounded-2xl p-8 flex flex-col items-center gap-4 min-w-50">
            <div className="relative">
              <div className="h-12 w-12 rounded-full border-4 border-emerald-500/20" />
              <div className="absolute inset-0 h-12 w-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
            </div>
            <p className="text-sm font-bold text-foreground">Updating...</p>
          </div>
        </div>
      )}

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-border/50 shadow-none overflow-hidden">
            <CardHeader className="pb-4 border-b border-border/40">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-emerald-500" />
                <CardTitle className="text-xl font-bold">
                  Off-Day Management
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  month={currentMonth}
                  onMonthChange={setCurrentMonth}
                  onDayClick={handleToggleDate}
                  className={cn(
                    "p-0 pointer-events-auto",
                    "[&_button[data-selected-single=true]]:bg-transparent!",
                    "[&_button[data-selected-single=true]]:text-foreground!",
                  )}
                  modifiers={modifiers}
                  modifiersClassNames={{
                    blocked:
                      "bg-rose-900 text-white font-bold rounded-full transition-colors",
                    booked:
                      "bg-orange-500 text-white font-bold rounded-full cursor-not-allowed",
                    past: "text-muted-foreground opacity-50 pointer-events-none",
                  }}
                  classNames={{
                    day_selected:
                      "bg-transparent! text-foreground! border-2 border-primary z-30",
                    day_today:
                      "bg-accent text-accent-foreground font-bold border-2 border-primary/20",
                  }}
                />
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center justify-center gap-6 mt-8 pt-6 border-t border-border/40">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-rose-900" />
                  <span className="text-xs font-medium text-muted-foreground">
                    Blocked
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-orange-500" />
                  <span className="text-xs font-medium text-muted-foreground">
                    Booked
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full border border-border" />
                  <span className="text-xs font-medium text-muted-foreground">
                    Available
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full border-2 border-primary" />
                  <span className="text-xs font-medium text-muted-foreground">
                    Selected
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-sm font-semibold">
                  Instructions
                </CardTitle>
              </div>
              <CardDescription>
                Set off-days from here to avoid bookings on holidays or
                personal work days.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold">Blocked Dates</CardTitle>
              <CardDescription>
                {blockedDates.length} dates are marked as off
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-100 whitespace-nowrap">
                <div className="space-y-3">
                  {loading && blockedDates.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                      <Loader2 className="h-8 w-8 animate-spin mb-4" />
                      <p className="text-sm">Loading...</p>
                    </div>
                  ) : blockedDates.length > 0 ? (
                    blockedDates.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 rounded-xl border transition-all group"
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-bold">
                            {format(new Date(item.date), "MMMM dd, yyyy", {
                              locale: enUS,
                            })}
                          </span>
                          {item.reason && (
                            <span className="text-[10px] text-muted-foreground">
                              {item.reason}
                            </span>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleToggleDate(new Date(item.date))}
                          disabled={togglingDate === item.date}
                        >
                          {togglingDate === item.date ? (
                            <Loader2 className="animate-spin" />
                          ) : (
                            <Trash2 />
                          )}
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center opacity-40">
                      <CalendarIcon className="h-12 w-12 mb-4" />
                      <p className="text-sm font-medium">No dates blocked</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
