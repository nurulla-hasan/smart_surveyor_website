export interface CalculationInputData {
  sides: number[];
}

export interface CalculationResultData {
  areaSqFt: number;
  areaKatha: number;
  areaDecimal?: number;
}

export interface Calculation {
  id: string;
  userId: string;
  bookingId: string | null;
  type: 'area' | 'other';
  inputData?: CalculationInputData;
  resultData: CalculationResultData;
  createdAt: string;
  updatedAt: string;
  booking?: {
    id: string;
    title: string;
    client?: {
      name: string;
    };
  };
}

export interface CalculationRequest {
  type: 'area';
  bookingId?: string;
  inputData: CalculationInputData;
  resultData: CalculationResultData;
}

export interface GetCalculationsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Calculation[];
}
