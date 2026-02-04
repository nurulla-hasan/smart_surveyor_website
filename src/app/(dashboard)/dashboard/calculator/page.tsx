import PageHeader from "@/components/ui/custom/page-header";
import { getCalculations } from "@/services/calculations";
import { getBookings } from "@/services/bookings";
import { SearchInput } from "@/components/ui/custom/search-input";
import { DataTable } from "@/components/ui/custom/data-table";
import { calculationColumns } from "@/components/calculator/calculation-columns";
import { CalculatorForm } from "@/components/calculator/calculator-form";
import { SearchParams } from "@/types/global.type";
import {History } from "lucide-react";

export const metadata = {
  title: "ল্যান্ড ক্যালকুলেটর | Smart Surveyor",
  description: "গড় পার্শ্ব পরিমাপের ভিত্তিতে জমির ক্ষেত্রফল গণনা করুন।",
};

export default async function CalculatorPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  
  // Fetch calculation history and initial bookings using Promise.all
  const [calculationsRes, bookingsRes] = await Promise.all([
    getCalculations(params),
    getBookings({ pageSize: "10" })
  ]);

  const { calculations, meta } = calculationsRes;
  const initialBookings = bookingsRes?.success ? bookingsRes.data.bookings : [];

  return (
    <div className="space-y-8">
      <PageHeader
        title="ল্যান্ড ক্যালকুলেটর"
        description="গড় পার্শ্ব পরিমাপের ভিত্তিতে জমির ক্ষেত্রফল গণনা করুন।"
      />

      <CalculatorForm initialBookings={initialBookings} />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <History className="size-4 text-primary" />
            </div>
            <h3 className="text-lg font-bold uppercase tracking-tight">ইতিহাস</h3>
          </div>
        </div>

        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-xl backdrop-blur-sm relative overflow-hidden">
          
          <div className="relative space-y-6">
            <SearchInput placeholder="ইতিহাস খুঁজুন..." />

            <DataTable
              columns={calculationColumns}
              data={calculations}
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
    </div>
  );
}
