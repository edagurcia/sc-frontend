"use server";

import { scFetch } from "@/lib/scFetch";
import { SuperAdminMetricsResponse } from "@/schemas/community-schema";

export async function getSuperAdminMetricsAction(): Promise<{
  success: boolean;
  data?: SuperAdminMetricsResponse;
  error?: string;
}> {
  try {
    const response = await scFetch<{
      success: boolean;
      data: SuperAdminMetricsResponse;
    }>("/api/v1/super-admin/metrics", {
      method: "GET",
      next: { revalidate: 60 },
    });

    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error al obtener métricas del Super Admin:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
