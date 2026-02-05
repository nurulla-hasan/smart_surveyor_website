 
"use client";

import React, { useState, useEffect } from "react";
import { Info, Calendar as CalendarIcon, Trash2, Loader2 } from "lucide-react";
import { format, isSameDay, isBefore, startOfDay } from "date-fns";
import { enUS } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  toggleBlockedDate,
  BlockedDate,
} from "@/services/availability";
import { ScrollArea } from "../../ui/scroll-area";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface AvailabilityViewProps {
  initialBlockedDates: BlockedDate[];
  initialBookedDates: string[];
  currentMonth: number;
  currentYear: number;
}

export function AvailabilityView({
  initialBlockedDates,
  initialBookedDates,
  currentMonth: initialMonthNum,
  currentYear: initialYearNum,
}: AvailabilityViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [blockedDates, setBlockedDates] =
    useState<BlockedDate[]>(initialBlockedDates);
  const [bookedDates, setBookedDates] = useState<Date[]>(
    initialBookedDates.map((d) => new Date(d)),
  );
  const [loading] = useState(false);
  const [togglingDate, setTogglingDate] = useState<string | null>(null);

  // Sync state with props when they change (due to server refresh or navigation)
  useEffect(() => {
    setBlockedDates(initialBlockedDates);
    setBookedDates(initialBookedDates.map((d) => new Date(d)));
  }, [initialBlockedDates, initialBookedDates]);

  const handleMonthChange = (date: Date) => {
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", month.toString());
    params.set("year", year.toString());
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

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
      const res = await toggleBlockedDate({ 
        date: dateStr, 
        reason: "Off-day" 
      });
      if (res?.success) {
        toast.success(res.message || "Updated successfully");
        router.refresh();
      } else {
        toast.error(res?.message || "Something went wrong");
      }
    } catch {
      toast.error("Server problem");
    } finally {
      setTogglingDate(null);
    }
  };

  const currentMonthDate = new Date(initialYearNum, initialMonthNum - 1);

  const modifiers = {
    blocked: (date: Date) =>
      blockedDates.some((d) => isSameDay(new Date(d.date), date)),
    booked: (date: Date) => bookedDates.some((d) => isSameDay(d, date)),
    past: (date: Date) => isBefore(date, startOfDay(new Date())),
  };

  return (
    <div className="relative">
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
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-2">
              <CalendarIcon className="h-5 w-5 text-emerald-500" />
              <h3 className="text-xl font-bold">Off-Day Management</h3>
            </div>
            
            <div className="flex justify-center p-8 bg-background/30 rounded-2xl border border-border/40">
              <Calendar
                mode="single"
                month={currentMonthDate}
                onMonthChange={handleMonthChange}
                onDayClick={handleToggleDate}
                className={cn(
                  "pointer-events-auto rounded-2xl relative border border-border/50",
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
                  months: "w-full",
                  month: "w-full space-y-4 relative",
                  month_caption: "flex justify-center pt-2 relative items-center w-full mb-8",
                  caption_label: "text-base sm:text-lg font-bold",
                  nav: "flex items-center justify-between w-full absolute top-2 inset-x-0 px-2 z-10",
                  button_previous: "h-9 w-9 bg-background/50 border border-border/40 rounded-full flex items-center justify-center hover:bg-accent transition-colors",
                  button_next: "h-9 w-9 bg-background/50 border border-border/40 rounded-full flex items-center justify-center hover:bg-accent transition-colors",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex w-full justify-between",
                  head_cell: "text-muted-foreground rounded-md w-10 sm:w-14 font-normal text-[0.8rem] sm:text-sm",
                  row: "flex w-full mt-2 justify-between",
                  cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent",
                  day: cn(
                    "h-10 w-10 sm:h-14 sm:w-14 p-0 font-normal aria-selected:opacity-100 hover:bg-accent transition-all rounded-full"
                  ),
                  day_selected:
                    "bg-transparent! text-foreground! border-2 border-primary z-30 rounded-full",
                  day_today:
                    "bg-accent text-accent-foreground font-bold border-2 border-primary/20 rounded-full",
                }}
              />
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-6 py-4 border-t border-border/40">
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
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-4 w-4 text-emerald-600" />
              <h4 className="text-sm font-bold text-emerald-700">Instructions</h4>
            </div>
            <p className="text-xs leading-relaxed text-emerald-600/80">
              Set off-days from here to avoid bookings on holidays or
              personal work days.
            </p>
          </div>

          <div className="space-y-4">
            <div className="px-2">
              <h3 className="text-lg font-bold">Blocked Dates</h3>
              <p className="text-xs text-muted-foreground">
                {blockedDates.length} dates are marked as off
              </p>
            </div>
            
            <ScrollArea className="h-120 pr-4">
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
                      className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-background/50 transition-all hover:border-primary/30 group"
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
                        size="icon-sm"
                        className="text-destructive hover:bg-destructive/10 border-border/50"
                        onClick={() => handleToggleDate(new Date(item.date))}
                        disabled={togglingDate === item.date}
                      >
                        {togglingDate === item.date ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          <Trash2  />
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
          </div>
        </div>
      </div>
    </div>
  );
}
