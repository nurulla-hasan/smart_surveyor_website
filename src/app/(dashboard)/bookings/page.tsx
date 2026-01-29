"use client";

import { useState } from "react";
import PageHeader from "@/components/ui/custom/page-header";
import { Inbox } from "lucide-react";
import { BookingCalendar } from "@/components/bookings/booking-calendar";
import { BookingTabs, BookingTab } from "@/components/bookings/booking-tabs";
import { BookingCard, Booking } from "@/components/bookings/booking-card";
import { CreateBookingModal } from "@/components/bookings/create-booking-modal";
import { format } from "date-fns";

// Mock Data
const MOCK_BOOKINGS: Booking[] = [
  {
    id: "1",
    title: "Jomi map",
    clientName: "Golap hasan",
    date: "2026-02-01",
    type: "SCHEDULED",
    status: "SCHEDULED"
  },
  {
    id: "2",
    title: "In voluptatem ipsa",
    clientName: "Jane Smith",
    date: "2026-01-29",
    type: "SCHEDULED",
    status: "SCHEDULED",
    isActionRequired: true
  },
  {
    id: "3",
    title: "IPSAM DOLORE LABORIS - Torimpur - 22",
    clientName: "Fake User • Fake User",
    date: "February 4th, 2026",
    type: "REQUEST",
    status: "PENDING",
    location: "Dinajpur"
  },
  {
    id: "4",
    title: "Survey for Plot A",
    clientName: "Jane Smith",
    date: "January 16th, 2026",
    type: "HISTORY",
    status: "COMPLETED",
    amount: 1500
  },
  {
    id: "5",
    title: "Survey for Plot A",
    clientName: "Jane Smith",
    date: "January 15th, 2026",
    type: "HISTORY",
    status: "COMPLETED",
    amount: 3000
  }
];

export default function BookingsPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState<BookingTab>("SCHEDULED");

  // Filter bookings based on active tab
  const filteredBookings = MOCK_BOOKINGS.filter(b => b.type === activeTab);
  const requestCount = MOCK_BOOKINGS.filter(b => b.type === "REQUEST").length;

  const getTabTitle = () => {
    switch (activeTab) {
      case "SCHEDULED":
        return `${selectedDate ? format(selectedDate, "MMMM do, yyyy") : "আজকের"}-এর অ্যাপয়েন্টমেন্ট`;
      case "REQUEST":
        return "পাবলিক বুকিং অনুরোধ";
      case "HISTORY":
        return "অতীত বুকিং";
      default:
        return "";
    }
  };

  const getTabDescription = () => {
    switch (activeTab) {
      case "SCHEDULED":
        return `আজ আপনার ${filteredBookings.length}টি বুকিং আছে।`;
      case "REQUEST":
        return "পাবলিক পেজ থেকে নতুন জরিপ অনুরোধগুলো পর্যালোচনা এবং অনুমোদন করুন।";
      case "HISTORY":
        return "সম্পন্ন হওয়া জরিপগুলোর ইতিহাস।";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader 
          title="বুকিং" 
          description="আপনার জরিপের অ্যাপয়েন্টমেন্ট এবং অনুরোধগুলো পরিচালনা করুন।" 
        />
        <CreateBookingModal 
           onConfirm={(data) => console.log("New Booking:", data)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar Calendar */}
        <div className="lg:col-span-4 sticky top-6">
          <BookingCalendar 
            selectedDate={selectedDate} 
            onSelect={setSelectedDate} 
          />
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-6">
          <BookingTabs 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
            requestCount={requestCount}
          />

          <div className="bg-card/20 border border-border/50 rounded-2xl p-6 min-h-[500px] shadow-xl backdrop-blur-sm relative overflow-hidden">
             {/* Decorative background glow */}
             <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
             
             <div className="relative space-y-6">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold uppercase text-foreground">
                    {getTabTitle()}
                  </h2>
                  <p className="text-sm text-muted-foreground font-medium">
                    {getTabDescription()}
                  </p>
                </div>

                <div className="space-y-4">
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => (
                      <BookingCard 
                        key={booking.id} 
                        booking={booking}
                        onDelete={(id) => console.log("Delete:", id)}
                      />
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-40">
                      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                        <Inbox className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold uppercase">কোনো বুকিং পাওয়া যায়নি</p>
                        <p className="text-xs">এই তারিখে কোনো অ্যাপয়েন্টমেন্ট নেই।</p>
                      </div>
                    </div>
                  )}
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
