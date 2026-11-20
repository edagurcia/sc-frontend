"use server";

import { scFetch } from "@/lib/scFetch";
import { PaymentByIdResponse, PaymentDetailItem } from "@/schemas";

export async function getPaymentByIdAction(id: string): Promise<{
  success: boolean;
  data?: PaymentDetailItem;
  error?: string;
}> {
  try {
    if (!id) {
      return { success: false, error: "ID de pago no proporcionado" };
    }

    const response = await scFetch<PaymentByIdResponse>(
      `/api/v1/payments/${id}`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

    return {
      success: true,
      data: response.payment,
    };
  } catch (error) {
    console.error(`Error al obtener el pago ${id}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
