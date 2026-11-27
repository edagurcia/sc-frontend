"use server";

import { scFetch } from "@/lib/scFetch";

export async function getResidentStatementPdfAction(year?: number): Promise<{
  success: boolean;
  html?: string;
  error?: string;
}> {
  try {
    const query = year ? `?year=${year}` : "";
    const html = await scFetch<string>(
      `/api/v1/resident/statement/pdf${query}`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

    if (!html || typeof html !== "string") {
      return {
        success: false,
        error: "No se recibió el contenido del estado de cuenta",
      };
    }

    return {
      success: true,
      html,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
