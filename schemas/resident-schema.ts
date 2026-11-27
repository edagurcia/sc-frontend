import { z } from "zod";
import {
  requiredDniSchema,
  optionalDniSchema,
  requiredPhoneSchema,
  optionalPhoneSchema,
} from "./common-fields-schema";

export interface SecurityDevice {
  id: string;
  type: "card" | "qr" | "tag" | string;
  serial: string;
  status: "active" | "inactive" | "damaged" | "lost" | string;
  issuedAt: string | Date;
}

export interface Resident {
  id: string;
  fullName: string;
  email: string;
  dni: string;
  phone: string;
  avatarUrl?: string | null;
  emergencyContact?: string | null;
  houseNumber: string;
  street?: string | null;
  avenue?: string | null;
  address?: string | null;
  reference?: string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  billingStartDate?: string | Date;
  monthlyFee?: number | string | null;
  communityId?: string | null;
  userId?: string | null;
  user?: {
    id?: string;
    email?: string;
  } | null;
  isActive: boolean;
  securityDevices?: SecurityDevice[];
  createdAt?: string;
  updatedAt?: string;
}

export const createResidentSchema = z.object({
  fullName: z.string().trim().min(1, "El nombre completo es requerido"),
  houseNumber: z.string().trim().min(1, "El número de casa es requerido"),
  email: z.string().trim().email("Correo electrónico inválido"),
  dni: requiredDniSchema,
  phone: requiredPhoneSchema,
  street: z.string().trim().optional(),
  isActive: z.boolean().default(true),
});

export const residentSchema = createResidentSchema;
export const updateResidentSchema = createResidentSchema.partial().extend({
  dni: optionalDniSchema,
  phone: optionalPhoneSchema,
});

export const updateMyProfileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "El nombre completo es requerido")
    .optional(),
  phone: optionalPhoneSchema,
  email: z.string().trim().email("Correo electrónico inválido").optional(),
  emergencyContact: z.string().trim().max(100).optional(),
  avatarUrl: z
    .string()
    .trim()
    .url("URL de avatar inválida")
    .optional()
    .or(z.literal("")),
  address: z.string().trim().optional(),
  reference: z.string().trim().optional(),
  houseNumber: z.string().trim().optional(),
  street: z.string().trim().optional(),
});

export const changeMyPasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "La contraseña actual es obligatoria"),
    newPassword: z
      .string()
      .min(8, "La nueva contraseña debe tener al menos 8 caracteres")
      .regex(/[A-Z]/, "Debe incluir al menos una letra mayúscula")
      .regex(/[0-9]/, "Debe incluir al menos un número")
      .regex(
        /[!@#$%^&*]/,
        "Debe incluir al menos un carácter especial (!@#$%^&*)",
      ),
    confirmPassword: z.string().min(1, "Debes confirmar la nueva contraseña"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Las contraseñas no coinciden",
  });

export type CreateResidentInput = z.infer<typeof createResidentSchema>;
export type ResidentFormValues = CreateResidentInput;
export type UpdateResidentInput = z.infer<typeof updateResidentSchema>;
export type UpdateResidentFormValues = UpdateResidentInput;
export type UpdateMyProfileFormValues = z.infer<typeof updateMyProfileSchema>;
export type ChangeMyPasswordFormValues = z.infer<typeof changeMyPasswordSchema>;

export interface ResidentResponse {
  resident: Resident;
  message?: string;
}

export interface ResidentsResponse {
  residents: Resident[];
}

export interface UnpaidPeriod {
  period: string;
  amount?: string;
}

export interface ResidentDetailResponse {
  resident: Resident;
  unpaidPeriods?: UnpaidPeriod[];
  totalDebt?: string;
}

export type ToggleResidentStatusResponse = ResidentResponse;

export interface ReportDeviceInput {
  deviceId: string;
  status: "lost" | "damaged";
}
