"use server";

import { scFetch } from "@/lib/scFetch";
import { PaymentSummaryResponse } from "@/schemas";

export async function getPaymentsSummaryAction(period?: string): Promise<{
  success: boolean;
  data?: PaymentSummaryResponse;
  error?: string;
}> {
  try {
    const endpoint = period
      ? `/api/v1/payments/summary?period=${encodeURIComponent(period)}`
      : "/api/v1/payments/summary";

    const response = await scFetch<PaymentSummaryResponse>(endpoint, {
      method: "GET",
      cache: "no-store",
    });

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error("Error al obtener el resumen financiero por período:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
