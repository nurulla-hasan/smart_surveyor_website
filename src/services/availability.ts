/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/fetcher";
import { updateTag } from "next/cache";
import { buildQueryString } from "@/lib/buildQueryString";

import { QueryParams } from "@/types/global.type";

export interface BlockedDate {
  id: string;
  date: string;
  reason: string | null;
}

export const getBlockedDates = async (
  query: QueryParams = {},
): Promise<any> => {
  try {
    const response = await serverFetch(
      `/blocked-dates${buildQueryString(query)}`,
      {
        next: {
          revalidate: 86400,
          tags: ["blocked-dates"],
        },
      } as any,
    );
    return response;
  } catch (error) {
    console.error("Error fetching blocked dates:", error);
    return null;
  }
};

export const toggleBlockedDate = async (data: {date: string;reason: string;}): Promise<any> => {
  try {
    const response = await serverFetch("/blocked-dates/toggle", {
      method: "POST",
      body: data,
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
