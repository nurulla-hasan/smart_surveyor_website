/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { serverFetch } from "@/lib/fetcher";

export const getDashboardStats = async (): Promise<any> => {
  try {
    const response = await serverFetch("/dashboard/stats", {
      next: {
        revalidate: 86400, // 24 hours
        tags: ["bookings"],
      },
    } as any);
    return response;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return null;
  }
};

export const getMonthlyStats = async (year: number = new Date().getFullYear()): Promise<any> => {
  try {
    const response = await serverFetch(`/dashboard/monthly-stats?year=${year}`, {
      next: {
        revalidate: 86400, // 24 hours
        tags: ["bookings"],
      },
    } as any);
    return response;
  } catch (error) {
    console.error("Error fetching monthly stats:", error);
    return null;
  }
};

export const getCalendarData = async (month: number, year: number): Promise<any> => {
  try {
    const response = await serverFetch(`/bookings/calendar?month=${month}&year=${year}`, {
      next: {
        revalidate: 86400, // 24 hours
        tags: ["bookings"],
      },
    } as any);
    return response;
  } catch (error) {
    console.error("Error fetching calendar data:", error);
    return null;
  }
};
