"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, MapPin, Trash2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { RescheduleButton } from "@/components/bookings/reschedule-button";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

export interface Booking {
  id: string;
  title: string;
  clientName: string;
  date: string;
  type: "SCHEDULED" | "REQUEST" | "HISTORY";
  status: string;
  location?: string;
  amount?: number;
  isActionRequired?: boolean;
}

interface BookingCardProps {
  booking: Booking;
  onDelete?: (id: string) => void;
}

export function BookingCard({ booking, onDelete }: BookingCardProps) {
  const isScheduled = booking.type === "SCHEDULED";
  const isRequest = booking.type === "REQUEST";

  return (
    <div className={cn(
      "p-4 rounded-xl border transition-all duration-300",
      booking.isActionRequired
        ? "border-orange-500/30 bg-orange-500/5 hover:bg-orange-500/10"
        : "bg-card/30"
    )}>
      <ScrollArea className="w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 min-w-max pb-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg uppercase">
                {booking.title}
              </h3>
              {booking.isActionRequired && (
                <Badge variant="warning" className="text-[10px] uppercase font-semibold py-0">
                  পদক্ষেপ প্রয়োজন
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <p className="flex items-center gap-1.5 font-medium">
                ক্লায়েন্ট: <span className="text-foreground">{booking.clientName}</span>
              </p>
              {booking.location && (
                <p className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {booking.location}
                </p>
              )}
              {booking.amount && (
                <p className="flex items-center gap-1.5 font-semibold text-emerald-500">
                  প্রাপ্তি: ৳{booking.amount}
                </p>
              )}
              {isRequest && (
                <p className="text-orange-500 font-medium">
                  {booking.date}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isRequest ? (
              <>
                <Button size="sm" variant="success" className="font-semibold uppercase text-xs">
                  <CheckCircle2 /> অনুমোদন দিন
                </Button>
                <Button size="sm" variant="outline" className="font-semibold uppercase text-xs text-destructive">
                  <XCircle /> প্রত্যাখ্যান করুন
                </Button>
              </>
            ) : isScheduled ? (
              <div className="flex items-center gap-2">
                <Badge variant="success">SCHEDULED</Badge>

                <Button size="sm" variant="outline" className="font-semibold uppercase text-xs text-primary flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" /> সম্পন্ন
                </Button>

                <RescheduleButton
                  bookingId={booking.id}
                  onConfirm={(id, date) => console.log(`Rescheduled ${id} to ${date}`)}
                />

                <Button size="icon" variant="outline" className="text-destructive h-8 w-8" onClick={() => onDelete?.(booking.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <Badge variant="success">{booking.status}</Badge>
                <Button size="icon" variant="outline" className="text-destructive" onClick={() => onDelete?.(booking.id)}>
                  <Trash2 />
                </Button>
              </>
            )}
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
