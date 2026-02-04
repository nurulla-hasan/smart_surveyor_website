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

export const getCalendarData = async (month?: number | string | (QueryParams & { surveyorId?: string; isPublic?: boolean }), year?: number | string): Promise<any> => {
  try {
    let m: any = month;
    let y: any = year;
    let surveyorId: string | undefined;
    let isPublic = false;

    if (typeof month === 'object' && month !== null) {
      const params = month as (QueryParams & { surveyorId?: string; isPublic?: boolean });
      m = params.month;
      y = params.year;
      surveyorId = params.surveyorId;
      isPublic = params.isPublic || false;
    }

    const query = buildQueryString({ month: m, year: y, surveyorId });
    const response = await serverFetch(`/bookings/calendar${query}`, {
      isPublic,
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
