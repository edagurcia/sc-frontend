"use server";

import { scFetch } from "@/lib/scFetch";
import { AnnouncementResponse } from "@/schemas/announcement-schema";

export async function getDashboardAnnouncementsAction(
  limit: number = 3,
): Promise<{
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

    // Filtramos únicamente los activos y limitamos la cantidad para el dashboard
    const activeAnnouncements = (response.announcements || [])
      .filter((announcement) => announcement.isActive)
      .slice(0, limit);

    return { success: true, data: activeAnnouncements };
  } catch (error) {
    console.error("Error al obtener anuncios para el dashboard:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
