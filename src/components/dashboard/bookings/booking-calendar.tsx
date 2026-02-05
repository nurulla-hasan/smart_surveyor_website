/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { getCalendarData } from "@/services/dashboard";
import { getCurrentUser } from "@/services/auth";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { isSameDay, isBefore, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";

interface BookingCalendarProps {
  selectedDate: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  onMonthChange?: (date: Date) => void;
  surveyorId?: string;
  showLegend?: boolean;
  className?: string;
  disableBookedDates?: boolean;
}

export function BookingCalendar({ 
  selectedDate, 
  onSelect, 
  onMonthChange,
  surveyorId,
  showLegend = true,
  className,
  disableBookedDates = false,
}: BookingCalendarProps) {
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [currentMonth, setCurrentMonth] = useState<Date>(() => new Date());
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (!surveyorId) {
      const fetchUser = async () => {
        try {
          const userData = await getCurrentUser();
          setUser(userData);
        } catch (err) {
          console.error("Failed to fetch user:", err);
        }
      };
      fetchUser();
    }
  }, [surveyorId]);

  const effectiveSurveyorId = surveyorId || user?.id || user?._id;

  const fetchAvailability = useCallback(async (month: number, year: number, sid: string) => {
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

  // Sync data when month or surveyor changes
  useEffect(() => {
    if (effectiveSurveyorId) {
      fetchAvailability(currentMonth.getMonth() + 1, currentMonth.getFullYear(), effectiveSurveyorId);
    }
  }, [currentMonth, effectiveSurveyorId, fetchAvailability]);

  // Listen for refresh events (both generic and booking specific)
  useEffect(() => {
    if (!effectiveSurveyorId) return;
    
    const handleRefresh = () => {
      fetchAvailability(currentMonth.getMonth() + 1, currentMonth.getFullYear(), effectiveSurveyorId);
    };

    window.addEventListener("refresh-calendar", handleRefresh);
    window.addEventListener("booking-created", handleRefresh);
    
    return () => {
      window.removeEventListener("refresh-calendar", handleRefresh);
      window.removeEventListener("booking-created", handleRefresh);
    };
  }, [currentMonth, effectiveSurveyorId, fetchAvailability]);

  const handleMonthChange = useCallback((date: Date) => {
    setCurrentMonth(date);
    onMonthChange?.(date);
  }, [onMonthChange]);

  const modifiers = useMemo(() => ({
    booked: (date: Date) => bookedDates.some(d => isSameDay(d, date)),
    blocked: (date: Date) => blockedDates.some(d => isSameDay(d, date)),
  }), [bookedDates, blockedDates]);

  const isDateDisabled = useCallback((date: Date) => {
    const today = startOfDay(new Date());
    if (isBefore(date, today)) return true;
    
    const isBlocked = blockedDates.some(d => isSameDay(d, date));
    const isBooked = disableBookedDates && bookedDates.some(d => isSameDay(d, date));
    
    return isBlocked || isBooked;
  }, [blockedDates, bookedDates, disableBookedDates]);

  const modifiersClassNames = useMemo(() => ({
    booked: "bg-orange-500 text-white font-bold rounded-full",
    blocked: "bg-rose-600 text-white font-bold rounded-full",
  }), []);

  return (
    <Card className={cn("p-4 overflow-hidden border-none shadow-none bg-transparent", className)}>
      <div className={cn("relative transition-opacity duration-300", loading ? "opacity-50" : "opacity-100")}>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onSelect}
          onMonthChange={handleMonthChange}
          disabled={isDateDisabled}
          className="p-0"
          modifiers={modifiers}
          modifiersClassNames={modifiersClassNames}
          classNames={{
            day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-full",
            day_today: "bg-muted text-foreground font-semibold rounded-full",
            day_disabled: "text-muted-foreground opacity-50 cursor-not-allowed",
          }}
        />
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/10 backdrop-blur-[1px] rounded-xl z-10">
            <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
      
      {showLegend && (
        <div className="pt-6 mt-4 border-t border-border/40 flex flex-wrap gap-x-6 gap-y-3 px-2">
          <div className="flex items-center gap-2.5">
            <div className="h-2.5 w-2.5 rounded-full bg-rose-600 shadow-[0_0_8px_rgba(225,29,72,0.3)]" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Off-Day
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="h-2.5 w-2.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.3)]" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Booked
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.3)]" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Selected
            </span>
          </div>
        </div>
      )}
    </Card>
  );
}
