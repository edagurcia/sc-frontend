"use server";

import { scFetch } from "@/lib/scFetch";
import { CommunityResponse } from "@/schemas/community-schema";

export async function getCommunityByIdAction(id: string): Promise<{
  success: boolean;
  data?: CommunityResponse;
  error?: string;
}> {
  try {
    const data = await scFetch<CommunityResponse>(`/api/v1/communities/${id}`, {
      method: "GET",
    });

    return { success: true, data };
  } catch (error) {
    console.error("Error al obtener comunidad:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
