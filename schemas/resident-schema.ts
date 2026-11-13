import { z } from "zod";

export const securityDeviceSchema = z.object({
  id: z.string().optional(),
  type: z.string().min(1, "El tipo es requerido"),
  serial: z.string().min(1, "El número de serie es requerido"),
  status: z.enum(["active", "inactive"]).default("active"),
  issuedAt: z.string().min(1, "La fecha de emisión es requerida"),
});

export const residentSchema = z.object({
  dni: z.string().min(13, "El DNI debe tener al menos 13 caracteres"),
  fullName: z.string().min(3, "El nombre completo es requerido"),
  email: z.string().email("Correo electrónico inválido"),
  phone: z.string().min(8, "El teléfono es requerido"),
  address: z.string().min(5, "La dirección es requerida"),
  reference: z.string().min(3, "La referencia es requerida"),
  houseNumber: z.string().min(1, "El número de casa es requerido"),
  street: z.string().min(1, "La calle es requerida"),
  avenue: z.string().min(1, "La avenida es requerida"),
  tenureType: z.string().min(1, "El tipo de tenencia es requerido"),
  securityDevices: z.array(securityDeviceSchema).optional(),
  emergencyContact: z.string().optional(),
  avatarUrl: z
    .string()
    .url("URL de avatar inválida")
    .optional()
    .or(z.literal("")),
  monthlyFee: z.coerce.number().positive("La cuota mensual debe ser mayor a 0"),
  hasCistern: z.boolean().default(false),
  floorsCount: z.coerce.number().int().positive().default(1),
  hasGarage: z.boolean().default(false),
  adultsCount: z.coerce.number().int().nonnegative().default(1),
  minorsCount: z.coerce.number().int().nonnegative().default(0),
});

export const residentEntitySchema = residentSchema.extend({
  id: z.string(),
  communityId: z.string(),
  userId: z.string().nullable().optional(),
  monthlyFee: z.string(),
  previousFee: z.string().nullable().optional(),
  lastFeeUpdate: z.string().nullable().optional(),
  feeUpdateReason: z.string().nullable().optional(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const updateMyProfileSchema = residentSchema
  .pick({
    phone: true,
    email: true,
    emergencyContact: true,
    avatarUrl: true,
  })
  .partial();

export const reportDeviceSchema = z.object({
  deviceId: z.string().min(1, "El ID del dispositivo es requerido"),
  newStatus: z.enum(["lost", "damaged"]),
});

// Tipo inferido para formularios e inputs de creación
export type ResidentFormValues = z.infer<typeof residentSchema>;

// Tipo para edición (vuelve todos los campos opcionales excepto los requeridos si aplica)
export const updateResidentSchema = residentSchema.partial();
export type UpdateResidentFormValues = z.infer<typeof updateResidentSchema>;

// Tipo completo de la entidad Resident
export type Resident = z.infer<typeof residentEntitySchema>;
export type UpdateMyProfileFormValues = z.infer<typeof updateMyProfileSchema>;
export type ReportDeviceInput = z.infer<typeof reportDeviceSchema>;
