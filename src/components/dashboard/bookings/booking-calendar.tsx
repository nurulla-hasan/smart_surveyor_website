/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { getCalendarData } from "@/services/dashboard";
import { getCurrentUser } from "@/services/auth";
import React, { useState, useEffect, useCallback } from "react";
import { isSameDay, isBefore, startOfDay } from "date-fns";

interface BookingCalendarProps {
  selectedDate: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  onMonthChange?: (date: Date) => void;
  surveyorId?: string;
  showLegend?: boolean;
  className?: string;
}

export function BookingCalendar({ 
  selectedDate, 
  onSelect, 
  onMonthChange,
  surveyorId,
  showLegend = true,
  className,
}: BookingCalendarProps) {
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [currentMonth, setCurrentMonth] = useState<Date | undefined>(undefined);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setCurrentMonth(new Date());
    if (!surveyorId) {
      const fetchUser = async () => {
        const userData = await getCurrentUser();
        setUser(userData);
      };
      fetchUser();
    }
  }, [surveyorId]);

  const effectiveSurveyorId = surveyorId || user?.id;

  const fetchAvailability = useCallback(async (month: number, year: number, sid?: string) => {
    if (!sid) return;
    
    setLoading(true);
    try {
      const res = await getCalendarData({ month, year, surveyorId: sid } as any);
      if (res?.success) {
        const booked = (res.data.bookedDates || []).map((d: any) => new Date(d.date));
        const blocked = (res.data.blockedDates || []).map((d: any) => new Date(d.date));
        setBookedDates(booked);
        setBlockedDates(blocked);
      }
    } catch (error) {
      console.error("Error fetching availability:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Listen for custom refresh events
  useEffect(() => {
    if (!currentMonth || !effectiveSurveyorId) return;
    const handleRefresh = () => {
      fetchAvailability(currentMonth.getMonth() + 1, currentMonth.getFullYear(), effectiveSurveyorId);
    };

    window.addEventListener("refresh-calendar", handleRefresh);
    return () => window.removeEventListener("refresh-calendar", handleRefresh);
  }, [currentMonth, effectiveSurveyorId, fetchAvailability]);

  useEffect(() => {
    if (currentMonth && effectiveSurveyorId) {
      fetchAvailability(currentMonth.getMonth() + 1, currentMonth.getFullYear(), effectiveSurveyorId);
    }
  }, [currentMonth, effectiveSurveyorId, fetchAvailability]);

  const handleMonthChange = (date: Date) => {
    setCurrentMonth(date);
    onMonthChange?.(date);
  };

  const modifiers = {
    booked: (date: Date) => bookedDates.some(d => isSameDay(d, date)),
    blocked: (date: Date) => blockedDates.some(d => isSameDay(d, date)),
  };

  const isDateDisabled = (date: Date) => {
    // Disable past dates (before today)
    const today = startOfDay(new Date());
    if (isBefore(date, today)) return true;
    
    // Also disable specifically blocked dates from backend
    return blockedDates.some(d => isSameDay(d, date));
  };

  const modifiersClassNames = {
    booked: "bg-orange-500 text-white! font-bold rounded-full opacity-100!",
    blocked: "bg-rose-900 text-white! font-bold rounded-full opacity-100!",
  };

  if (!currentMonth) return <Card className={`p-4 h-100 animate-pulse bg-muted/20 ${className}`} />;

  return (
    <Card className={`p-4 overflow-hidden ${className}`}>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={onSelect}
        onMonthChange={handleMonthChange}
        disabled={isDateDisabled}
        className="rounded-md"
        modifiers={modifiers}
        modifiersClassNames={modifiersClassNames}
        classNames={{
          day_selected: "!bg-transparent !text-foreground outline outline-4 outline-emerald-400 outline-offset-2 z-30 scale-110",
          day_today: "bg-muted text-foreground font-semibold rounded-full",
          day_disabled: "text-white! opacity-100!", // This forces disabled dates to show white text if they have our background
        }}
      />
      
      {showLegend && (
        <div className="pt-6 border-t space-y-3 px-2">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-rose-900" />
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Off-Day (Blocked)
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-orange-500" />
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Booked
            </span>
          </div>
        </div>
      )}
    </Card>
  );
}
