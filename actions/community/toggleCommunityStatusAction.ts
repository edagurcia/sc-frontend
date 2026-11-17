"use server";

import { revalidatePath } from "next/cache";
import { scFetch } from "@/lib/scFetch";

export async function toggleCommunityStatusAction(id: string): Promise<{
  success: boolean;
  data?: { id: string; isActive: boolean };
  error?: string;
}> {
  try {
    const response = await scFetch<{
      data: { id: string; isActive: boolean };
    }>(`/api/v1/communities/${id}/toggle-status`, {
      method: "PATCH",
    });

    revalidatePath("/dashboard");
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error al cambiar estado de comunidad:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
