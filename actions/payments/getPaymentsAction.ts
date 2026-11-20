"use server";

import { scFetch } from "@/lib/scFetch";
import { PaymentHistoryItem, PaymentsHistoryResponse } from "@/schemas";

export interface GetPaymentsParams {
  residentId?: string;
  period?: string;
  communityId?: string;
}

export async function getPaymentsAction(
  params: GetPaymentsParams = {},
): Promise<{
  success: boolean;
  data?: PaymentHistoryItem[];
  error?: string;
}> {
  try {
    const searchParams = new URLSearchParams();
    if (params.residentId) searchParams.set("residentId", params.residentId);
    if (params.period) searchParams.set("period", params.period);
    if (params.communityId) searchParams.set("communityId", params.communityId);

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `/api/v1/payments?${queryString}`
      : "/api/v1/payments";

    const response = await scFetch<PaymentsHistoryResponse>(endpoint, {
      method: "GET",
      cache: "no-store",
    });

    return {
      success: true,
      data: response.payments ?? [],
    };
  } catch (error) {
    console.error("Error al obtener el historial de pagos:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
