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
  houseNumber: string;
  street?: string | null;
  address?: string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  monthlyFee?: number | string | null;
  communityId?: string | null;
  userId?: string | null;
  user?: {
    id?: string;
    email?: string;
  } | null;
  isActive: boolean;
  securityDevices?: SecurityDevice[];
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

export type CreateResidentInput = z.infer<typeof createResidentSchema>;
export type ResidentFormValues = CreateResidentInput;
export type UpdateResidentInput = z.infer<typeof updateResidentSchema>;
export type UpdateResidentFormValues = UpdateResidentInput;
export type UpdateMyProfileFormValues = UpdateResidentFormValues;

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
