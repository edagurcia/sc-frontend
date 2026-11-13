"use server";

import { scFetch } from "@/lib/scFetch";

export interface ToggleResidentStatusResponse {
  message: string;
  resident: {
    id: string;
    isActive: boolean;
    updatedAt: string;
  };
}

export async function toggleResidentStatusAction(
  id: string,
  isActive: boolean,
): Promise<{
  success: boolean;
  data?: ToggleResidentStatusResponse["resident"];
  message?: string;
  error?: string;
}> {
  try {
    if (!id) {
      return { success: false, error: "ID de residente no proporcionado" };
    }

    const response = await scFetch<ToggleResidentStatusResponse>(
      `/api/v1/residents/${id}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ isActive }),
      },
    );

    return {
      success: true,
      data: response.resident,
      message: response.message,
    };
  } catch (error) {
    console.error(`Error al cambiar estado del residente ${id}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
