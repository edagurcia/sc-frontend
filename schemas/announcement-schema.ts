import { z } from "zod";

export interface AnnouncementResponse {
  id: string;
  communityId: string;
  authorId: string;
  title: string;
  content: string;
  imageUrl: string | null;
  isPinned: boolean;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const announcementSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  content: z.string().min(10, "El contenido debe tener al menos 10 caracteres"),
  isPinned: z.boolean().default(false),
  expiresAt: z.string().nullable().optional(),
});

export type AnnouncementFormValues = z.infer<typeof announcementSchema>;
export type UpdateAnnouncementFormValues = Partial<AnnouncementFormValues>;
