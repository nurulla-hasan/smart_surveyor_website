"use client";

import { useState, useCallback, useEffect } from "react";
import { useSmartFilter } from "@/hooks/useSmartFilter";
import { Inbox } from "lucide-react";
import { BookingCalendar } from "@/components/bookings/booking-calendar";
import { BookingTabs, BookingTab } from "@/components/bookings/booking-tabs";
import { BookingCard } from "@/components/bookings/booking-card";
import { Booking } from "@/types/bookings";
import { format, isSameDay } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import CustomPagination from "@/components/ui/custom/CustomPagination";

interface BookingsViewProps {
  bookedDates: Date[];
  blockedDates: Date[];
  initialBookings: Booking[];
  requestCount: number;
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}

export function BookingsView({ 
  blockedDates, 
  initialBookings, 
  requestCount,
  meta
}: BookingsViewProps) {
  const { updateFilter, updateBatch, getFilter } = useSmartFilter();
  
  // Initialize selectedDate from URL or default to matching server logic (today)
  const dateParam = getFilter("date");
  const initialDate = dateParam ? new Date(dateParam) : new Date();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(initialDate);
  
  // Sync selectedDate state when URL changes
  useEffect(() => {
    if (dateParam) {
      setSelectedDate(new Date(dateParam));
    } else {
      setSelectedDate(new Date());
    }
  }, [dateParam]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      updateFilter("date", format(date, "yyyy-MM-dd"));
    } else {
      updateFilter("date", null);
    }
  };
  
  // Prevent selecting blocked dates initially or when data loads
  useEffect(() => {
    if (selectedDate && blockedDates.some((blocked) => isSameDay(blocked, selectedDate))) {
      setSelectedDate(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockedDates]);
  
  // Initialize activeTab from URL or default to upcoming
  const activeTab = (getFilter("tab") as BookingTab) || "upcoming";

  // Handle Tab Change with URL sync logic
  const handleTabChange = (tab: BookingTab) => {
    updateFilter("tab", tab);
  };

  // Handle month change to fetch new data from server
  const handleMonthChange = useCallback((date: Date) => {
    updateBatch({
      month: (date.getMonth() + 1).toString(),
      year: date.getFullYear().toString()
    });
  }, [updateBatch]);

  const getTabTitle = () => {
    switch (activeTab) {
      case "upcoming":
        return `Appointments for ${selectedDate ? format(selectedDate, "MMMM do, yyyy") : "Today"}`;
      case "pending":
        return "Public Booking Requests";
      case "past":
        return "Past Bookings";
      default:
        return "";
    }
  };

  const getTabDescription = () => {
    switch (activeTab) {
      case "upcoming":
        return `You have ${initialBookings.length} booking(s) for this date.`;
      case "pending":
        return "Review and approve new survey requests from the public page.";
      case "past":
        return "History of completed surveys.";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar Calendar */}
        <div className="lg:col-span-4">
          <BookingCalendar
            selectedDate={selectedDate}
            onSelect={handleDateSelect}
            onMonthChange={handleMonthChange}
          />
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-6">
          <BookingTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
            requestCount={requestCount}
          />

          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-xl backdrop-blur-sm relative overflow-hidden">
            {/* Decorative background glow */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-bold uppercase text-foreground">
                  {getTabTitle()}
                </h2>
                <p className="text-sm text-muted-foreground font-medium">
                  {getTabDescription()}
                </p>
              </div>

              <ScrollArea className="h-120 pr-4">
                <div className="space-y-6">
                  {initialBookings.length > 0 ? (
                    initialBookings.map((booking) => (
                      <BookingCard
                        key={booking.id}
                        booking={booking}
                      />
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-40">
                      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                        <Inbox className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold uppercase">No bookings found</p>
                        <p className="text-xs">There are no appointments for this date.</p>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Pagination */}
              {meta.totalPages > 1 && (
                <div className="pt-4 border-t border-border/10">
                  <CustomPagination currentPage={meta.currentPage} totalPages={meta.totalPages} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
