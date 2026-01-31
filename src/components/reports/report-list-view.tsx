"use client";

import PageHeader from "@/components/ui/custom/page-header";
import { DataTable } from "@/components/ui/custom/data-table";
import { reportColumns } from "./report-columns";
import { GetReportsResponse } from "@/types/reports";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { useSmartFilter } from "@/hooks/useSmartFilter";
import Link from "next/link";
import { Button } from "../ui/button";

interface ReportListViewProps {
  initialData: GetReportsResponse | null;
}

export function ReportListView({ initialData }: ReportListViewProps) {
  const { updateFilter, getFilter } = useSmartFilter();
  const searchParam = getFilter("search");

  const reports = initialData?.data?.reports || [];
  const meta = initialData?.data?.meta || {
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 10,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="রিপোর্ট"
          description="জরিপ রিপোর্ট দেখুন এবং পরিচালনা করুন।"
        />
        <Link href="/reports/new">
          <Button>
            <Plus className="size-4" />
            রিপোর্ট তৈরি করুন
          </Button>
        </Link>
      </div>

      <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-xl backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative space-y-6">
          <div className="relative max-w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="রিপোর্ট খুঁজুন..."
              className="pl-10 bg-muted/20"
              defaultValue={searchParam}
              onChange={(e) => updateFilter("search", e.target.value, 500)}
            />
          </div>

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
