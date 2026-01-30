/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { serverFetch } from "@/lib/fetcher";
import { updateTag } from "next/cache";
import { buildQueryString } from "@/lib/buildQueryString";

export interface BlockedDate {
  id: string;
  date: string;
  reason: string | null;
}

export const getBlockedDates = async (month?: number, year?: number): Promise<any> => {
  try {
    const queryString = buildQueryString({
      month: month?.toString(),
      year: year?.toString(),
    });

    const response = await serverFetch(`/blocked-dates${queryString}`, {
      next: {
        revalidate: 86400,
        tags: ["blocked-dates"],
      },
    } as any);
    return response;
  } catch (error) {
    console.error("Error fetching blocked dates:", error);
    return null;
  }
};

export const toggleBlockedDate = async (date: string, reason: string = "Off-day"): Promise<any> => {
  try {
    const response = await serverFetch("/blocked-dates/toggle", {
      method: "POST",
      body: { date, reason },
    });
    
    if (response?.success) {
      updateTag("blocked-dates");
      updateTag("bookings"); // Also revalidate bookings as blocked dates affect calendar
    }
    
    return response;
  } catch (error) {
    console.error("Error toggling blocked date:", error);
    return null;
  }
};
