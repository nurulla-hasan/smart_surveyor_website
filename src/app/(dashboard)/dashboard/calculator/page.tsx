import { CalculatorView } from "@/components/calculator/calculator-view";
import PageHeader from "@/components/ui/custom/page-header";
import { getCalculations } from "@/services/calculations";
import { getBookings } from "@/services/bookings";

export default async function CalculatorPage() {
  // Fetch calculation history and initial bookings using Promise.all
  const [calculationsRes, bookingsRes] = await Promise.all([
    getCalculations(),
    getBookings({ pageSize: "10" })
  ]);

  const initialHistory = calculationsRes?.success ? calculationsRes.data : [];
  const initialBookings = bookingsRes?.success ? bookingsRes.data.bookings : [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title="ল্যান্ড ক্যালকুলেটর"
        description="গড় পার্শ্ব পরিমাপের ভিত্তিতে জমির ক্ষেত্রফল গণনা করুন।"
      />
      <CalculatorView 
        initialHistory={initialHistory} 
        initialBookings={initialBookings} 
      />
    </div>
  );
}
