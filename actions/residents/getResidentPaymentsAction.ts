"use server";

import { scFetch } from "@/lib/scFetch";

export interface ResidentHistoricalPayment {
  id: string;
  receiptNumber: string;
  period: string;
  amount: string;
  paymentMethod: string;
  notes: string | null;
  createdAt: string;
}

export interface ResidentPaymentsHistoryResponse {
  resident: {
    id: string;
    fullName: string;
    dni: string;
    houseNumber: string;
    monthlyFee: string;
  };
  payments: ResidentHistoricalPayment[];
}

export async function getResidentPaymentsAction(): Promise<{
  success: boolean;
  data?: ResidentPaymentsHistoryResponse;
  error?: string;
}> {
  try {
    const response = await scFetch<ResidentPaymentsHistoryResponse>(
      "/api/v1/resident/payments",
      {
        method: "GET",
        cache: "no-store",
      },
    );

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
