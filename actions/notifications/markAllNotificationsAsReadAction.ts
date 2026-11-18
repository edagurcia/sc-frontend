"use server";

import { revalidatePath } from "next/cache";
import { scFetch } from "@/lib/scFetch";

export async function markAllNotificationsAsReadAction(): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    const response = await scFetch<{ message: string }>(
      "/api/v1/notifications/read-all",
      {
        method: "PATCH",
      },
    );

    revalidatePath("/dashboard");
    return { success: true, message: response.message };
  } catch (error) {
    console.error(
      "Error al marcar todas las notificaciones como leídas:",
      error,
    );
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
