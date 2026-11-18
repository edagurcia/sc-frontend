"use server";

import { revalidatePath } from "next/cache";
import { scFetch } from "@/lib/scFetch";
import {
  AnnouncementFormValues,
  AnnouncementResponse,
} from "@/schemas/announcement-schema";

export async function createAnnouncementAction(
  values: AnnouncementFormValues,
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
    }>("/api/v1/announcements", {
      method: "POST",
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
    console.error("Error al crear anuncio:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
