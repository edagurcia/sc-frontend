import { z } from "zod";

export const createCommunitySchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  department: z.string().min(1, "El departamento es obligatorio"),
  municipality: z.string().min(1, "El municipio es obligatorio"),
  address: z.string().min(1, "La dirección es obligatoria"),
  polygon: z.string().min(1, "Debes dibujar el polígono en el mapa"),
});

export const updateCommunitySchema = createCommunitySchema.partial().extend({
  isActive: z.boolean().optional(),
});

export type CreateCommunityInput = z.infer<typeof createCommunitySchema>;
export type UpdateCommunityInput = z.infer<typeof updateCommunitySchema>;

export interface CommunityResponse {
  id: string;
  name: string;
  department: string;
  municipality: string;
  address: string;
  polygon: string;
  isActive: boolean;
  createdAt: string;
}
