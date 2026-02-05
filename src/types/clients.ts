import { PaginationMeta } from "./global.type";

export interface Client {
  id: string;
  userId: string;
  accountId: string | null;
  name: string;
  email: string;
  phone: string;
  address: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetClientsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    clients: Client[];
    meta: PaginationMeta;
  };
}
