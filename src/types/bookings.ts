import { PaginationMeta } from "./global.type";

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Booking {
  id: string;
  userId: string;
  clientId: string;
  title: string;
  description: string;
  bookingDate: string;
  bookingTime?: string;
  status: 'scheduled' | 'completed' | 'pending' | 'cancelled';
  propertyAddress: string | null;
  lat: number | null;
  lng: number | null;
  amountReceived: number;
  amountDue: number;
  paymentNote: string | null;
  createdAt: string;
  updatedAt: string;
  client: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  calculations: any[];
  savedMaps: any[];
}

export interface GetBookingsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    bookings: Booking[];
    meta: PaginationMeta;
  };
}
