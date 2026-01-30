import { getCalendarData } from "@/services/dashboard";
import { BookingsView } from "@/components/bookings/bookings-view";

export const metadata = {
  title: "বুকিং | Smart Surveyor",
  description: "আপনার জরিপের অ্যাপয়েন্টমেন্ট এবং অনুরোধগুলো পরিচালনা করুন।",
};

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string; tab?: string }>;
}) {
  const params = await searchParams;
  const now = new Date();
  
  // Parse month/year from URL or use current date
  const month = params.month ? parseInt(params.month) : now.getMonth() + 1;
  const year = params.year ? parseInt(params.year) : now.getFullYear();

  // Fetch calendar availability data from server
  const calendarResponse = await getCalendarData(month, year);
  
  // Prepare data (default to empty arrays if fetch fails)
  const bookedDates = (calendarResponse?.data?.bookedDates || []).map((d: { date: string }) => new Date(d.date));
  const blockedDates = (calendarResponse?.data?.blockedDates || []).map((d: { date: string }) => new Date(d.date));

  return (
    <BookingsView 
      bookedDates={bookedDates}
      blockedDates={blockedDates}
    />
  );
}
