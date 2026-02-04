import Link from "next/link";
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
  Activity as ActivityIcon,
  Inbox,
  CheckCircle2,
} from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { DashboardCalendar } from "@/components/dashboard/dashboard-calendar";
import { StatCard } from "@/components/dashboard/stat-card";
import { getDashboardStats, getMonthlyStats, getCalendarData } from "@/services/dashboard";

interface RecentActivity {
  id: string;
  client?: { name: string };
  bookingDate: string;
  status: string;
}

interface PendingRequest {
  id: string;
  title: string;
  client?: { name: string; phone?: string };
  description?: string;
  bookingDate?: string;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>;
}) {
  const params = await searchParams;
  // Fetch data in parallel using params directly
  const [statsResponse, monthlyStatsResponse, calendarResponse] = await Promise.all([
    getDashboardStats(),
    getMonthlyStats(params),
    getCalendarData(params)
  ]);

  const stats = statsResponse?.data || {
    totalBookings: 0,
    activeClients: 0,
    reportsGenerated: 0,
    completedBookings: 0,
    totalIncome: 0,
    totalDue: 0,
    pendingRequests: [],
    recentActivities: []
  };

  const monthlyStats = monthlyStatsResponse?.data || [];
  const calendarData = calendarResponse?.data || { blockedDates: [], bookedDates: [] };

  return (
    <div className="space-y-6">
      {/* Stats Cards Row */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="মোট আয়"
          value={`৳${stats.totalIncome}`}
          description="নগদ সংগ্রহ"
          icon={TrendingUp}
          color="text-emerald-500"
        />

        <StatCard
          title="বকেয়া টাকা"
          value={`৳${stats.totalDue}`}
          description="সংগ্রহ করতে হবে"
          icon={ActivityIcon}
          color="text-red-500"
        />

        <StatCard
          title="মোট বুকিং"
          value={stats.totalBookings}
          description="সর্বমোট"
          icon={CalendarDays}
          color="text-emerald-500"
        />

        <StatCard
          title="সম্পন্ন"
          value={stats.completedBookings}
          description="শেষ কাজ"
          icon={CheckCircle2}
          color="text-emerald-500"
        />
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
        {/* Left Column: Overview and Recent Activity */}
        <div className="lg:col-span-8 space-y-6">
          <OverviewChart data={monthlyStats} />

          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>সাম্প্রতিক কার্যক্রম</CardTitle>
              <Badge 
                variant="success" 
                className="uppercase flex gap-1.5 items-center"
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                রিয়েল-টাইম
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentActivities?.length > 0 ? (
                  stats.recentActivities.map((activity: RecentActivity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                          <CalendarDays className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="grid gap-1">
                          <p className="text-sm font-bold leading-none">{activity.client?.name || "Client"}</p>
                          <p className="text-[11px] text-muted-foreground">
                            {activity.bookingDate ? format(new Date(activity.bookingDate), "MMM d") : "N/A"}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={activity.status === "scheduled" ? "info" : "success"}
                        className="uppercase"
                      >
                        {activity.status === "scheduled" ? "Scheduled" : "Completed"}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    কোনো সাম্প্রতিক কার্যক্রম পাওয়া যায়নি
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Booking Calendar and Pending Requests */}
        <div className="lg:col-span-4 space-y-6">
          <DashboardCalendar
            blockedDates={calendarData.blockedDates}
            bookedDates={calendarData.bookedDates}
          />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Inbox className="h-5 w-5 text-orange-500" />
                অপেক্ষমান অনুরোধ
              </CardTitle>
              <CardDescription className="text-xs">
                পাবলিক পেজ থেকে নতুন জরিপ অনুরোধ।
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              {stats.pendingRequests?.length > 0 ? (
                <>
                  <div className="w-full space-y-3">
                     {stats.pendingRequests.map((request: PendingRequest) => (
                        <div key={request.id} className="p-4 rounded-xl border border-border/50 bg-muted/20 hover:bg-muted/40 transition-colors">
                           <div className="flex flex-col gap-1">
                              <p className="text-sm font-bold uppercase tracking-tight">{request.title}</p>
                              <div className="flex items-center justify-between mt-1">
                                 <p className="text-xs text-muted-foreground">
                                   ক্লায়েন্ট: <span className="font-semibold text-foreground">{request.client?.name || "N/A"}</span>
                                 </p>
                                 {request.bookingDate && (
                                   <p className="text-[10px] text-muted-foreground">
                                     {format(new Date(request.bookingDate), "MMM d, yyyy")}
                                   </p>
                                 )}
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
                  <div className="w-full pt-4 mt-2 border-t border-border/50">
                    <Link 
                      href="/bookings?tab=requests" 
                      className="flex items-center justify-center gap-2 text-xs font-semibold text-primary hover:underline transition-all"
                    >
                      সব অনুরোধ দেখুন
                    </Link>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-center space-y-3 opacity-40">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                    <Inbox className="h-6 w-6" />
                  </div>
                  <p className="text-xs font-medium">কোনো অপেক্ষমান অনুরোধ নেই</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
