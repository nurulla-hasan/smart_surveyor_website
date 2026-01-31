import { getReportById } from "@/services/reports";
import { ReportDetailsView } from "@/components/reports/report-details-view";
import { notFound } from "next/navigation";

export const metadata = {
  title: "রিপোর্ট ডিটেইলস | Smart Surveyor",
  description: "জরিপ রিপোর্টের বিস্তারিত তথ্য দেখুন।",
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
