import { getCalendarData } from "@/services/dashboard";
import { getBookings } from "@/services/bookings";
import { BookingsView } from "@/components/bookings/bookings-view";
import { format } from "date-fns";
import { SearchParams } from "@/types/global.type";
import { Suspense } from "react";

export const metadata = {
  title: "বুকিং | Smart Surveyor",
  description: "আপনার জরিপের অ্যাপয়েন্টমেন্ট এবং অনুরোধগুলো পরিচালনা করুন।",
};

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const now = new Date();
  
  // Parse month/year from URL or use current date for calendar dot indicators
  const month = typeof params.month === "string" ? parseInt(params.month) : now.getMonth() + 1;
  const year = typeof params.year === "string" ? parseInt(params.year) : now.getFullYear();
  const page = typeof params.page === "string" ? params.page : "1";
  const pageSize = typeof params.pageSize === "string" ? params.pageSize : "10";

  // Determine active tab and filters
  const activeTab = typeof params.tab === "string" ? params.tab : "upcoming";
  const dateFilter = typeof params.date === "string" ? params.date : (activeTab === "upcoming" ? format(now, "yyyy-MM-dd") : undefined);

  let statusFilter = "upcoming";
  
  if (activeTab === "pending") {
    statusFilter = "pending";
  } else if (activeTab === "past") {
    statusFilter = "past";
  } else {
    statusFilter = "upcoming";
  }

  // Fetch data in parallel since rate limits are removed
  const [calendarResponse, bookingsResponse] = await Promise.all([
    getCalendarData(month, year),
    getBookings({ 
      filter: statusFilter, 
      date: statusFilter === "upcoming" ? dateFilter : undefined,
      page,
      pageSize 
    })
  ]);
  
  // Only fetch pending count if current filter is not pending
  let requestCount = 0;
  if (statusFilter === "pending") {
    requestCount = bookingsResponse?.success ? bookingsResponse.data.meta.totalItems : 0;
  } else {
    const pendingCountResponse = await getBookings({ filter: "pending", pageSize: "1" });
    requestCount = pendingCountResponse?.success ? pendingCountResponse.data.meta.totalItems : 0;
  }
  
  // Prepare data
  const bookedDates = (calendarResponse?.data?.bookedDates || []).map((d: { date: string }) => new Date(d.date));
  const blockedDates = (calendarResponse?.data?.blockedDates || []).map((d: { date: string }) => new Date(d.date));
  
  const bookingsData = bookingsResponse;

  const initialBookings = bookingsData?.success ? bookingsData.data.bookings : [];
  const meta = bookingsData?.success ? bookingsData.data.meta : {
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 10
  };

  return (
    <Suspense fallback={<div>লোড হচ্ছে...</div>}>
      <BookingsView 
        bookedDates={bookedDates}
        blockedDates={blockedDates}
        initialBookings={initialBookings}
        requestCount={requestCount}
        meta={meta}
      />
    </Suspense>
  );
}
