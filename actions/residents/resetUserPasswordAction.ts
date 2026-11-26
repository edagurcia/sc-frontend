"use server";

import { scFetch } from "@/lib/scFetch";
import { revalidatePath } from "next/cache";
import { resetPasswordSchema } from "@/schemas";

interface ScFetchResponse {
  ok: boolean;
  status?: number;
  json: () => Promise<Record<string, unknown>>;
}

export async function resetUserPasswordAction(
  userId: string,
  newPassword: string,
) {
  try {
    const parsed = resetPasswordSchema.safeParse({ newPassword });
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Contraseña inválida",
      };
    }

    const response = (await scFetch(`/api/v1/users/${userId}/reset-password`, {
      method: "POST",
      body: JSON.stringify({ newPassword: parsed.data.newPassword }),
    })) as ScFetchResponse;

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error:
          (typeof data?.message === "string" && data.message) ||
          "Error al restablecer contraseña",
      };
    }

    revalidatePath("/dashboard/residents");

    return {
      success: true,
      data,
      message:
        (typeof data?.message === "string" && data.message) ||
        "Contraseña restablecida",
    };
  } catch (error) {
    console.error("Error resetting user password:", error);
    return {
      success: false,
      error: "Error de conexión con el servidor",
    };
  }
}
