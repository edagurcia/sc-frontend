"use server";

import { scFetch } from "@/lib/scFetch";
import { VisitResponse } from "@/schemas/visit-schema";

export async function getVisitorsAction(): Promise<{
  success: boolean;
  data?: VisitResponse[];
  error?: string;
}> {
  try {
    const response = await scFetch<{ visitors: VisitResponse[] }>(
      "/api/v1/resident/visitors",
      {
        method: "GET",
        cache: "no-store",
      },
    );

    return { success: true, data: response.visitors };
  } catch (error) {
    console.error("Error al obtener visitas:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
