"use server";

import { scFetch } from "@/lib/scFetch";
import { VisitResponse, normalizeVisit } from "@/schemas/visit-schema";

export async function getVisitorByIdAction(
  id: string,
): Promise<{ success: boolean; data?: VisitResponse; error?: string }> {
  try {
    const response = await scFetch<{ visitor: VisitResponse }>(
      `/api/v1/resident/visitors/${id}`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

    return {
      success: true,
      data: normalizeVisit(response.visitor),
    };
  } catch (error) {
    console.error("Error al obtener visita por ID:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
