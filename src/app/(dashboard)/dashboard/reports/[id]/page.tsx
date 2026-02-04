import { getReportById } from "@/services/reports";
import { ReportDetailsView } from "@/components/reports/report-details-view";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Report Details | Smart Surveyor",
  description: "View detailed information of the survey report.",
};

export default async function ReportDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const reportRes = await getReportById(id);

  if (!reportRes?.success || !reportRes.data) {
    notFound();
  }

  return (
    <ReportDetailsView report={reportRes.data} />
  );
}
