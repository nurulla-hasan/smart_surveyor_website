import { PaginationMeta } from "./global.type";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface MapData {
  id: string;
  userId: string;
  bookingId: string | null;
  name: string;
  data: any;
  area?: number;
  perimeter?: number;
  fileUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MapsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    maps: MapData[];
    meta: PaginationMeta;
  };
}

export interface SaveMapPayload {
  name: string;
  data: any;
  area?: number;
  perimeter?: number;
  fileUrl?: string | null;
  bookingId?: string | null;
}
