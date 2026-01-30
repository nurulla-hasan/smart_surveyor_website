/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/fetcher";
import { revalidateTag } from "next/cache";
import { MapsResponse, SaveMapPayload } from "@/types/maps";

export const getMaps = async (page = 1, limit = 10): Promise<MapsResponse | null> => {
  try {
    const response = await serverFetch(`/maps?page=${page}&limit=${limit}`, {
      next: {
        tags: ["maps"],
      },
    } as any);
    return response;
  } catch (error) {
    console.error("Error fetching maps:", error);
    return null;
  }
};

export const saveMap = async (data: SaveMapPayload) => {
  try {
    const response = await serverFetch("/maps", {
      method: "POST",
      body: data,
    });
    if (response.success) {
      revalidateTag("maps");
    }
    return response;
  } catch (error) {
    console.error("Error saving map:", error);
    return null;
  }
};

export const deleteMap = async (id: string) => {
  try {
    const response = await serverFetch(`/maps/${id}`, {
      method: "DELETE",
    });
    if (response.success) {
      revalidateTag("maps");
    }
    return response;
  } catch (error) {
    console.error("Error deleting map:", error);
    return null;
  }
};
