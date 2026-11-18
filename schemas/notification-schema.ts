import { z } from "zod";

export interface NotificationResponse {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export const notificationSchema = z.object({
  targetType: z.enum(["community", "user"]),
  communityId: z.string().optional(),
  userId: z.string().optional(),
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  message: z.string().min(5, "El mensaje debe tener al menos 5 caracteres"),
  type: z.string().min(2, "Selecciona un tipo de notificación"),
});

export type NotificationFormValues = z.infer<typeof notificationSchema>;
