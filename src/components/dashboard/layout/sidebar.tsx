"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  CalendarDays,
  CalendarX,
  Calculator,
  Map as MapIcon,
  Users,
  FileText,
  Settings,
  LogOut,
  LandPlot,
} from "lucide-react";

type SidebarProps = React.HTMLAttributes<HTMLDivElement> & {
  onItemClick?: () => void;
};

export function Sidebar({ className, onItemClick }: SidebarProps) {
  const pathname = usePathname();

  const routes = [
    {
      label: "ড্যাশবোর্ড",
      icon: LayoutDashboard,
      href: "/dashboard",
      active: pathname === "/dashboard",
      color: "text-sky-500",
    },
    {
      label: "বুকিং",
      icon: CalendarDays,
      href: "/dashboard/bookings",
      active: pathname.startsWith("/dashboard/bookings"),
      color: "text-violet-500",
    },
    {
      label: "প্রাপ্যতা",
      icon: CalendarX,
      href: "/dashboard/availability",
      active: pathname === "/dashboard/availability",
      color: "text-red-500",
    },
    {
      label: "ক্যালকুলেটর",
      icon: Calculator,
      href: "/dashboard/calculator",
      active: pathname.startsWith("/dashboard/calculator"),
      color: "text-pink-700",
    },
    {
      label: "ম্যাপ",
      icon: MapIcon,
      href: "/dashboard/maps",
      active: pathname.startsWith("/dashboard/maps"),
      color: "text-orange-500",
    },
    {
      label: "ক্লায়েন্ট",
      icon: Users,
      href: "/dashboard/clients",
      active: pathname.startsWith("/dashboard/clients"),
      color: "text-emerald-500",
    },
    {
      label: "রিপোর্ট",
      icon: FileText,
      href: "/dashboard/reports",
      active: pathname.startsWith("/dashboard/reports"),
      color: "text-green-700",
    },
    {
      label: "সেটিংস",
      icon: Settings,
      href: "/dashboard/settings",
      active: pathname.startsWith("/dashboard/settings"),
      color: "text-gray-400",
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-sidebar",
        className,
      )}
    >
      <div className="px-4 py-6 flex-1 flex flex-col gap-8">
        <Link 
          href="/dashboard" 
          className="flex items-center gap-3 px-2"
          onClick={onItemClick}
        >
          <LandPlot className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-bold tracking-tight">
            Smart Surveyor
          </h1>
        </Link>
        <div className="grid gap-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              onClick={onItemClick}
              className={cn(
                "text-sm group flex items-center p-3 w-full font-medium rounded-lg transition-colors",
                route.active 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <route.icon className={cn("h-4 w-4 mr-3", route.color)} />
              {route.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="p-4 border-t">
        <Button 
            variant="ghost" 
            className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-10"
            onClick={() => {
              onItemClick?.();
              console.log("Logout triggered");
            }}
        >
          <LogOut className="h-4 w-4 mr-3" />
          লগআউট
        </Button>
      </div>
    </div>
  );
}
