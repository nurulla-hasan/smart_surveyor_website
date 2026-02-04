/* eslint-disable @typescript-eslint/no-explicit-any */
import { getBlockedDates } from "@/services/availability";
import { getCalendarData } from "@/services/dashboard";
import { AvailabilityView } from "@/components/availability/availability-view";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import PageHeader from "@/components/ui/custom/page-header";

export const metadata = {
  title: "প্রাপ্যতা ব্যবস্থাপনা | Smart Surveyor",
  description: "আপনার অফ-ডে এবং বুকিং প্রাপ্যতা পরিচালনা করুন।",
};

export default async function AvailabilityPage() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  // Fetch initial data in parallel to save time
  const [blockedRes, calendarRes] = await Promise.all([
    getBlockedDates(month, year),
    getCalendarData(month, year)
  ]);

  const initialBlockedDates = blockedRes?.success ? blockedRes.data : [];
  const initialBookedDates = calendarRes?.success 
    ? (calendarRes.data.bookedDates || []).map((d: any) => d.date) 
    : [];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Availability Management"
        description="Block dates to keep clients from booking."
      />
      <Suspense fallback={
        <div className="flex h-100 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }>
        <AvailabilityView 
          initialBlockedDates={initialBlockedDates} 
          initialBookedDates={initialBookedDates}
        />
      </Suspense>
    </div>
  );
}
