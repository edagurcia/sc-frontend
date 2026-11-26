"use server";

import { scFetch } from "@/lib/scFetch";
import { revalidatePath } from "next/cache";
import { resetPasswordSchema } from "@/schemas/user-schema";

export async function resetUserPasswordAction(
  userId: string,
  newPassword: string,
): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    if (!userId) {
      return { success: false, error: "El ID del usuario es requerido" };
    }

    const parsed = resetPasswordSchema.safeParse({ newPassword });
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Contraseña inválida",
      };
    }

    const response = await scFetch<{ message: string }>(
      `/api/v1/users/${userId}/reset-password`,
      {
        method: "POST",
        body: JSON.stringify({ newPassword: parsed.data.newPassword }),
        cache: "no-store",
      },
    );

    revalidatePath("/dashboard/users");
    revalidatePath("/dashboard/residents");

    return {
      success: true,
      message: response.message || "Contraseña restablecida exitosamente",
    };
  } catch (error) {
    console.error(
      `Error al restablecer contraseña del usuario ${userId}:`,
      error,
    );
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
