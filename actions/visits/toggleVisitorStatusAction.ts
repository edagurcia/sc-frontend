"use server";

import { revalidatePath } from "next/cache";
import { scFetch } from "@/lib/scFetch";

export async function toggleVisitorStatusAction(
  id: string,
  isActive: boolean,
): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    const response = await scFetch<{ message: string }>(
      `/api/v1/resident/visitors/${id}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ isActive }),
      },
    );

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/visitors");
    return { success: true, message: response.message };
  } catch (error) {
    console.error("Error al cambiar estado de la visita:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
