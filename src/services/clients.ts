/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/fetcher";
import { buildQueryString } from "@/lib/buildQueryString";
import { FieldValues } from "react-hook-form";
import { updateTag } from "next/cache";
import { GetClientsResponse } from "@/types/clients";

export const getClients = async (
  query: Record<string, string | number | string[] | undefined> = {},
): Promise<GetClientsResponse | null> => {
  try {
    const queryString = buildQueryString(query);

    const response = await serverFetch(`/clients${queryString}`, {
      next: {
        revalidate: 86400,
        tags: ["clients"],
      },
    } as any);
    return response;
  } catch (error) {
    console.error("Error fetching clients:", error);
    return null;
  }
};

export const createClient = async (data: FieldValues) => {
  try {
    const response = await serverFetch("/clients", {
      method: "POST",
      body: data,
    });
    if (response.success) {
      updateTag("clients");
    }
    return response;
  } catch (error) {
    console.error("Error creating client:", error);
    return null;
  }
};

export const updateClient = async (id: string, data: FieldValues) => {
  try {
    const response = await serverFetch(`/clients/${id}`, {
      method: "PUT",
      body: data,
    });
    if (response.success) {
      updateTag("clients");
    }
    return response;
  } catch (error) {
    console.error("Error updating client:", error);
    return null;
  }
};

export const deleteClient = async (id: string) => {
  try {
    const response = await serverFetch(`/clients/${id}`, {
      method: "DELETE",
    });
    if (response.success) {
      updateTag("clients");
    }
    return response;
  } catch (error) {
    console.error("Error deleting client:", error);
    return null;
  }
};
