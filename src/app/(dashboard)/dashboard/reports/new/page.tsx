import { getClients } from "@/services/clients";
import { getBookings } from "@/services/bookings";
import { CreateReportView } from "@/components/reports/create-report-view";

export const metadata = {
  title: "New Report | Smart Surveyor",
  description: "Create a new survey report.",
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
