/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { serverFetch } from "@/lib/fetcher";
import { updateTag } from "next/cache";
import { CalculationRequest, GetCalculationsResponse } from "@/types/calculations";
import { buildQueryString } from "@/lib/buildQueryString";

export const getCalculations = async (
  query: Record<string, string | string[] | undefined> = {}
): Promise<GetCalculationsResponse | null> => {
  try {
    const queryString = buildQueryString(query);
    const response = await serverFetch(`/calculations${queryString}`, {
      next: {
        revalidate: 86400,
        tags: ["calculations"],
      },
    } as any);
    return response;
  } catch (error) {
    console.error("Error fetching calculations:", error);
    return null;
  }
};

export const saveCalculation = async (data: CalculationRequest) => {
  try {
    const response = await serverFetch("/calculations", {
      method: "POST",
      body: data,
    });
    if (response?.success) {
      updateTag("calculations");
    }
    return response;
  } catch (error) {
    console.error("Error saving calculation:", error);
    return null;
  }
};

export const deleteCalculation = async (id: string) => {
  try {
    const response = await serverFetch(`/calculations/${id}`, {
      method: "DELETE",
    });
    if (response?.success) {
      updateTag("calculations");
    }
    return response;
  } catch (error) {
    console.error("Error deleting calculation:", error);
    return null;
  }
};
