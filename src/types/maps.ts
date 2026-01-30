export interface MapData {
  id: string;
  userId: string;
  bookingId: string | null;
  name: string;
  data: any;
  fileUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MapMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface MapsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    maps: MapData[];
    meta: MapMeta;
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
