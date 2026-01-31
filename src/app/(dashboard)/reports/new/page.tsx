import { getClients } from "@/services/clients";
import { getBookings } from "@/services/bookings";
import { CreateReportView } from "@/components/reports/create-report-view";

export const metadata = {
  title: "নতুন রিপোর্ট | Smart Surveyor",
  description: "নতুন জরিপ রিপোর্ট তৈরি করুন।",
};

export default async function NewReportPage() {
  const [clientsRes, bookingsRes] = await Promise.all([
    getClients({ pageSize: "20" }),
    getBookings({ pageSize: "20" }),
  ]);

  return (
    <CreateReportView
      initialClients={clientsRes?.data?.clients || []}
      initialBookings={bookingsRes?.data?.bookings || []}
    />
  );
}
