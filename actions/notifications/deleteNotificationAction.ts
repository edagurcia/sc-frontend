"use server";

import { revalidatePath } from "next/cache";
import { scFetch } from "@/lib/scFetch";

export async function deleteNotificationAction(
  id: string,
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const response = await scFetch<{ message: string }>(
      `/api/v1/notifications/${id}`,
      {
        method: "DELETE",
      },
    );

    revalidatePath("/dashboard/notifications");
    return { success: true, message: response.message };
  } catch (error) {
    console.error("Error al eliminar notificación:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
