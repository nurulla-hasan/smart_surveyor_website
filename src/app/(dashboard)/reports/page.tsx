import { Suspense } from "react";
import { getReports } from "@/services/reports";
import { ReportListView } from "@/components/reports/report-list-view";
import { SearchParams } from "@/types/global.type";

export const metadata = {
  title: "রিপোর্ট | Smart Surveyor",
  description: "জরিপ রিপোর্ট দেখুন এবং পরিচালনা করুন।",
};

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  
  const page = typeof params.page === "string" ? params.page : "1";
  const pageSize = typeof params.pageSize === "string" ? params.pageSize : "10";
  const search = typeof params.search === "string" ? params.search : undefined;

  const initialData = await getReports({
    page,
    pageSize,
    search,
  });

  return (
    <div className="space-y-6">

      <Suspense fallback={<div>লোড হচ্ছে...</div>}>
        <ReportListView initialData={initialData} />
      </Suspense>
    </div>
  );
}
