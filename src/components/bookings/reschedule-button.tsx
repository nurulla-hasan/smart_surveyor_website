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
import { bn } from "date-fns/locale";

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
        SuccessToast("বুকিং সফলভাবে রি-শিডিউল করা হয়েছে");
        setDate(pendingDate);
        onConfirm?.(bookingId, pendingDate);
        setOpen(false);
        setIsConfirmOpen(false);
        // Trigger calendar refresh
        window.dispatchEvent(new CustomEvent("refresh-calendar"));
      } else {
        ErrorToast(res?.message || "রি-শিডিউল করতে সমস্যা হয়েছে");
      }
    } catch {
      ErrorToast("সার্ভারে সমস্যা হয়েছে");
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
              loadingText="আপডেট হচ্ছে..."
            >
              <CalendarClock />
              নতুন সময় দিন
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
         title="আপনি কি নিশ্চিত?"
         description={`আপনি কি এই বুকিংটি ${pendingDate ? format(pendingDate, "MMMM dd, yyyy", { locale: bn }) : ""} তারিখে রি-শিডিউল করতে চান?`}
         onConfirm={handleConfirmReschedule}
         isLoading={loading}
         confirmText="নিশ্চিত করুন"
         cancelText="বাতিল"
       />
    </>
  );
}
