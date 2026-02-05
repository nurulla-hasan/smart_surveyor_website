"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarClock, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const TIME_SLOTS = [
  "08:00 AM",
  "10:00 AM",
  "12:00 PM",
  "02:00 PM",
  "04:00 PM"
];
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BookingCalendar } from "@/components/dashboard/bookings/booking-calendar";
import { updateBooking } from "@/services/bookings";
import { format } from "date-fns";
import { SuccessToast, ErrorToast } from "@/lib/utils";
import { ConfirmationModal } from "@/components/ui/custom/confirmation-modal";
import { enUS } from "date-fns/locale";

interface RescheduleButtonProps {
  bookingId: string;
  onConfirm?: (id: string, newDate: Date) => void;
  trigger?: React.ReactNode;
}

export function RescheduleButton({ bookingId, onConfirm, trigger }: RescheduleButtonProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [pendingDate, setPendingDate] = useState<Date | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;
    setPendingDate(selectedDate);
    setIsConfirmOpen(true);
  };

  const handleConfirmReschedule = async () => {
    if (!pendingDate) return;

    setLoading(true);
    try {
      const res = await updateBooking(bookingId, {
        bookingDate: format(pendingDate, "yyyy-MM-dd"),
        bookingTime: selectedTime || undefined,
      });

      if (res?.success) {
        SuccessToast("Booking rescheduled successfully");
        setDate(pendingDate);
        onConfirm?.(bookingId, pendingDate);
        setOpen(false);
        setIsConfirmOpen(false);
        // Trigger calendar refresh
        window.dispatchEvent(new CustomEvent("refresh-calendar"));
      } else {
        ErrorToast(res?.message || "Problem rescheduling");
      }
    } catch {
      ErrorToast("Server problem");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {trigger || (
            <Button 
              size="sm" 
              variant="outline" 
              loading={loading}
              loadingText="Updating..."
            >
              <CalendarClock />
              Reschedule
            </Button>
          )}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <BookingCalendar
            selectedDate={date}
            onSelect={handleSelect}
            showLegend={true}
            className="border-none shadow-none"
            disableBookedDates={true}
          />
        </PopoverContent>
      </Popover>

      <ConfirmationModal
         open={isConfirmOpen}
         onOpenChange={setIsConfirmOpen}
         title="Are you sure?"
         description={`Are you sure you want to reschedule this booking to ${pendingDate ? format(pendingDate, "MMMM dd, yyyy", { locale: enUS }) : ""}?`}
         onConfirm={handleConfirmReschedule}
         isLoading={loading}
         confirmText="Confirm"
         cancelText="Cancel"
       >
         <div className="space-y-3 py-4">
           <p className="text-sm font-semibold uppercase text-muted-foreground">Select New Time (Optional)</p>
           <div className="grid grid-cols-3 gap-2">
             {TIME_SLOTS.map((slot) => (
               <button
                 key={slot}
                 type="button"
                 onClick={() => setSelectedTime(selectedTime === slot ? "" : slot)}
                 className={cn(
                   "flex items-center justify-center gap-1.5 py-2 px-1 rounded-xl border text-[11px] font-bold transition-all",
                   selectedTime === slot
                     ? "border-primary bg-primary/10 text-primary ring-1 ring-primary"
                     : "border-border/50 hover:border-primary/30 hover:bg-muted/50 text-muted-foreground"
                 )}
               >
                 <Clock className="h-3 w-3" />
                 {slot}
               </button>
             ))}
           </div>
         </div>
       </ConfirmationModal>
    </>
  );
}
