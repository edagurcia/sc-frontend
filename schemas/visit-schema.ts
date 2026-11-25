import { z } from "zod";
import { optionalDniSchema } from "./common-fields-schema";

export const visitsSchema = z
  .object({
    visitorName: z
      .string()
      .trim()
      .max(120, "El nombre del visitante no puede exceder 120 caracteres")
      .optional()
      .or(z.literal("")),
    companyName: z
      .string()
      .trim()
      .max(120, "El nombre de la empresa no puede exceder 120 caracteres")
      .optional()
      .or(z.literal("")),
    identification: optionalDniSchema,
    vehiclePlate: z
      .string()
      .trim()
      .max(20, "La placa no puede exceder 20 caracteres")
      .optional()
      .or(z.literal("")),
    notes: z
      .string()
      .trim()
      .max(500, "Las notas no pueden exceder 500 caracteres")
      .optional()
      .or(z.literal("")),
    isFrequent: z.boolean().optional(),
    isActive: z.boolean().optional(),
  })
  .refine(
    (data) =>
      Boolean(data.visitorName?.trim()) || Boolean(data.companyName?.trim()),
    {
      message: "Debes ingresar el nombre del visitante o de la empresa",
      path: ["visitorName"],
    },
  );

export const updateVisitSchema = z.object({
  visitorName: z
    .string()
    .trim()
    .max(120, "El nombre del visitante no puede exceder 120 caracteres")
    .optional(),
  companyName: z
    .string()
    .trim()
    .max(120, "El nombre de la empresa no puede exceder 120 caracteres")
    .optional(),
  identification: optionalDniSchema,
  vehiclePlate: z
    .string()
    .trim()
    .max(20, "La placa no puede exceder 20 caracteres")
    .optional(),
  notes: z
    .string()
    .trim()
    .max(500, "Las notas no pueden exceder 500 caracteres")
    .optional(),
  isFrequent: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export const toggleVisitStatusSchema = z.object({
  isActive: z.boolean(),
});

export type VisitFormValues = z.infer<typeof visitsSchema>;
export type UpdateVisitFormValues = z.infer<typeof updateVisitSchema>;
export type ToggleVisitStatusValues = z.infer<typeof toggleVisitStatusSchema>;

export interface Visit {
  id: string;
  visitorName?: string | null;
  companyName?: string | null;
  identification?: string | null;
  vehiclePlate?: string | null;
  notes?: string | null;
  isFrequent?: boolean;
  accessCode: string;
  isActive: boolean;
  residentId?: string;
  createdAt: string;
  updatedAt?: string;
}

export type VisitResponse = Visit;

export interface ActiveCommunityVisit extends Visit {
  residentName: string;
  houseNumber: string;
  street: string;
  phone: string;
}
