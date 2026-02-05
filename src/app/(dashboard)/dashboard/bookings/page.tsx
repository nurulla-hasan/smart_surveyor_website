import { getCalendarData } from "@/services/dashboard";
import { getBookings } from "@/services/bookings";
import { getCurrentUser } from "@/services/auth";
import { redirect } from "next/navigation";
import { BookingsView } from "@/components/dashboard/bookings/bookings-view";
import { format } from "date-fns";
import { QueryParams } from "@/types/global.type";
import PageHeader from "@/components/ui/custom/page-header";
import { CreateBookingModal } from "@/components/dashboard/bookings/create-booking-modal";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Bookings | Smart Surveyor",
  description: "Manage your survey appointments and requests.",
};

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: Promise<QueryParams>;
}) {
  const params = await searchParams;
  const now = new Date();
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch data in parallel
  const [calendarResponse, bookingsResponse] = await Promise.all([
    getCalendarData({
      ...params,
      surveyorId: user?.id,
    }),
    getBookings({
      ...params,
      filter: params.tab || "upcoming",
      date:
        params.tab === "upcoming" || !params.tab
          ? params.date || format(now, "yyyy-MM-dd")
          : undefined,
    }),
  ]);

  // Fetch pending count for the badge
  const pendingCountResponse = await getBookings({
    filter: "pending",
    limit: "1",
  });
  const requestCount = pendingCountResponse?.success
    ? pendingCountResponse.data.meta.total
    : 0;

  // Prepare data
  const bookedDates = (calendarResponse?.data?.bookedDates || []).map(
    (d: { date: string }) => new Date(d.date),
  );
  const blockedDates = (calendarResponse?.data?.blockedDates || []).map(
    (d: { date: string }) => new Date(d.date),
  );

  const initialBookings = bookingsResponse?.success
    ? bookingsResponse.data.bookings
    : [];
  const meta = bookingsResponse?.success
    ? bookingsResponse.data.meta
    : {
        total: 0,
        totalPages: 0,
        page: 1,
        limit: 10,
      };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <PageHeader
          title="Bookings"
          description="Manage your survey appointments and requests."
        />
        <CreateBookingModal />
      </div>

      <BookingsView
        bookedDates={bookedDates}
        blockedDates={blockedDates}
        initialBookings={initialBookings}
        requestCount={requestCount}
        meta={meta}
      />
    </div>
  );
}
