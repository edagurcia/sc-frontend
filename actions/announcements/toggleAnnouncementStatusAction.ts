"use server";

import { revalidatePath } from "next/cache";
import { scFetch } from "@/lib/scFetch";

export async function toggleAnnouncementStatusAction(
  id: string,
  isActive: boolean,
): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    const response = await scFetch<{ message: string }>(
      `/api/v1/announcements/${id}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ isActive }),
      },
    );

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/announcements");
    return { success: true, message: response.message };
  } catch (error) {
    console.error("Error al cambiar estado del anuncio:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
