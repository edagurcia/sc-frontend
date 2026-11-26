"use server";

import { scFetch } from "@/lib/scFetch";
import { revalidatePath } from "next/cache";
import { ToggleUserStatusResponse } from "@/schemas/user-schema";

export async function toggleUserStatusAction(userId: string): Promise<{
  success: boolean;
  data?: ToggleUserStatusResponse["data"];
  message?: string;
  error?: string;
}> {
  try {
    if (!userId) {
      return { success: false, error: "El ID del usuario es requerido" };
    }

    const response = await scFetch<ToggleUserStatusResponse>(
      `/api/v1/users/${userId}/status`,
      {
        method: "PATCH",
        cache: "no-store",
      },
    );

    revalidatePath("/dashboard/users");
    revalidatePath("/dashboard/residents");

    return {
      success: true,
      data: response.data,
      message: response.message || "Estado del usuario actualizado",
    };
  } catch (error) {
    console.error(`Error al cambiar estado del usuario ${userId}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
