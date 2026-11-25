import { z } from "zod";
import {
  requiredDniSchema,
  requiredPhoneSchema,
  optionalDniSchema,
  optionalPhoneSchema,
} from "./common-fields-schema";

export const createResidentSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "El nombre completo debe tener al menos 2 caracteres")
    .max(120, "El nombre completo no puede exceder 120 caracteres"),
  email: z
    .string()
    .trim()
    .email("Ingresa un correo electrónico válido")
    .max(150, "El correo no puede exceder 150 caracteres"),
  dni: requiredDniSchema,
  phone: requiredPhoneSchema,
  houseNumber: z
    .string()
    .trim()
    .min(1, "El número de casa es obligatorio")
    .max(30, "El número de casa no puede exceder 30 caracteres"),
  street: z
    .string()
    .trim()
    .min(1, "La calle o bloque es obligatoria")
    .max(120, "La calle o bloque no puede exceder 120 caracteres"),
  isActive: z.boolean().optional(),
});

export const updateResidentSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "El nombre completo debe tener al menos 2 caracteres")
    .max(120, "El nombre completo no puede exceder 120 caracteres")
    .optional(),
  email: z
    .string()
    .trim()
    .email("Ingresa un correo electrónico válido")
    .max(150, "El correo no puede exceder 150 caracteres")
    .optional(),
  dni: optionalDniSchema,
  phone: optionalPhoneSchema,
  houseNumber: z
    .string()
    .trim()
    .min(1, "El número de casa es obligatorio")
    .max(30, "El número de casa no puede exceder 30 caracteres")
    .optional(),
  street: z
    .string()
    .trim()
    .min(1, "La calle o bloque es obligatoria")
    .max(120, "La calle o bloque no puede exceder 120 caracteres")
    .optional(),
  isActive: z.boolean().optional(),
});

export type CreateResidentInput = z.infer<typeof createResidentSchema>;
export type UpdateResidentInput = z.infer<typeof updateResidentSchema>;

export interface Resident {
  id: string;
  fullName: string;
  email: string;
  dni: string;
  phone: string;
  houseNumber: string;
  street: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export type ResidentResponse = Resident;
