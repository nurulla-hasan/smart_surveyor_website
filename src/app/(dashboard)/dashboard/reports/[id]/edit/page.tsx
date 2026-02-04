import { getClients } from "@/services/clients";
import { getReportById } from "@/services/reports";
import { EditReportView } from "@/components/reports/edit-report-view";
import { notFound } from "next/navigation";

export const metadata = {
  title: "রিপোর্ট এডিট করুন | Smart Surveyor",
  description: "জরিপ রিপোর্ট এডিট করুন।",
};

export default async function EditReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const [reportRes, clientsRes] = await Promise.all([
    getReportById(id),
    getClients({ pageSize: "20" }),
  ]);

  if (!reportRes?.success || !reportRes.data) {
    notFound();
  }

  return (
    <EditReportView
      report={reportRes.data}
      initialClients={clientsRes?.data?.clients || []}
    />
  );
}
