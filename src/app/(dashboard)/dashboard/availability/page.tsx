/* eslint-disable @typescript-eslint/no-explicit-any */
import { getBlockedDates } from "@/services/availability";
import { getCalendarData } from "@/services/dashboard";
import { AvailabilityView } from "@/components/dashboard/availability/availability-view";
import PageHeader from "@/components/ui/custom/page-header";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Availability Management | Smart Surveyor",
  description: "Manage your off-days and booking availability.",
};

export default async function AvailabilityPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>;
}) {
  const params = await searchParams;
  const now = new Date();
  const monthNum = params.month ? parseInt(params.month) : now.getMonth() + 1;
  const yearNum = params.year ? parseInt(params.year) : now.getFullYear();

  // Fetch data in parallel on the server using params directly
  const [blockedRes, calendarRes] = await Promise.all([
    getBlockedDates(params),
    getCalendarData(params),
  ]);

  const initialBlockedDates = blockedRes?.data || [];
  const initialBookedDates = (calendarRes?.data?.bookedDates || []).map(
    (d: any) => d.date,
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Availability Management"
        description="Block dates to keep clients from booking."
      />

      <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-xl backdrop-blur-sm relative overflow-hidden">
        <AvailabilityView
          initialBlockedDates={initialBlockedDates}
          initialBookedDates={initialBookedDates}
          currentMonth={monthNum}
          currentYear={yearNum}
        />
      </div>
    </div>
  );
}
