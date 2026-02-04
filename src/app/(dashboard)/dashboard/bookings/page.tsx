import { getCalendarData } from "@/services/dashboard";
import { getBookings } from "@/services/bookings";
import { BookingsView } from "@/components/bookings/bookings-view";
import { format } from "date-fns";
import { QueryParams } from "@/types/global.type";
import PageHeader from "@/components/ui/custom/page-header";
import { CreateBookingModal } from "@/components/bookings/create-booking-modal";

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

  // Fetch data in parallel
  const [calendarResponse, bookingsResponse] = await Promise.all([
    getCalendarData(params),
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
    pageSize: "1",
  });
  const requestCount = pendingCountResponse?.success
    ? pendingCountResponse.data.meta.totalItems
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
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        pageSize: 10,
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
