"use server";

import { scFetch } from "@/lib/scFetch";
import { revalidatePath } from "next/cache";
import { Resident } from "@/schemas";

export interface ManageResidentUserResponse {
  message: string;
}

export async function manageResidentUserAction(
  resident: Resident,
  newPassword: string,
): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    const existingUserId = resident.user?.id || resident.userId;

    if (!newPassword || newPassword.length < 8) {
      return {
        success: false,
        error: "La contraseña temporal debe tener al menos 8 caracteres",
      };
    }

    // Caso 1: El usuario ya existe -> Restablecer contraseña con tu endpoint existente
    if (existingUserId) {
      const response = await scFetch<ManageResidentUserResponse>(
        `/api/v1/users/${existingUserId}/reset-password`,
        {
          method: "PATCH",
          body: JSON.stringify({ newPassword }),
          cache: "no-store",
        },
      );

      revalidatePath("/dashboard/residents");

      return {
        success: true,
        message: response.message || "Contraseña restablecida exitosamente",
      };
    }

    // Caso 2: El usuario no existe todavía -> Crearlo en el sistema
    const createResponse = await scFetch<ManageResidentUserResponse>(
      `/api/v1/users`,
      {
        method: "POST",
        body: JSON.stringify({
          name: resident.fullName,
          email: resident.email,
          password: newPassword,
          role: "resident",
          communityId: resident.communityId,
        }),
        cache: "no-store",
      },
    );

    revalidatePath("/dashboard/residents");

    return {
      success: true,
      message:
        createResponse.message ||
        "Usuario creado y credenciales asignadas correctamente",
    };
  } catch (error) {
    console.error(`Error al gestionar el usuario del residente:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
