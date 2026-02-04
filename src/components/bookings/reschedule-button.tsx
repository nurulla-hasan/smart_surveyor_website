"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarClock } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BookingCalendar } from "@/components/bookings/booking-calendar";
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
       />
    </>
  );
}
