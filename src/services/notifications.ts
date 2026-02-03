/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { serverFetch } from "@/lib/fetcher";
import { updateTag } from "next/cache";

export const getNotifications = async (): Promise<any> => {
  try {
    const response = await serverFetch("/notifications", {
      next: {
        revalidate: 60, // 1 minute
        tags: ["notifications"],
      },
    } as any);
    return response;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return null;
  }
};

export const markAsRead = async (id: string): Promise<any> => {
  try {
    const response = await serverFetch(`/notifications/${id}/read`, {
      method: "PATCH",
    });
    if (response.success) {
      updateTag("notifications");
    }
    return response;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return null;
  }
};

export const markAllAsRead = async (): Promise<any> => {
  try {
    const response = await serverFetch("/notifications/read-all", {
      method: "PATCH",
    });
    if (response.success) {
      updateTag("notifications");
    }
    return response;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return null;
  }
};

export const deleteNotification = async (id: string): Promise<any> => {
  try {
    const response = await serverFetch(`/notifications/${id}`, {
      method: "DELETE",
    });
    if (response.success) {
      updateTag("notifications");
    }
    return response;
  } catch (error) {
    console.error("Error deleting notification:", error);
    return null;
  }
};
