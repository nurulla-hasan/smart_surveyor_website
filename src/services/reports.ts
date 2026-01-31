/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/fetcher";
import { buildQueryString } from "@/lib/buildQueryString";
import { FieldValues } from "react-hook-form";
import { updateTag } from "next/cache";
import { GetReportsResponse } from "@/types/reports";

export const getReports = async (
  query: Record<string, string | string[] | undefined> = {},
): Promise<GetReportsResponse | null> => {
  try {
    const queryString = buildQueryString(query);

    const response = await serverFetch(`/reports${queryString}`, {
      next: {
        revalidate: 86400,
        tags: ["reports"],
      },
    } as any);
    return response;
  } catch (error) {
    console.error("Error fetching reports:", error);
    return null;
  }
};

export const createReport = async (data: FieldValues) => {
  try {
    const response = await serverFetch("/reports", {
      method: "POST",
      body: data,
    });
    if (response.success) {
      updateTag("reports");
    }
    return response;
  } catch (error) {
    console.error("Error creating report:", error);
    return null;
  }
};

export const updateReport = async (id: string, data: FieldValues) => {
  try {
    const response = await serverFetch(`/reports/${id}`, {
      method: "PUT",
      body: data,
    });
    if (response.success) {
      updateTag("reports");
    }
    return response;
  } catch (error) {
    console.error("Error updating report:", error);
    return null;
  }
};

export const deleteReport = async (id: string) => {
  try {
    const response = await serverFetch(`/reports/${id}`, {
      method: "DELETE",
    });
    if (response.success) {
      updateTag("reports");
    }
    return response;
  } catch (error) {
    console.error("Error deleting report:", error);
    return null;
  }
};
