import { z } from "zod";
import { residentSchema } from "./resident-schema";

export const userRoleSchema = z.enum([
  "super_admin",
  "community_admin",
  "resident",
  "guard",
]);

export const residentOrGuardRoleSchema = z.enum(["resident", "guard"]);

export const creatableUserRoleSchema = z.enum([
  "community_admin",
  "resident",
  "guard",
]);

const strongPasswordSchema = z
  .string()
  .min(8, "La contraseña debe tener al menos 8 caracteres")
  .regex(/[A-Z]/, "Debe incluir al menos una letra mayúscula")
  .regex(/[0-9]/, "Debe incluir al menos un número")
  .regex(/[!@#$%^&*]/, "Debe incluir al menos un carácter especial (!@#$%^&*)");

const optionalCommunityIdSchema = z
  .string()
  .trim()
  .uuid("El ID de la comunidad debe ser un UUID válido")
  .optional()
  .or(z.literal("").transform(() => undefined));

export const createUserSchema = residentSchema
  .pick({
    email: true,
  })
  .extend({
    name: z.string().trim().min(2, "El nombre es obligatorio"),
    password: strongPasswordSchema,
    role: creatableUserRoleSchema,
    communityId: optionalCommunityIdSchema,
  })
  .superRefine((data, ctx) => {
    if (data.role === "community_admin" && !data.communityId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["communityId"],
        message: "La comunidad es obligatoria para crear un community_admin",
      });
    }
  });

export const updateUserSchema = residentSchema
  .pick({
    email: true,
  })
  .partial()
  .extend({
    name: z.string().trim().min(2, "El nombre es obligatorio").optional(),
    role: creatableUserRoleSchema.optional(),
  });

export const toggleUserStatusSchema = z.object({
  isActive: z.boolean(),
});

export const resetPasswordSchema = z.object({
  newPassword: strongPasswordSchema,
});

export type UserRole = z.infer<typeof userRoleSchema>;
export type ResidentOrGuardRole = z.infer<typeof residentOrGuardRoleSchema>;
export type CreatableUserRole = z.infer<typeof creatableUserRoleSchema>;
export type CreatableUserFormValues = z.infer<typeof createUserSchema>;
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;
export type ToggleUserStatusFormValues = z.infer<typeof toggleUserStatusSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  communityId?: string | null;
  isActive: boolean;
  createdAt?: string;
}

export type UsersResponse = User[];

export interface UserMutationResponse {
  message: string;
  data: User;
}

export interface ToggleUserStatusResponse {
  message: string;
  data: Pick<User, "id" | "isActive">;
}
