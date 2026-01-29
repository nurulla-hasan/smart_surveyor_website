"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  CalendarDays,
  TrendingUp,
  Activity,
  Inbox,
  CheckCircle2,
} from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { DashboardCalendar } from "@/components/dashboard/dashboard-calendar";
import { StatCard } from "@/components/dashboard/stat-card";

const STATIC_DATA = {
  totalBookings: 5,
  completedBookings: 4,
  totalClients: 42,
  totalReports: 156,
  totalCalculations: 312,
  totalIncome: 9000,
  totalDue: 100,
  recentBookings: [
    {
      id: "1",
      client: { name: "Golap hasan" },
      bookingDate: "2026-02-01",
      status: "scheduled",
    },
    {
      id: "2",
      client: { name: "Mahmud" },
      bookingDate: "2026-01-30",
      status: "completed",
    },
    {
      id: "3",
      client: { name: "Golap hasan" },
      bookingDate: "2026-01-29",
      status: "completed",
    },
    {
      id: "4",
      client: { name: "Jane Smith" },
      bookingDate: "2026-01-28",
      status: "completed",
    },
  ],
  recentCalculations: [],
  monthlyStats: [
    { name: "Jan", total: 4 },
    { name: "Feb", total: 1 },
    { name: "Mar", total: 0 },
    { name: "Apr", total: 0 },
    { name: "May", total: 0 },
    { name: "Jun", total: 0 },
    { name: "Jul", total: 0 },
    { name: "Aug", total: 0 },
    { name: "Sep", total: 0 },
    { name: "Oct", total: 0 },
    { name: "Nov", total: 0 },
    { name: "Dec", total: 0 },
  ],
  blockedDates: [],
  allUpcomingBookings: [
    { bookingDate: new Date("2026-02-01"), status: "scheduled" },
  ],
  pendingRequests: [],
};

export default function DashboardPage() {
  const data = STATIC_DATA;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="space-y-6 w-full max-w-[1600px] mx-auto p-2">
      {/* Stats Cards Row */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="মোট আয়"
          value={`৳${data.totalIncome}`}
          description="নগদ সংগ্রহ"
          icon={TrendingUp}
          color="text-emerald-500"
        />

        <StatCard
          title="বকেয়া টাকা"
          value={`৳${data.totalDue}`}
          description="সংগ্রহ করতে হবে"
          icon={Activity}
          color="text-red-500"
        />

        <StatCard
          title="মোট বুকিং"
          value={data.totalBookings}
          description="সর্বমোট"
          icon={CalendarDays}
          color="text-emerald-500"
        />

        <StatCard
          title="সম্পন্ন"
          value={data.completedBookings}
          description="শেষ কাজ"
          icon={CheckCircle2}
          color="text-emerald-500"
        />
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
        {/* Left Column: Overview and Recent Activity */}
        <div className="lg:col-span-8 space-y-6">
          <OverviewChart data={data.monthlyStats} />

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-bold">সাম্প্রতিক কার্যক্রম</CardTitle>
              <Badge variant="secondary" className="font-semibold text-[10px] px-2 py-0">
                রিয়েল-টাইম
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                        <CalendarDays className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="grid gap-1">
                        <p className="text-sm font-bold leading-none">{booking.client.name}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {format(new Date(booking.bookingDate), "MMM d")}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={booking.status === "scheduled" ? "default" : "secondary"}
                      className={cn(
                        "text-[10px] font-bold px-2 py-0",
                        booking.status === "scheduled" ? "bg-emerald-500" : ""
                      )}
                    >
                      {booking.status === "scheduled" ? "Scheduled" : "Completed"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Booking Calendar and Pending Requests */}
        <div className="lg:col-span-4 space-y-6">
          <DashboardCalendar
            blockedDates={data.blockedDates.map((d: any) => new Date(d))}
            upcomingBookings={data.allUpcomingBookings.map((b: any) => ({
                ...b,
                bookingDate: new Date(b.bookingDate)
            }))}
          />

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Inbox className="h-5 w-5 text-orange-500" />
                অপেক্ষমান অনুরোধ
              </CardTitle>
              <CardDescription className="text-xs">
                পাবলিক পেজ থেকে নতুন জরিপ অনুরোধ।
              </CardDescription>
            </CardHeader>
            <CardContent className="min-h-[200px] flex flex-col items-center justify-center">
              <div className="flex flex-col items-center justify-center text-center space-y-3 opacity-40">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                   <Inbox className="h-6 w-6" />
                </div>
                <p className="text-xs font-medium">কোনো অপেক্ষমান অনুরোধ নেই</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
