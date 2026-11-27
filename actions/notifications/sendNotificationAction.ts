"use server";

import { revalidatePath } from "next/cache";
import { scFetch } from "@/lib/scFetch";
import { NotificationFormValues } from "@/schemas/notification-schema";

export async function sendNotificationAction(
  values: NotificationFormValues,
): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    const isCommunity = values.targetType === "community";
    const endpoint = isCommunity
      ? "/api/v1/notifications/community"
      : "/api/v1/notifications";

    const payload = isCommunity
      ? {
          communityId: values.communityId,
          title: values.title,
          message: values.message,
          type: values.type,
        }
      : {
          userId: values.userId,
          ...(values.communityId ? { communityId: values.communityId } : {}),
          title: values.title,
          message: values.message,
          type: values.type,
        };

    const response = await scFetch<{ message: string }>(endpoint, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    revalidatePath("/dashboard/notifications");
    return { success: true, message: response.message };
  } catch (error) {
    console.error("Error al enviar notificación:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
