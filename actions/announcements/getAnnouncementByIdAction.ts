"use server";

import { scFetch } from "@/lib/scFetch";
import { AnnouncementResponse } from "@/schemas/announcement-schema";

export async function getAnnouncementByIdAction(
  id: string,
): Promise<{ success: boolean; data?: AnnouncementResponse; error?: string }> {
  try {
    const response = await scFetch<{ announcement: AnnouncementResponse }>(
      `/api/v1/announcements/${id}`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

    return { success: true, data: response.announcement };
  } catch (error) {
    console.error("Error al obtener anuncio por ID:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
