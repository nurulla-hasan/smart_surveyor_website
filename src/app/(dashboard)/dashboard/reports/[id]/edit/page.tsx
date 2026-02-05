import { getClients } from "@/services/clients";
import { getReportById } from "@/services/reports";
import { EditReportView } from "@/components/dashboard/reports/edit-report-view";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit Report | Smart Surveyor",
  description: "Edit survey report.",
};

export default async function EditReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const [reportRes, clientsRes] = await Promise.all([
    getReportById(id),
    getClients({ limit: "20" }),
  ]);

  if (!reportRes?.success || !reportRes.data) {
    notFound();
  }

  return (
    <EditReportView
      report={reportRes.data}
      initialClients={clientsRes?.clients || []}
    />
  );
}
