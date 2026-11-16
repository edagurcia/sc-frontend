"use server";

import { scFetch } from "@/lib/scFetch";
import { revalidatePath } from "next/cache";
import { ToggleResidentStatusResponse } from "@/schemas";

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
        cache: "no-store",
      },
    );

    revalidatePath("/dashboard/residents");

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
