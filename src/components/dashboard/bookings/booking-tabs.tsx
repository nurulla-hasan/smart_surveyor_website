"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, ClipboardList, History } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export type BookingTab = "upcoming" | "pending" | "past";

interface BookingTabsProps {
  activeTab: BookingTab;
  onTabChange: (tab: BookingTab) => void;
  requestCount?: number;
}

export function BookingTabs({ activeTab, onTabChange, requestCount = 0 }: BookingTabsProps) {
  const tabs = [
    {
      id: "upcoming" as const,
      label: "Upcoming",
      icon: CalendarDays,
      color: "text-emerald-500",
    },
    {
      id: "pending" as const,
      label: "Requests",
      icon: ClipboardList,
      count: requestCount,
      color: "text-amber-500",
    },
    {
      id: "past" as const,
      label: "History",
      icon: History,
      color: "text-blue-500",
    },
  ];

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <Tabs 
        value={activeTab} 
        onValueChange={(value) => onTabChange(value as BookingTab)}
        className="w-fit"
      >
        <TabsList className="bg-muted/30 p-1 gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
              >
                <Icon className={cn("h-4 w-4", tab.color)} />
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={cn(
                    "flex items-center justify-center min-w-4.5 h-4.5 text-[10px] font-semibold rounded-full",
                    activeTab === tab.id ? "bg-red-600 text-white" : "bg-red-500/20 text-red-500"
                  )}>
                    {tab.count}
                  </span>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>
      <ScrollBar orientation="horizontal" className="hidden" /> 
    </ScrollArea>
  );
}