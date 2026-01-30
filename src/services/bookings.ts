/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { serverFetch } from "@/lib/fetcher";
import { buildQueryString } from "@/lib/buildQueryString";
import { FieldValues } from "react-hook-form";
import { updateTag } from "next/cache";
import { GetBookingsResponse } from "@/types/bookings";

export const getBookings = async (query: Record<string, string | string[] | undefined> = {}): Promise<GetBookingsResponse | null> => {
  try {
    const queryString = buildQueryString(query);

    const response = await serverFetch(`/bookings${queryString}`, {
      next: {
        tags: ["bookings"],
      },
    } as any);
    return response;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return null;
  }
};

export const createBooking = async (data: FieldValues) => {
  try {
    const response = await serverFetch("/bookings", {
      method: "POST",
      body: data,
    });
    if (response.success) {
      updateTag("bookings");
    }
    return response;
  } catch (error) {
    console.error("Error creating booking:", error);
    return null;
  }
};

export const updateBooking = async (id: string, data: FieldValues) => {
  try {
    const response = await serverFetch(`/bookings/${id}`, {
      method: "PUT",
      body: data,
    });
    if (response.success) {
      updateTag("bookings");
    }
    return response;
  } catch (error) {
    console.error("Error updating booking:", error);
    return null;
  }
};

export const deleteBooking = async (id: string) => {
  try {
    const response = await serverFetch(`/bookings/${id}`, {
      method: "DELETE",
    });
    if (response.success) {
      updateTag("bookings");
    }
    return response;
  } catch (error) {
    console.error("Error deleting booking:", error);
    return null;
  }
};
