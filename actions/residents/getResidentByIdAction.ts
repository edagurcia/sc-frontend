"use server";

import { scFetch } from "@/lib/scFetch";
import { ResidentDetailResponse, UnpaidPeriod } from "@/schemas";

export type { ResidentDetailResponse, UnpaidPeriod };

export async function getResidentByIdAction(id: string): Promise<{
  success: boolean;
  data?: ResidentDetailResponse;
  error?: string;
}> {
  try {
    if (!id) {
      return { success: false, error: "ID de residente no proporcionado" };
    }

    const response = await scFetch<ResidentDetailResponse>(
      `/api/v1/residents/${id}`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

    return {
      success: true,
      data: {
        resident: response.resident,
        unpaidPeriods: response.unpaidPeriods ?? [],
        totalDebt: response.totalDebt ?? "0.00",
      },
    };
  } catch (error) {
    console.error(`Error al obtener el residente con ID ${id}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
