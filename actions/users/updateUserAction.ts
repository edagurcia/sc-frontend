"use server";

import { scFetch } from "@/lib/scFetch";
import { revalidatePath } from "next/cache";
import {
  updateUserSchema,
  UpdateUserFormValues,
  User,
  UserMutationResponse,
} from "@/schemas/user-schema";

export async function updateUserAction(
  userId: string,
  input: UpdateUserFormValues,
): Promise<{
  success: boolean;
  data?: User;
  message?: string;
  error?: string;
}> {
  try {
    if (!userId) {
      return { success: false, error: "El ID del usuario es requerido" };
    }

    const parsed = updateUserSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error:
          parsed.error.issues[0]?.message || "Datos de actualización inválidos",
      };
    }

    const response = await scFetch<UserMutationResponse>(
      `/api/v1/users/${userId}`,
      {
        method: "PUT",
        body: JSON.stringify(parsed.data),
        cache: "no-store",
      },
    );

    revalidatePath("/dashboard/users");
    revalidatePath("/dashboard/residents");

    return {
      success: true,
      data: response.data,
      message: response.message || "Usuario actualizado exitosamente",
    };
  } catch (error) {
    console.error(`Error al actualizar el usuario ${userId}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
