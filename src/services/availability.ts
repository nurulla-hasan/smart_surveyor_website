/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { serverFetch } from "@/lib/fetcher";
import { revalidateTag } from "next/cache";

export interface BlockedDate {
  id: string;
  date: string;
  reason: string | null;
}

export const getBlockedDates = async (month?: number, year?: number): Promise<any> => {
  try {
    let url = "/blocked-dates";
    const params = new URLSearchParams();
    if (month) params.append("month", month.toString());
    if (year) params.append("year", year.toString());
    
    const queryString = params.toString();
    if (queryString) url += `?${queryString}`;

    const response = await serverFetch(url, {
      next: {
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
      revalidateTag("blocked-dates");
      revalidateTag("bookings"); // Also revalidate bookings as blocked dates affect calendar
    }
    
    return response;
  } catch (error) {
    console.error("Error toggling blocked date:", error);
    return null;
  }
};
