"use server";

import { scFetch } from "@/lib/scFetch";
import { ResidentStatementResponse } from "@/schemas";

export async function getResidentStatementAction(residentId: string): Promise<{
  success: boolean;
  data?: ResidentStatementResponse;
  error?: string;
}> {
  try {
    if (!residentId) {
      return { success: false, error: "ID de residente no proporcionado" };
    }

    const response = await scFetch<ResidentStatementResponse>(
      `/api/v1/payments/statement/${residentId}`,
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
    console.error(
      `Error al obtener el estado de cuenta del residente ${residentId}:`,
      error,
    );
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
