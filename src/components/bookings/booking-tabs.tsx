"use client";

import { cn } from "@/lib/utils";
import { CalendarDays, ClipboardList, History } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"; // ScrollArea ইমপোর্ট করে নিন

export type BookingTab = "SCHEDULED" | "REQUEST" | "HISTORY";

interface BookingTabsProps {
  activeTab: BookingTab;
  onTabChange: (tab: BookingTab) => void;
  requestCount?: number;
}

export function BookingTabs({ activeTab, onTabChange, requestCount = 0 }: BookingTabsProps) {
  const tabs = [
    {
      id: "SCHEDULED" as const,
      label: "আসন্ন",
      icon: CalendarDays,
    },
    {
      id: "REQUEST" as const,
      label: "অনুরোধ",
      icon: ClipboardList,
      count: requestCount,
    },
    {
      id: "HISTORY" as const,
      label: "ইতিহাস",
      icon: History,
    },
  ];

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-xl w-fit mb-2">
      {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 uppercase tracking-tight",
                isActive 
                  ? "bg-slate-800 text-white shadow-lg" 
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "")} />
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className={cn(
                  "flex items-center justify-center min-w-[18px] h-[18px] rounded-full text-[10px] font-semibold",
                  isActive ? "bg-red-500 text-white" : "bg-red-500/20 text-red-500"
                )}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" className="hidden" /> 
    </ScrollArea>
  );
}