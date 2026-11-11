"use server";

import { scFetch } from "@/lib/scFetch";

export interface ResidentInfo {
  fullName: string;
  dni: string;
  address: string;
  houseNumber: string;
  monthlyFee: string;
}

export interface PaymentStatusItem {
  period: string;
  status: "PAGADO" | "PENDIENTE" | string;
  amount: string;
  receiptNumber: string | null;
  paymentDate: string | null;
  paymentMethod: string | null;
}

export interface ResidentDashboardResponse {
  resident: ResidentInfo;
  year: number;
  paymentStatus: PaymentStatusItem[];
}

export async function getResidentDashboardAction(): Promise<{
  success: boolean;
  data?: ResidentDashboardResponse;
  error?: string;
}> {
  try {
    const data = await scFetch<ResidentDashboardResponse>(
      "/api/v1/resident/dashboard",
      {
        method: "GET",
        next: { revalidate: 60 },
      },
    );

    return { success: true, data };
  } catch (error) {
    console.error("Error al obtener dashboard de residente:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
