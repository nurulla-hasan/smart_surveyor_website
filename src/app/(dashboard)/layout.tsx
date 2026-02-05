import { Header } from "@/components/dashboard/layout/header"
import { Sidebar } from "@/components/dashboard/layout/sidebar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getCurrentUser } from "@/services/auth"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
        <Sidebar className="hidden lg:flex lg:w-64" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-sidebar">
        <Header/>
        <ScrollArea className="flex-1 h-[calc(100vh-64px)] p-5 rounded-t-lg bg-background">
          {children}
        </ScrollArea>
      </div>
    </div>
  )
}
