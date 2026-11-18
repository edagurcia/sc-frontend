"use server";

import { revalidatePath } from "next/cache";
import { scFetch } from "@/lib/scFetch";
import {
  AnnouncementFormValues,
  AnnouncementResponse,
} from "@/schemas/announcement-schema";

export async function updateAnnouncementAction(
  id: string,
  values: Partial<AnnouncementFormValues>,
): Promise<{
  success: boolean;
  message?: string;
  data?: AnnouncementResponse;
  error?: string;
}> {
  try {
    const response = await scFetch<{
      message: string;
      announcement: AnnouncementResponse;
    }>(`/api/v1/announcements/${id}`, {
      method: "PUT",
      body: JSON.stringify(values),
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/announcements");
    return {
      success: true,
      message: response.message,
      data: response.announcement,
    };
  } catch (error) {
    console.error("Error al actualizar anuncio:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
