/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { serverFetch } from "@/lib/fetcher";
import { QueryParams } from "@/types/global.type";
import { buildQueryString } from "@/lib/buildQueryString";

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

export const getMonthlyStats = async (query: QueryParams = {}): Promise<any> => {
  try {
    const response = await serverFetch(`/dashboard/monthly-stats${buildQueryString(query)}`, {
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

export const getCalendarData = async (month?: number | string | QueryParams, year?: number | string): Promise<any> => {
  try {
    let m: any = month;
    let y: any = year;

    if (typeof month === 'object' && month !== null) {
      m = (month as QueryParams).month;
      y = (month as QueryParams).year;
    }

    const query = buildQueryString({ month: m, year: y });
    const response = await serverFetch(`/bookings/calendar${query}`, {
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
