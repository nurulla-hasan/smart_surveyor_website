export interface Report {
  id: string;
  userId: string;
  clientId: string;
  bookingId: string;
  title: string;
  content: string;
  mouzaName: string;
  plotNo: string;
  areaSqFt: number;
  areaKatha: number;
  areaDecimal: number;
  notes: string | null;
  fileUrl: string | null;
  createdAt: string;
  updatedAt: string;
  client: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  booking?: {
    id: string;
    title: string;
    bookingDate: string;
    propertyAddress?: string;
  };
}

export interface GetReportsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    reports: Report[];
    meta: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      pageSize: number;
    };
  };
}

export interface CreateReportPayload {
  clientId: string;
  bookingId: string;
  title: string;
  content: string;
  mouzaName: string;
  plotNo: string;
  areaSqFt: number;
  areaKatha: number;
  areaDecimal: number;
  notes?: string;
  fileUrl?: string;
}
