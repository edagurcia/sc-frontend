"use server";

import { scFetch } from "@/lib/scFetch";

export interface ResidentDashboardInfo {
  fullName: string;
  dni: string;
  address: string;
  houseNumber: string;
  monthlyFee: string;
}

export interface ResidentPaymentItem {
  period: string;
  status: "PAGADO" | "PENDIENTE" | string;
  amount: string;
  receiptNumber: string | null;
  paymentDate: string | null;
  paymentMethod: string | null;
}

export interface ResidentDashboardResponse {
  resident: ResidentDashboardInfo;
  year: number;
  paymentStatus: ResidentPaymentItem[];
}

export async function getResidentDashboardAction(): Promise<{
  success: boolean;
  data?: ResidentDashboardResponse;
  error?: string;
}> {
  try {
    const response = await scFetch<
      ResidentDashboardResponse | { data?: ResidentDashboardResponse }
    >("/api/v1/resident/dashboard", {
      method: "GET",
      cache: "no-store",
    });

    const payload = "resident" in response ? response : response?.data;

    if (!payload?.resident) {
      return {
        success: false,
        error: "Respuesta inválida del dashboard de residente",
      };
    }

    return {
      success: true,
      data: payload,
    };
  } catch (error) {
    console.error("Error al obtener el dashboard del residente:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
