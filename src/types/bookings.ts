import { MapData } from "./maps";
import { Calculation } from "./calculations";

export interface Booking {
  id: string;
  userId: string;
  clientId: string;
  title: string;
  description: string;
  bookingDate: string;
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
  savedMaps?: MapData[];
  calculations?: Calculation[];
}

export interface GetBookingsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    bookings: Booking[];
    meta: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      pageSize: number;
    };
  };
}
