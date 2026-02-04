import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Calendar, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { RescheduleButton } from "@/components/bookings/reschedule-button";
import { CompleteBookingModal } from "@/components/bookings/complete-booking-modal";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Booking } from "@/types/bookings";
import { format, isPast } from "date-fns";
import { useState } from "react";
import { updateBooking, deleteBooking } from "@/services/bookings";
import { SuccessToast, ErrorToast } from "@/lib/utils";
import { ConfirmationModal } from "@/components/ui/custom/confirmation-modal";

interface BookingCardProps {
  booking: Booking;
}

export function BookingCard({ booking }: BookingCardProps) {
  const [loading, setLoading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const isScheduled = booking.status === "scheduled";
  const isRequest = booking.status === "pending";
  const isCompleted = booking.status === "completed";
  const isCancelled = booking.status === "cancelled";
  const isMissed = isScheduled && isPast(new Date(booking.bookingDate)) && !isCompleted;

  const handleStatusUpdate = async (status: string) => {
    setLoading(true);
    try {
      const res = await updateBooking(booking.id, { status });
      if (res?.success) {
        SuccessToast(status === "scheduled" ? "Booking approved" : "Booking status updated");
        // Trigger calendar refresh
        window.dispatchEvent(new CustomEvent("refresh-calendar"));
        setIsConfirmOpen(false);
      } else {
        ErrorToast(res?.message || "Problem updating status");
      }
    } catch {
      ErrorToast("Server problem");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await deleteBooking(booking.id);
      if (res?.success) {
        SuccessToast("Booking deleted successfully");
        // Trigger calendar refresh to update markers
        window.dispatchEvent(new CustomEvent("refresh-calendar"));
        setIsConfirmOpen(false);
      } else {
        ErrorToast(res?.message || "Problem deleting");
      }
    } catch {
      ErrorToast("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn(
      "p-4 rounded-xl border transition-all duration-300 group",
      isMissed 
        ? "border-red-500/30 bg-red-500/5 hover:bg-red-500/10" 
        : isRequest
          ? "border-orange-500/30 bg-orange-500/5 hover:bg-orange-500/10"
          : "bg-card/30 hover:bg-card/50"
    )}>
      <ScrollArea className="w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 min-w-max pb-2">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <h3 className={cn(
                "font-bold text-lg",
                isCompleted ? "text-muted-foreground/50 line-through decoration-2" : "text-foreground"
              )}>
                {booking.title}
              </h3>
              {isMissed && (
                <Badge variant="destructive" className="text-[10px] uppercase font-bold py-0.5 px-2 rounded-full">
                  Missed Survey
                </Badge>
              )}
              {isRequest && (
                <Badge variant="warning" className="text-[10px] uppercase font-bold py-0.5 px-2 rounded-full">
                  Action Required
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-x-4 text-sm text-muted-foreground">
              <p className="flex items-center gap-1.5">
                Client: <span className={cn("font-medium", !isCompleted && "text-foreground")}>{booking.client?.name}</span>
              </p>
              <div className="h-1 w-1 rounded-full bg-border" />
              <p className="flex items-center gap-1.5">
                {format(new Date(booking.bookingDate), "MMMM do, yyyy")}
              </p>
              {booking.amountReceived > 0 && (
                <>
                  <div className="h-1 w-1 rounded-full bg-border" />
                  <p className="flex items-center gap-1.5 font-bold text-emerald-500">
                    Received: ৳{booking.amountReceived}
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isRequest ? (
              <div className="flex items-center gap-2">
                <Button 
                  size="sm" 
                  variant="success" 
                  className="font-bold uppercase border-emerald-500/20 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                  onClick={() => handleStatusUpdate("scheduled")}
                  loading={loading}
                >
                  <CheckCircle2 /> Approve
                </Button>
                
                <ConfirmationModal
                  open={isConfirmOpen}
                  onOpenChange={setIsConfirmOpen}
                  title="Reject Booking"
                  description="Are you sure you want to reject this booking request?"
                  confirmText="Reject"
                  cancelText="Cancel"
                  onConfirm={() => handleStatusUpdate("cancelled")}
                  isLoading={loading}
                  trigger={
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="font-bold uppercase border-red-500/20 text-red-500 hover:bg-red-500/10"
                      disabled={loading}
                      onClick={() => setIsConfirmOpen(true)}
                    >
                      <XCircle /> Reject
                    </Button>
                  }
                />
              </div>
            ) : isScheduled ? (
              <div className="flex items-center gap-2">
                <Badge className="bg-red-600 text-white hover:bg-red-700 font-bold text-[10px] py-1 px-3 rounded-md mr-2">
                  SCHEDULED
                </Badge>

                <CompleteBookingModal bookingId={booking.id} />

                <RescheduleButton
                  bookingId={booking.id}
                  onConfirm={(id, date) => console.log(`Rescheduled ${id} to ${date}`)}
                  trigger={
                    <Button variant="outline" size="sm" className="font-bold uppercase text-xs px-4 border-border/50 text-foreground/80 hover:bg-accent gap-2">
                      <Calendar /> Reschedule
                    </Button>
                  }
                />

                <ConfirmationModal
                  open={isConfirmOpen}
                  onOpenChange={setIsConfirmOpen}
                  title="Cancel Booking"
                  description="Are you sure you want to cancel this booking? It will remain in the History tab."
                  confirmText="Cancel"
                  cancelText="No"
                  onConfirm={() => handleStatusUpdate("cancelled")}
                  isLoading={loading}
                  trigger={
                    <Button 
                      size="icon-sm" 
                      variant="outline" 
                      className="text-red-500/50 hover:text-red-500 hover:bg-red-500/10"
                      onClick={() => setIsConfirmOpen(true)}
                      loading={loading}
                    >
                      <XCircle />
                    </Button>
                  }
                />
              </div>
            ) : isCompleted ? (
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="font-bold text-[10px] py-1 px-3 rounded-md bg-muted/50 text-muted-foreground/80 border-none uppercase">
                  COMPLETED
                </Badge>
              </div>
            ) : isCancelled ? (
              <div className="flex items-center gap-3">
                <Badge variant="destructive" className="font-bold text-[10px] py-1 px-3 rounded-md uppercase">
                  CANCELLED
                </Badge>

                <ConfirmationModal
                  open={isConfirmOpen}
                  onOpenChange={setIsConfirmOpen}
                  title="Delete Booking"
                  description="Are you sure you want to permanently delete this cancelled booking?"
                  confirmText="Delete"
                  cancelText="No"
                  onConfirm={handleDelete}
                  isLoading={loading}
                  trigger={
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-9 w-9 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-lg"
                      onClick={() => setIsConfirmOpen(true)}
                      loading={loading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  }
                />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="font-bold text-[10px] py-1 px-3 rounded-md uppercase">{booking.status}</Badge>
                <ConfirmationModal
                  open={isConfirmOpen}
                  onOpenChange={setIsConfirmOpen}
                  title="Cancel Booking"
                  description="Are you sure you want to cancel this?"
                  confirmText="Cancel"
                  cancelText="No"
                  onConfirm={() => handleStatusUpdate("cancelled")}
                  isLoading={loading}
                  trigger={
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="text-red-500/50 hover:text-red-500 hover:bg-red-500/10"
                      onClick={() => setIsConfirmOpen(true)}
                      loading={loading}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  }
                />
              </div>
            )}
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}

