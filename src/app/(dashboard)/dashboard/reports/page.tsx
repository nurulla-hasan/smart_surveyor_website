import { getReports } from "@/services/reports";
import { SearchParams } from "@/types/global.type";
import PageHeader from "@/components/ui/custom/page-header";
import { DataTable } from "@/components/ui/custom/data-table";
import { reportColumns } from "@/components/reports/report-columns";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/custom/search-input";

export const metadata = { 
  title: "Reports | Smart Surveyor",
  description: "View and manage survey reports.",
};

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const { reports, meta } = await getReports(params);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Reports"
          description="View and manage survey reports."
        />
        <Link href="/dashboard/reports/new">
          <Button>
            <Plus/>
            Create Report
          </Button>
        </Link>
      </div>

      <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-xl backdrop-blur-sm relative overflow-hidden">
        <div className="relative space-y-6">
          <SearchInput placeholder="Search reports..." />
          <DataTable
            columns={reportColumns}
            data={reports}
            pageSize={meta.pageSize}
            meta={{
              total: meta.totalItems,
              page: meta.currentPage,
              limit: meta.pageSize,
              totalPages: meta.totalPages,
            }}
          />
        </div>
      </div>
    </div>
  );
}
