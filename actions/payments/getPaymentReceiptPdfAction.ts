"use server";

import { scFetch } from "@/lib/scFetch";

export async function getPaymentReceiptPdfAction(paymentId: string): Promise<{
  success: boolean;
  html?: string;
  error?: string;
}> {
  try {
    if (!paymentId) {
      return { success: false, error: "ID de pago no proporcionado" };
    }

    const html = await scFetch<string>(
      `/api/v1/resident/payments/${paymentId}/receipt`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

    if (!html || typeof html !== "string") {
      return {
        success: false,
        error: "No se pudo obtener el comprobante de pago",
      };
    }

    return {
      success: true,
      html,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
