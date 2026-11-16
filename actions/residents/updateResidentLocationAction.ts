"use server";

import { scFetch } from "@/lib/scFetch";
import { revalidatePath } from "next/cache";
import { Resident, ResidentResponse } from "@/schemas";

export async function updateResidentLocationAction(
  id: string,
  latitude: number | null,
  longitude: number | null,
): Promise<{
  success: boolean;
  data?: Resident;
  message?: string;
  error?: string;
}> {
  try {
    const response = await scFetch<ResidentResponse>(
      `/api/v1/residents/${id}/location`,
      {
        method: "PUT",
        body: JSON.stringify({ latitude, longitude }),
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
    console.error("Error al actualizar la ubicación del residente:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
