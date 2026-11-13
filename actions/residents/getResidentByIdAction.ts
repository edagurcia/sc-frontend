"use server";

import { scFetch } from "@/lib/scFetch";
import { Resident } from "./getResidentsAction";

export interface ResidentDetailResponse {
  resident: Resident;
}

export async function getResidentByIdAction(id: string): Promise<{
  success: boolean;
  data?: Resident;
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
        next: { revalidate: 60 },
      },
    );

    return {
      success: true,
      data: response.resident,
    };
  } catch (error) {
    console.error(`Error al obtener el residente con ID ${id}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
