"use server";

import { scFetch } from "@/lib/scFetch";
import { AnnouncementResponse } from "@/schemas/announcement-schema";

export async function getAnnouncementsAction(): Promise<{
  success: boolean;
  data?: AnnouncementResponse[];
  error?: string;
}> {
  try {
    const response = await scFetch<{ announcements: AnnouncementResponse[] }>(
      "/api/v1/announcements",
      {
        method: "GET",
        cache: "no-store",
      },
    );

    return { success: true, data: response.announcements };
  } catch (error) {
    console.error("Error al obtener anuncios:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
