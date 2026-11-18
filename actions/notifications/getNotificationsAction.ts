"use server";

import { scFetch } from "@/lib/scFetch";
import { NotificationResponse } from "@/schemas/notification-schema";

export async function getNotificationsAction(): Promise<{
  success: boolean;
  data?: NotificationResponse[];
  error?: string;
}> {
  try {
    const response = await scFetch<NotificationResponse[]>(
      "/api/v1/notifications",
      {
        method: "GET",
        cache: "no-store",
      },
    );

    return { success: true, data: response };
  } catch (error) {
    console.error("Error al obtener notificaciones:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
